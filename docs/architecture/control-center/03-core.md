---
title: "AKORIS Control Center — Core Engine Interfaces"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "00-vision.md"
  - "01-system-architecture.md"
  - "02-technical-architecture.md"
  - "ADR-001-control-center.md"
  - "ADR-003-core-isolation.md"
---

# 03 — Core Engine Interfaces

## 1. Objectif

Ce document définit l'**API publique du Core Engine**, le cœur métier d'AKORIS. Le Core est le seul détenteur de la logique métier — il ne dépend d'aucun framework, d'aucune interface utilisateur, et s'exécute uniquement avec Node.js natif.

Tous les moteurs listés ici sont accessibles via le point d'entrée unique du Core (`packages/core/src/index.ts`). Les interfaces (CLI, API, SDK) consomment ces services sans jamais dupliquer la logique métier.

---

## 2. Principes de conception

- **Indépendance** : aucune dépendance externe (sauf Node.js natif).
- **Immutabilité** : les moteurs prennent des entrées, retournent des résultats, ne modifient jamais l'état global.
- **Testabilité** : chaque moteur accepte ses dépendances en paramètre (injection de dépendances manuelle).
- **Prédictibilité** : pas d'effets de bord cachés ; les mutations (filesystem) sont explicites.
- **0 dépendance** : pas de librairie externe, pas de framework.

---

## 3. Architecture du Core

```
packages/core/
├── src/
│   ├── index.ts              # Barillet d'export public
│   ├── registry/
│   │   ├── reader.ts         # RegistryReader : lecture du référentiel
│   │   ├── types.ts          # Types internes du Registry
│   │   └── index.ts
│   ├── state/
│   │   ├── machine.ts        # StateMachineEngine : cycles de vie
│   │   ├── transitions.ts    # Définition des transitions
│   │   ├── types.ts
│   │   └── index.ts
│   ├── search/
│   │   ├── engine.ts         # SearchEngine : indexation et recherche
│   │   ├── indexer.ts        # Indexer : construction de l'index
│   │   ├── types.ts
│   │   └── index.ts
│   ├── prompts/
│   │   ├── engine.ts         # PromptEngine : construction et test
│   │   ├── builder.ts        # ContextBuilder : assemblage du contexte
│   │   ├── store.ts          # PromptStore : sauvegarde/lecture
│   │   ├── types.ts
│   │   └── index.ts
│   ├── logs/
│   │   ├── reader.ts         # LogReader : lecture et watch
│   │   ├── parser.ts         # Parser : parsing des logs bruts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── doctor/
│   │   ├── engine.ts         # DoctorEngine : diagnostics
│   │   ├── checks/           # Vérifications individuelles
│   │   ├── types.ts
│   │   └── index.ts
│   ├── secrets/
│   │   ├── manager.ts        # SecretManager : chiffrement/déchiffrement
│   │   ├── types.ts
│   │   └── index.ts
│   ├── alias/
│   │   ├── manager.ts        # AliasManager : résolution d'alias
│   │   ├── types.ts
│   │   └── index.ts
│   ├── quality/
│   │   ├── engine.ts         # QualityGateEngine (futur)
│   │   ├── rules.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── shared/
│       ├── errors.ts         # Erreurs métier typées
│       ├── types.ts          # Types partagés entre moteurs
│       └── utils.ts          # Utilitaires internes
├── tests/
│   ├── registry/
│   ├── state/
│   ├── search/
│   ├── prompts/
│   ├── logs/
│   ├── doctor/
│   ├── secrets/
│   └── alias/
├── package.json
└── tsconfig.json
```

---

## 4. Interfaces publiques des moteurs

### 4.1. RegistryReader

Lecture du référentiel de gouvernance (agents, règles, capacités, livrables, QG).

```typescript
class RegistryReader {
  constructor(private basePath: string);

  // Charger tout le référentiel en mémoire
  async load(): Promise<Registry>;

  // Accès aux entités
  getAgent(id: string): Promise<Agent | null>;
  listAgents(): Promise<Agent[]>;
  getRule(id: string): Promise<Rule | null>;
  listRules(): Promise<Rule[]>;
  getCapability(id: string): Promise<Capability | null>;
  listCapabilities(): Promise<Capability[]>;
  getDeliverable(id: string): Promise<Deliverable | null>;
  listDeliverables(): Promise<Deliverable[]>;
  getQualityGate(id: string): Promise<QualityGate | null>;
  listQualityGates(): Promise<QualityGate[]>;

  // Rechargement
  reload(): Promise<void>;
}
```

**Exemple d'utilisation :**
```typescript
const registry = new RegistryReader('/akoris/registry');
await registry.load();
const agent = await registry.getAgent('DEV-04');
```

---

### 4.2. StateMachineEngine

Gestion du cycle de vie des projets : états, transitions, Quality Gates.

```typescript
class StateMachineEngine {
  constructor(
    private registry: RegistryReader,
    private stateFile: string
  );

  // Lire l'état courant
  getCurrentState(): Promise<ProjectState>;

  // Lire l'historique complet
  getHistory(): Promise<Transition[]>;

  // Exécuter une transition
  transition(to: string): Promise<TransitionResult>;

  // Valider une transition (sans l'exécuter)
  validateTransition(to: string): Promise<ValidationResult>;

  // Recalculer l'état à partir du filesystem
  repairState(): Promise<RepairResult>;
}

// Résultat d'une transition
type TransitionResult = {
  success: boolean;
  from: string;
  to: string;
  timestamp: string;
  gatesPassed: string[];
  gatesFailed?: { id: string; reason: string }[];
  error?: string;
};

// Résultat de validation
type ValidationResult = {
  valid: boolean;
  gatesRequired: string[];
  gatesPassed: string[];
  gatesFailed?: { id: string; reason: string }[];
};
```

**Exemple d'utilisation :**
```typescript
const sm = new StateMachineEngine(registry, '/akoris/.akoris/state.json');
const result = await sm.transition('Planned');
if (result.success) {
  console.log(`Transition réussie : ${result.from} → ${result.to}`);
}
```

---

### 4.3. SearchEngine

Indexation et recherche fédérée dans toutes les sources (agents, règles, ADR, logs, etc.).

```typescript
class SearchEngine {
  constructor(private registry: RegistryReader);

  // Construire ou reconstruire l'index
  index(): Promise<void>;

  // Rechercher
  query(q: string, options?: SearchOptions): Promise<SearchResults>;

  // Recherche avec filtres
  queryFiltered(filters: SearchFilters): Promise<SearchResults>;
}

type SearchOptions = {
  types?: SearchSourceType[];   // Filtrer par type
  limit?: number;               // Nombre max de résultats
  fuzzy?: boolean;              // Tolérance aux fautes
};

type SearchFilters = {
  types?: SearchSourceType[];
  tags?: string[];
  agents?: string[];
  dateFrom?: string;
  dateTo?: string;
};

type SearchResults = {
  query: string;
  total: number;
  results: SearchResult[];
};

type SearchResult = {
  type: SearchSourceType;
  id: string;
  title: string;
  description?: string;
  match: string;
  score: number;
};

type SearchSourceType =
  | 'agent'
  | 'rule'
  | 'capability'
  | 'deliverable'
  | 'adr'
  | 'log'
  | 'prompt';
```

**Exemple d'utilisation :**
```typescript
const search = new SearchEngine(registry);
await search.index();
const results = await search.query('transition Draft Planned');
console.log(`${results.total} résultats trouvés`);
```

---

### 4.4. PromptEngine

Construction contextuelle de prompts, envoi à un LLM, sauvegarde dans la Prompt Library.

```typescript
class PromptEngine {
  constructor(
    private registry: RegistryReader,
    private store: PromptStore
  );

  // Construire un prompt à partir d'un agent et d'un contexte
  build(options: BuildOptions): Promise<ParsedPrompt>;

  // Tester un prompt sur un LLM
  test(prompt: ParsedPrompt, llm: LLMConfig): Promise<PromptTestResult>;

  // Sauvegarder un prompt
  save(prompt: SavedPrompt): Promise<void>;

  // Lister les prompts sauvegardés
  list(): Promise<SavedPrompt[]>;

  // Charger un prompt sauvegardé
  load(id: string): Promise<SavedPrompt | null>;

  // Supprimer un prompt
  delete(id: string): Promise<void>;
}

type BuildOptions = {
  agentId: string;
  context: {
    includeAdr?: boolean;
    includeRegistry?: boolean;
    includeRecentLogs?: boolean;
    includeCapabilities?: boolean;
    customInstructions?: string;
  };
};

type ParsedPrompt = {
  agentId: string;
  system: string;
  context: string;
  instructions: string;
  full: string;       // Prompt complet assemblé
};

type LLMConfig = {
  provider: 'openai' | 'anthropic';
  model: string;
  temperature?: number;
  maxTokens?: number;
};

type PromptTestResult = {
  request: ParsedPrompt;
  response: string;
  duration: number;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
};

type SavedPrompt = {
  id: string;
  name: string;
  description?: string;
  agentId: string;
  prompt: ParsedPrompt;
  createdAt: string;
  updatedAt: string;
};
```

**Exemple d'utilisation :**
```typescript
const prompts = new PromptEngine(registry, promptStore);
const prompt = await prompts.build({
  agentId: 'DEV-04',
  context: { includeAdr: true, includeRegistry: true }
});
console.log(prompt.full);
```

---

### 4.5. LogReader

Lecture et surveillance en temps réel des logs d'AKORIS.

```typescript
class LogReader {
  constructor(private logDir: string);

  // Lire les dernières entrées
  read(lines?: number, agent?: string): Promise<LogEntry[]>;

  // Lire avec pagination
  readRange(options: ReadRangeOptions): Promise<LogEntry[]>;

  // Watcher temps réel
  watch(callback: (entry: LogEntry) => void, filter?: LogFilter): () => void;

  // Arrêter le watcher
  stopWatching(): void;

  // Rechercher dans les logs
  search(q: string, options?: SearchOptions): Promise<LogEntry[]>;
}

type ReadRangeOptions = {
  from?: string;      // Date/Timestamp
  to?: string;        // Date/Timestamp
  agent?: string;     // Filtre par agent
  limit?: number;
  offset?: number;
};

type LogFilter = {
  agents?: string[];
  actions?: string[];
  level?: string;
};

type LogEntry = {
  timestamp: string;
  agentId: string;
  action: string;
  details: string;
  level: 'info' | 'warn' | 'error';
  metadata?: Record<string, unknown>;
};
```

**Exemple d'utilisation :**
```typescript
const logs = new LogReader('/akoris/.akoris/logs');
const entries = await logs.read(20, 'CORE-01');
entries.forEach(e => console.log(`[${e.level}] ${e.action}: ${e.details}`));
```

---

### 4.6. DoctorEngine

Diagnostic et réparation de l'état du projet AKORIS.

```typescript
class DoctorEngine {
  constructor(
    private registry: RegistryReader,
    private state: StateMachineEngine,
    private logReader: LogReader
  );

  // Diagnostic complet
  diagnose(): Promise<DiagnosisReport>;

  // Exécuter une vérification spécifique
  runCheck(checkName: string): Promise<CheckResult>;

  // Réparer automatiquement
  fix(): Promise<FixReport>;

  // Réparer un problème spécifique
  fixIssue(issueId: string): Promise<FixResult>;
}

type DiagnosisReport = {
  timestamp: string;
  status: 'healthy' | 'warning' | 'error';
  checks: CheckResult[];
  summary: {
    passed: number;
    warnings: number;
    errors: number;
  };
};

type CheckResult = {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'error';
  message: string;
  suggestion?: string;
};

type FixReport = {
  fixed: number;
  failed: number;
  fixes: FixResult[];
};

type FixResult = {
  checkId: string;
  status: 'fixed' | 'failed' | 'skipped';
  message: string;
};
```

**Exemple d'utilisation :**
```typescript
const doctor = new DoctorEngine(registry, stateMachine, logReader);
const report = await doctor.diagnose();
if (report.status !== 'healthy') {
  console.log(`${report.summary.errors} erreurs détectées`);
  await doctor.fix();
}
```

---

### 4.7. SecretManager

Chiffrement et déchiffrement des secrets d'environnement.

```typescript
class SecretManager {
  constructor(private secretsFile: string);

  // Initialiser le fichier de secrets (génère une clé AES)
  init(): Promise<void>;

  // Définir un secret
  set(key: string, value: string): Promise<void>;

  // Lire un secret
  get(key: string): Promise<string | null>;

  // Lister les clés
  list(): Promise<string[]>;

  // Supprimer un secret
  delete(key: string): Promise<void>;

  // Exporter les secrets (déchiffrés, stdout)
  export(): Promise<Record<string, string>>;
}
```

**Exemple d'utilisation :**
```typescript
const secrets = new SecretManager('/akoris/.akoris/secrets.enc');
await secrets.init();
await secrets.set('OPENAI_API_KEY', 'sk-...');
const key = await secrets.get('OPENAI_API_KEY');
```

---

### 4.8. AliasManager

Résolution et gestion des alias de commandes.

```typescript
class AliasManager {
  constructor(
    private registry: RegistryReader,
    private aliasesFile: string
  );

  // Charger les alias
  load(): Promise<void>;

  // Résoudre un alias
  resolve(input: string): Promise<ResolvedAlias | null>;

  // Créer un alias
  set(name: string, command: string): Promise<void>;

  // Supprimer un alias
  delete(name: string): Promise<void>;

  // Lister tous les alias
  list(): Promise<AliasEntry[]>;
}

type AliasEntry = {
  name: string;
  command: string;
  description?: string;
  createdAt: string;
};

type ResolvedAlias = {
  original: string;
  alias: string;
  command: string;
};
```

---

### 4.9. QualityGateEngine (futur)

Validation automatisée des Quality Gates sur les transitions d'état.

```typescript
// Défini dans `quality/engine.ts`
// Non implémenté en v1.0

class QualityGateEngine {
  constructor(private registry: RegistryReader);

  // Évaluer les QG requis pour une transition
  evaluate(from: string, to: string): Promise<QualityGateResult[]>;

  // Exécuter un QG spécifique
  execute(gateId: string): Promise<QualityGateResult>;
}
```

---

## 5. Erreurs métier

Toutes les erreurs du Core sont typées et exportées.

```typescript
class CoreError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public suggestion?: string
  );
}

type ErrorCode =
  // Registry
  | 'AGENT_NOT_FOUND'
  | 'RULE_NOT_FOUND'
  | 'CAPABILITY_NOT_FOUND'
  | 'REGISTRY_LOAD_FAILED'
  // State Machine
  | 'INVALID_TRANSITION'
  | 'STATE_NOT_FOUND'
  | 'TRANSITION_DENIED'
  | 'GATE_FAILED'
  | 'STATE_FILE_CORRUPTED'
  // Search
  | 'INDEX_NOT_BUILT'
  | 'SEARCH_QUERY_EMPTY'
  // Prompts
  | 'AGENT_HAS_NO_PROMPT'
  | 'PROMPT_BUILD_FAILED'
  | 'PROMPT_NOT_FOUND'
  | 'LLM_CALL_FAILED'
  | 'UNSUPPORTED_LLM_PROVIDER'
  // Logs
  | 'LOG_DIR_NOT_FOUND'
  | 'LOG_READ_FAILED'
  // Doctor
  | 'FIX_FAILED'
  | 'CHECK_NOT_FOUND'
  // Secrets
  | 'SECRETS_FILE_NOT_FOUND'
  | 'SECRETS_DECRYPT_FAILED'
  | 'SECRETS_ENCRYPT_FAILED'
  | 'SECRET_NOT_FOUND'
  // Alias
  | 'ALIAS_NOT_FOUND'
  | 'ALIAS_ALREADY_EXISTS';
```

**Exemple :**
```typescript
import { CoreError } from '@akoris/core';
throw new CoreError(
  'Agent DEV-99 not found',
  'AGENT_NOT_FOUND',
  'Check registry/agents/ for available agents'
);
```

---

## 6. Point d'entrée public (`index.ts`)

```typescript
// Moteurs
export { RegistryReader } from './registry';
export { StateMachineEngine } from './state';
export { SearchEngine } from './search';
export { PromptEngine } from './prompts';
export { LogReader } from './logs';
export { DoctorEngine } from './doctor';
export { SecretManager } from './secrets';
export { AliasManager } from './alias';
export { QualityGateEngine } from './quality'; // futur

// Types partagés
export type {
  Agent, Rule, Capability, Deliverable, QualityGate, Registry
} from './registry/types';

export type {
  ProjectState, Transition, TransitionResult, ValidationResult
} from './state/types';

export type {
  SearchResults, SearchResult, SearchOptions, SearchFilters
} from './search/types';

export type {
  ParsedPrompt, BuildOptions, LLMConfig, PromptTestResult, SavedPrompt
} from './prompts/types';

export type {
  LogEntry, LogFilter, ReadRangeOptions
} from './logs/types';

export type {
  DiagnosisReport, CheckResult, FixReport, FixResult
} from './doctor/types';

export type {
  AliasEntry, ResolvedAlias
} from './alias/types';

// Erreurs
export { CoreError } from './shared/errors';
export type { ErrorCode } from './shared/errors';
```

---

## 7. Règles d'utilisation

- **Le Core n'écrit jamais directement dans l'interface utilisateur** (pas de `console.log`, pas de `process.stdout`).
- **Le Core ne gère pas les arguments CLI** (pas de `process.argv`).
- **Le Core ne gère pas les requêtes HTTP** (pas de `req`, `res`).
- **Le Core ne dépend d'aucun framework** (pas de Fastify, pas de React).
- **Le Core est synchrone ou asynchrone** selon les besoins, mais toujours prédictible.
- **Toutes les opérations filesystem sont explicitement paramétrées** (injection du chemin).

---

## 8. Cohérence avec le Blueprint

- Le Core est **unique et indépendant** (Vision, principe #1).
- Le Core est **testable sans interface** (Architecture système).
- Les moteurs sont **découplés** (monorepo, packages séparés).
- Les erreurs sont **typées et listées** (cohérence API).
- Le Core **ne fait pas d'accès direct** à l'UI (contrainte d'architecture).

---

## 9. Prochaine étape

Une fois ce document validé, nous rédigerons les **ADR manquants** (ADR-002 monorepo, ADR-003 core isolation, ADR-004 Fastify) puis les **diagrammes** (séquence, classes, composants détaillés).

---

## Statut

- `00-vision.md` : **Approved**
- `01-system-architecture.md` : **Approved**
- `02-technical-architecture.md` : **Approved**
- `03-core.md` : **Draft** (prêt pour revue)

**Prochaine action** : Si vous validez ce document, je rédige les **ADR manquants** (ADR-002, ADR-003, ADR-004) et les **diagrammes de séquence détaillés**. Sinon, indiquez-moi les ajustements nécessaires.
