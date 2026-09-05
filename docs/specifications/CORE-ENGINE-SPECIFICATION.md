# CORE ENGINE SPECIFICATION v0.1

> **Version** : 0.1
> **Statut** : Proposed / Architecture Draft
> **Date** : 2026-09-05
> **Auteur** : AKORIS Core Team
> **Dépend de** : Constitution v1.0.1, Gouvernance v1.0.1, Terminologie v1.0.1, ARS v1.0.1
>
> **Verdict de relecture** : GO pour Sprint 1 — **Sprint 3 (v0.3.0, Governance Runtime) verrouillé** tant que les contrats d'autorité, de preuve, de persistance et de concurrence ne sont pas amendés **et couverts par des tests d'invariants**.

---

## 1. Périmètre de `@akoris/core`

`@akoris/core` est le **noyau logique** d'AKORIS. Il contient **uniquement** la logique de gouvernance. Il n'effectue **aucune I/O directe** (pas de lecture/écriture disque, pas de réseau, pas de variables d'environnement). Toute interaction avec le monde extérieur passe par des **ports injectés** (`ProjectStore`, `SnapshotPersister`, `LLMProvider`, etc.) dont les effets sont contrôlés par la couche runtime.

### 1.1. Ce que le Core contient

| Élément | Description |
|---|---|
| **Types** | Tous les modèles de données (Agent, State, LogEntry, etc.) |
| **Invariants** | Règles normatives du noyau de gouvernance (voir §3.1) |
| **Engines** | 7 moteurs métier (Registry, State, Quality, Search, Logs, Doctor, Prompts) |
| **Managers** | 3 gestionnaires (Secrets, Aliases, EventBus) |
| **EventBus** | Système d'événements typé (log:entry, state:transition) |
| **Erreurs** | NotFoundError, TransitionError, ValidationError, VersionConflictError, PersistenceError |

### 1.2. Ce que le Core ne contient PAS

- ❌ Lecture/écriture de fichiers (déléguées via `ProjectStore` / `SnapshotPersister`)
- ❌ Appels réseau / HTTP
- ❌ Accès aux variables d'environnement (sauf via injection explicite de la couche appelante)
- ❌ Interface utilisateur (CLI, Dashboard)
- ❌ Serveur HTTP / WebSocket
- ❌ Authentification / RBAC

### 1.3. Hors périmètre v1.0.0

Les composants suivants ne font **PAS** partie du périmètre fonctionnel des versions v0.1.0 à v1.0.0 :

- **Evidence Engine** (E2/E3) — seule la trace E1 (SHA-256 chaîné) est intégrée
- **Policy Engine** — les politiques sont lues, pas exécutées
- **Decision Engine** — la décision humaine est externe (`HUMAN_DECISION`)
- **Audit Engine** — l'audit est un rapport, pas un moteur
- **HttpLLMProvider** — l'implémentation HTTP est reportée à l'adaptateur/SDK (`@akoris/ai`)

Ces composants constituent des extensions post-v1.0.

---

## 2. Architecture et frontières

### 2.1. Couches

```
┌─────────────────────────────────────────────────────────────────┐
│                      MÉTHODE AKORIS                             │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   @akoris/io  │     │  @akoris/core │     │  @akoris/sdk  │
│  (Persistance)│◄────│  (LOGIQUE)    │────►│  (Client TS)  │
└───────────────┘     └───────────────┘     └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Fichiers     │     │  Moteurs      │     │  API REST     │
│  .akoris/     │     │  purs         │     │  WebSocket    │
└───────────────┘     └───────────────┘     └───────────────┘
                              │
                              ▼
                     ┌───────────────┐
                     │  @akoris/cli  │
                     │  (Terminal)   │
                     └───────────────┘
```

### 2.2. Règles de dépendances

| Package | Dépend de |
|---|---|
| `@akoris/core` | Rien (sauf Node.js natif) |
| `@akoris/io` | `@akoris/core` (types) |
| `@akoris/sdk` | `@akoris/core` (types) |
| `@akoris/cli` | `@akoris/core` + `@akoris/io` |
| `@akoris/api` | `@akoris/core` + `@akoris/io` |
| `@akoris/dashboard` | `@akoris/sdk` |

### 2.3. Inversion de dépendance et événements

Le Core ne connaît **pas** le filesystem. Il reçoit un port injecté (`ProjectStore`, `SnapshotPersister`) qui lui fournit les données.

```
CLI/API
    │
    ├── lit AKORIS_MASTER_KEY (process.env)
    │
    ▼
createCore({
    store: new FileSystemStore('/projet'),
    masterKey: process.env.AKORIS_MASTER_KEY
})
    │
    ▼
Core (pur)
```

**Événements et persistance (règle normative)** :

> L'événement **n'est PAS transactionnel** avec la persistance. Si la persistance réussit mais que l'émission de l'événement échoue (callback lève une exception), l'événement est **perdu**. Pour les cas critiques, un mécanisme **outbox / retry** doit être géré par la couche appelante (`@akoris/io` ou le client). **Le Core ne garantit pas la livraison des événements, uniquement la persistance de l'état.**

---

## 3. Principes non négociables

1. **Pure Logic, Zero I/O** — Le Core n'effectue **aucune I/O directe** ; il peut invoquer des **ports injectés** (`ProjectStore`, `SnapshotPersister`, `LLMProvider`) dont les effets sont contrôlés par la couche runtime.
2. **No Hidden Global State** — Les engines sont instanciables. Aucun état global ou singleton implicite. Tout état est injecté, explicitement détenu ou récupéré via un contrat.
3. **Single Source of Truth** — Un seul modèle de données (`types.ts`).
4. **Event-Driven** — `EventBus` typé pour les communications asynchrones (émission non transactionnelle, isolée).
5. **Extensible via Composition** — Pas d'héritage. Injection de dépendances.
6. **Testabilité Totale** — Fonctions pures + classes instanciables → 100% unit testable.
7. **Portabilité** — Même Core dans CLI, API, WebSocket, SDK, Tests, CI.
8. **Auditabilité** — Toute décision passe par le Core → traçabilité complète.
9. **Zéro Dépendance Runtime** — Core n'importe que `node:crypto` (hashes et chiffrement). Les dépendances de build/test (TypeScript, tsup, Vitest, ESLint) sont des dépendances dev **auditées**.

### 3.1. Invariants normatifs (du noyau de gouvernance)

Règles impératives, chacune couverte par des **tests d'invariants** (Sprint 3 verrouillé) :

| # | Invariant | Enoncé |
|---|---|---|
| **I-1** | **Atomicité de transition** | Une transition est soit **committée** (état mémoire mis à jour) soit **rejetée**. En cas d'échec de persistance ou de gates, **aucune mutation** de l'état en mémoire, de l'historique ou des événements. |
| **I-2** | **Snapshot = source de vérité** | L'état courant et l'historique sont reconstruits depuis le snapshot. La reconstruction est **idempotente**. |
| **I-3** | **Événement non transactionnel** | La persistance précède l'émission. Une erreur de `emit()` n'affecte pas le résultat `committed`. L'événement porte une **copie** de la transition persistée, jamais une référence mutable. |
| **I-4** | **Concurrence monoprocédure** | Le Core est mono-thread en mémoire. La **réentrance est interdite** pendant une transition (guard de réentrance). Pour plusieurs processus, la garantie est portée par `ProjectStore` (version optimiste). |
| **I-5** | **Autorisation vérifiée** | `authorizedBy.roles` doit être compatible avec la transition (`TransitionDef.authorizedBy`). `actorId` doit exister dans le Registry. Un agent **artificiel** ne peut **jamais** porter le rôle `HUMAN_DECISION`. |
| **I-6** | **Reprise sans merge** | En cas de conflit de version, le Core émet `VersionConflictError` ; il ne tente **jamais** de merge automatique. L'appelant recharge et réessaie. |
| **I-7** | **Frontière des secrets** | Les secrets en clair n'apparaissent **jamais** dans logs, snapshots, événements, diagnostics ni erreurs. `FullSnapshot` contient uniquement des `EncryptedSecret`. |
| **I-8** | **Immutabilité de l'historique** | L'historique est append-only. Aucune entrée n'est mutée, altérée ou supprimée après création. Un correctif passe par une nouvelle entrée. |

---

## 4. Modèle de données

### 4.1. Agent

```typescript
export interface Agent {
  id: string;                    // "CORE-01"
  name: string;                  // "Orchestrator"
  version: string;               // "1.0.0"
  domain: 'CORE' | 'DEV' | 'QA' | 'EXP' | 'GOV';
  criticity: 'critique' | 'haute' | 'moyenne' | 'basse';
  status: 'active' | 'inactive' | 'deprecated' | 'draft';
  mission: string;
  responsibilities: string[];
  limits: string[];
  dependencies: AgentDependency[];
  capabilities: Capability[];
}

export interface AgentDependency {
  agentId: string;
  type: 'mandatory' | 'optional';
  description?: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  type: 'can' | 'cannot';
}
```

### 4.2. State Machine

```typescript
export interface State {
  id: string;                    // "PROPOSITION"
  name: string;                  // "Proposition"
  phase: string;                 // "initiation"
  description: string;
}

export interface TransitionDef {
  id?: string;                   // Optionnel — synthèse from→to si absent
  from: string;
  to: string;
  requires: string[];            // Gate IDs ("QG-PROPOSITION")
  authorizedBy: string[];        // RÔLES requis (VALIDATOR, HUMAN_DECISION, MAINTAINER)
  required: boolean;
}

export interface StateMachine {
  version: string;               // "1.0.1"
  initialState: string;
  terminalStates: string[];
  states: State[];
  transitions: TransitionDef[];
  exceptionStates: {
    [key: string]: {
      from: string[];
      to: string[];
    };
  };
}
```

> **Note** : `TransitionDef.authorizedBy` contient des **rôles** (ex. `VALIDATOR`, `HUMAN_DECISION`, `MAINTAINER` — conforme au `state-machine.json` réel), **pas** des IDs d'agents. L'acteur concret (qui) est porté par `AuthorizationContext` (§4.14).

### 4.3. Evidence (E1) et historique

```typescript
export interface EvidenceE1 {
  id: string;                    // UUID (v4)
  level: 'E1';
  type: 'transition-hash';
  artifactRef: string;           // ID de l'artefact concerné
  author: string;                // ID de l'acteur
  timestamp: string;             // ISO 8601
  source: string;                // "state-machine"
  algorithm: 'SHA-256';
  hash: string;                  // SHA-256 de la représentation canonique
  previousHash?: string;         // Lien vers l'entrée précédente (hash chaîné)
  canonicalPayloadVersion: '1';  // Version de la représentation canonique
  createdAt: string;             // ISO 8601
}

export interface TransitionHistoryItem {
  id: string;                     // UUID (v4)
  from: string;
  to: string;
  at: string;                     // ISO 8601
  authorizedBy: AuthorizationContext;  // Voir §4.14
  comment?: string;
  evidence: EvidenceE1;           // Preuve E1
}

export interface TransitionResult {
  transitionId: string;
  newState: string;
  history: TransitionHistoryItem;
  gateEvaluations: GateEvaluation[];   // Remplaçait gatesStatus (voir §4.7)
  persistedVersion: number;
}

export interface StatePersistence {
  current: string;
  history: TransitionHistoryItem[];
  machineVersion: string;
}
```

**Représentation canonique pour le hash E1 :**

| Règle | Valeur |
|---|---|
| Champs inclus (`canonicalPayloadVersion: '1'`) | `type`, `artifactRef`, `author`, `timestamp`, `source`, `id`, `from`, `to`, `previousHash` |
| Champs exclus | `hash` (dépendance circulaire), `createdAt`, `evidence` |
| Ordre des clés | **Alphabétique** (`JSON.stringify` trié) |
| Encodage | UTF-8 sans BOM |
| Format | JSON serialisé sans espace |

> **Règle** : Le hash E1 est une **détection d'altération**, pas une preuve d'identité ni une preuve d'immutabilité externe. La preuve d'identité relève de E2/E3 (hors périmètre v1.0.0). Les **vecteurs de test fixes** (entrée → JSON canonique → SHA-256 attendu) sont définis dans le plan (Sprint 1) et exigés par le DoD.

### 4.4. Quality Gates — Définition vs Exécution

```typescript
export type GateStatusValue = 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';

// Définition SÉRIALISABLE (stockée dans le Registry)
export interface GateDefinition {
  id: string;                    // "QG-PROPOSITION"
  version: string;               // "1.0.0"
  criteria: CriterionDefinition[];
  evaluatorIds: string[];        // Noms d'évaluateurs (ex: "field_exists")
  requiredEvidenceLevels: ('E1' | 'E2' | 'E3')[];
  blocking: boolean;             // true = bloque la transition (déduit de severity==='bloquante' si absent)
  threshold?: number;            // 0-1, optionnel
}

export interface CriterionDefinition {
  id: string;
  name: string;
  evaluator: string;             // "field_exists" | "semantic_analysis" | ...
  params: Record<string, unknown>;
  weight: number;                // 0-1
}

export interface GateContext {
  currentState: string;
  history: TransitionHistoryItem[];
  logs: LogEntry[];
}

// Résultat d'évaluation (retourné par QualityGateEngine)
export interface GateEvaluation {
  gateId: string;
  gateVersion: string;
  status: 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';
  criterionResults: CriterionResult[];
  evidenceRefs: string[];
  evaluatedAt: string;           // ISO 8601
}

export interface CriterionResult {
  criterionId: string;
  status: 'PASS' | 'FAIL';
  score: number;                 // 0-1
  details: string;
}

// Runtime — injecté dans QualityGateEngine
export interface GateEvaluator {
  id: string;
  evaluate(ctx: GateContext, params: Record<string, unknown>): { status: 'PASS' | 'FAIL'; score: number; details: string };
}
```

**Règle de décision d'un Quality Gate (v1) :**

1. Tous les critères **bloquants** (`blocking: true`) doivent être `PASS`.
2. **Aucun** critère requis ne peut être `PENDING`.
3. Si un `threshold` existe, la **moyenne pondérée** des scores doit être ≥ `threshold`.

**Quality Gate vs Decision Gate :**

| Mécanisme | Nature | Résultat | Autorité |
|---|---|---|---|
| **Quality Gate** | Contrôle technique | PASS / FAIL / PENDING | Automatisé (Core) |
| **Decision Gate** | Décision humaine | GO / NO-GO / CONDITIONAL | Humain (externe, `HUMAN_DECISION`) |

Le Core prépare le contexte de décision mais ne décide pas à la place de l'humain. La transition `VALIDATED → RELEASED` nécessite un Decision Gate humain. Un agent **artificiel** ne peut jamais porter `HUMAN_DECISION`.

### 4.5. Logs

```typescript
export interface LogEntry {
  id: string;                    // UUID (v4)
  timestamp: string;             // ISO 8601
  level: 'info' | 'warn' | 'error' | 'debug';
  agent: string;                 // Agent ID
  message: string;
  details?: Record<string, unknown>;
}

export interface LogFilter {
  lines?: number;
  agent?: string;
  level?: LogEntry['level'];
  since?: string;
}
```

### 4.6. Secrets — EncryptedSecret

```typescript
export interface EncryptedSecret {
  key: string;
  ciphertext: string;            // Valeur chiffrée (Base64)
  nonce: string;                 // IV (Base64)
  salt: string;                  // Salt (Base64) — aléatoire par enveloppe
  tag: string;                   // Auth tag (Base64)
  formatVersion: '1';
  createdAt: string;
  updatedAt: string;
}

// SecretManager retourne Secret (DÉCHIFFRÉ) mais persiste EncryptedSecret
export interface Secret {
  key: string;
  value: string;                 // Déchiffré (retourné par getSecret)
  createdAt: string;
  updatedAt: string;
}
```

**Règles (invariant I-7) :**
- Les secrets ne sont **jamais** stockés en clair dans le Core. `FullSnapshot` contient `EncryptedSecret[]`.
- Les secrets en clair n'apparaissent pas dans logs, snapshots, événements, diagnostics ni erreurs.
- `salt` est **aléatoire par enveloppe** (jamais fixe). Paramètres scrypt : `N=16384, r=8, p=1`.

### 4.7. Aliases

```typescript
export interface Alias {
  name: string;
  command: string;
  description: string;
}
```

### 4.8. Prompts & LLM

```typescript
export interface PromptVariableDef {
  key: string;                   // "agent:name"
  label: string;                 // "Agent Name"
  source: 'agent' | 'state' | 'logs' | 'system';
  required?: boolean;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;                    // UUID (v4)
  name: string;
  description: string;
  tags: string[];
  template: string;              // avec {{source:key}}
  variables: PromptVariableDef[];
  createdAt: string;
  updatedAt: string;
}

export interface ResolvedPrompt {
  templateId: string;
  templateName: string;
  original: string;
  resolved: string;              // Variables remplacées
  variables: Record<string, string>;
  tokenEstimate: number;
}

export interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  latencyMs: number;
  timestamp: string;
}

export interface LLMProvider {
  name: string;
  generate(request: LLMRequest): Promise<LLMResponse>;
  stream?(request: LLMRequest): AsyncIterable<string>;
}
```

**Contrat borné du LLM (invariant de sécurité) :**
- Chaque appel LLM doit être borné : **timeout**, **cancellation**, **taille max** de prompt/réponse.
- **Redaction** : aucun secret ne transite vers le provider ; contexte issu des logs **borné**.
- La substitution de variables est protégée contre l'**injection de templates** : échappement, variables inconnues → `[unresolved]`, aucune récursion.
- **Provenance** : le provider, le modèle et le `usage` sont tracés dans `LLMResponse`.
- L'orchestration LLM étendue (coûts, quotas, retries, streaming avancé) est **hors Core** (future `@akoris/ai` / SDK). Le Core expose `PromptEngine` pour la résolution déterministe + port `LLMProvider`.

### 4.9. Registry

```typescript
export interface RegistryIndex {
  version: string;               // "1.0.1"
  agentCount: number;            // DÉRIVÉ de la collection (jamais déclaratif non vérifié)
  domains: string[];
  lastUpdated: string;
}

export interface AgentFilter {
  domain?: string;
  status?: string;
  criticity?: string;
  tag?: string;
}
```

### 4.10. Search

```typescript
export interface SearchQuery {
  q: string;
  type?: 'agent' | 'capability' | 'tag';  // 'tag' conservé extensible (inert à v1.0.0)
  limit?: number;
}

export interface SearchResult {
  agents: Agent[];
  count: number;
  query: SearchQuery;
}
```

### 4.11. Doctor

```typescript
export interface DoctorIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
  fixActionId?: string;          // Référence à une action injectée (jamais une fonction)
}

export interface DoctorContext {
  logs: LogEntry[];
  history: TransitionHistoryItem[];
  currentState: string;
  secretsCount: number;
  agentsCount: number;
}

export interface FixReport {
  fixed: string[];
  failed: string[];
}

export type DoctorFixAction = (issueId: string) => Promise<boolean>;
```

### 4.12. ProjectStore — Snapshot atomique + version optimiste

```typescript
export interface FullSnapshot {
  version: number;               // Révision monotone (incrémentée à chaque save)
  machineVersion: string;        // Version de la State Machine ("1.0.1")
  instanceId: string;            // UUID de l'instance (détecte les mélanges)
  state: StatePersistence;
  logs: LogEntry[];
  secrets: EncryptedSecret[];    // EncryptedSecret, PAS Secret
  aliases: Alias[];
  templates: PromptTemplate[];
  checksum: string;              // SHA-256 du snapshot complet
  savedAt: string;               // ISO 8601
}

export interface ProjectStore {
  // Version optimiste
  saveSnapshotIfVersion(
    expectedVersion: number,
    snapshot: FullSnapshot
  ): Promise<{ success: true } | { success: false; currentVersion: number; error: 'CONFLICT' }>;

  loadSnapshot(): Promise<FullSnapshot | null>;
}
```

**Comportement en cas de conflit :**
- Le moteur émet une erreur `VersionConflictError` (§7).
- L'appelant (CLI/API) doit **recharger l'état et réessayer**.
- Le Core **ne tente pas** de merge automatiquement (invariant I-6).

### 4.13. TransitionOutcome et TransitionContext

```typescript
export type TransitionOutcome =
  | { status: 'committed'; result: TransitionResult }
  | { status: 'rejected'; error: TransitionError }
  | { status: 'persistence-failed'; error: PersistenceError }
  | { status: 'conflict'; error: VersionConflictError };

export interface TransitionContext {
  from: string;
  to: string;
  authorizedBy: AuthorizationContext;
  comment?: string;
}
```

### 4.14. AuthorizationContext

```typescript
export interface AuthorizationContext {
  actorId: string;               // Identifiant de l'acteur (doit exister dans le Registry)
  actorType: 'human' | 'artificial' | 'system';
  roles: string[];               // ["VALIDATOR", "SUPERVISOR"]
  decisionRef?: string;          // Référence à une décision externe
  authenticatedAt?: string;      // ISO 8601
}
```

**Règles (invariant I-5) :**
- Le moteur valide que `roles` est compatible avec `TransitionDef.authorizedBy` de la transition.
- `actorId` doit exister dans le Registry.
- Un agent **artificiel** ne peut **jamais** avoir le rôle `HUMAN_DECISION`.

---

## 5. Engines

### 5.1. RegistryReader

```typescript
export class RegistryReader {
  constructor(agents: Agent[]);

  loadIndex(): RegistryIndex;                 // agentCount DÉRIVÉ de la collection
  listAgents(filter?: AgentFilter): { agents: Agent[]; count: number };
  loadAgent(id: string): Agent;               // throw NotFoundError
  getDependencies(id: string): AgentDependency[];
  getCapabilities(id: string): Capability[];
  validateDependencies(): ValidationIssue[];  // cycles, mandatory absentes, inactif référencé
}
```

### 5.2. StateMachineEngine — Atomicité

```typescript
export interface SnapshotPersister {
  saveSnapshotIfVersion(expectedVersion: number, snapshot: FullSnapshot): Promise<SaveSnapshotResult>;
  loadSnapshot(): Promise<FullSnapshot | null>;
}

export class StateMachineEngine {
  constructor(
    machine: StateMachine,
    persister: SnapshotPersister,        // INJECTÉ — source de vérité (§2.3, I-2)
    initialStateId?: string,
    gateEngine?: QualityGateEngine,
    bus?: EventBus
  );

  // Lecture
  loadMachine(): StateMachine;
  getCurrentState(): { currentState: string };
  getHistory(): TransitionHistoryItem[];
  getStateSnapshot(): StatePersistence;
  restoreState(snapshot: StatePersistence): void;   // charge snapshot, pas de merge

  // Logs (pour gates)
  setLogs(logs: LogEntry[]): void;

  // Transition (atomique, async)
  transition(context: TransitionContext): Promise<TransitionOutcome>;
}
```

**Séquence de transition corrigée (atomicité, I-1) :**

```
1. Guard de réentrance (une seule transition à la fois)
2. Vérifier context.from === currentState
3. Trouver TransitionDef (from→to)
4. Vérifier context.authorizedBy.roles ⊆ TransitionDef.authorizedBy
   → sinon return { status: 'rejected', error: TransitionError }
5. Vérifier actorId existe dans le Registry (via RegistryReader/agents injectés)
6. Évaluer requiredGates via gateEngine
7. Si gates FAIL → return { status: 'rejected', error: TransitionError }
8. Préparer copie (copy-on-write) du nouvel état + historyItem
   → Calculer SHA-256 de la représentation canonique (E1, §4.3)
9. PERSISTER via persister.saveSnapshotIfVersion(version, snapshot optimiste)
10. Si échec → return { status: 'persistence-failed' | 'conflict', error: ... }  // AUCUNE mutation
11. Si succès → COMMITTER l'état en mémoire (remplacer l'état courant)
12. Émettre bus.emit({ type: 'state:transition', payload: copie de la transition persistée })
    // Événement NON transactionnel — une erreur de listener n'affecte pas le commit
13. Retourner { status: 'committed', result }
```

### 5.3. QualityGateEngine

```typescript
export class QualityGateEngine {
  constructor(evaluators?: GateEvaluator[]);

  listGates(): GateDefinition[];          // Définitions sérialisables
  evaluate(gateIds: string[], ctx: GateContext): GateEvaluation[];
  evaluateAll(ctx: GateContext): GateEvaluation[];
}
```

**Règle de décision** : tous les critères `blocking: true` = `PASS`, aucun `PENDING`, moyenne pondérée ≥ `threshold` si présent (§4.4).

### 5.4. SearchEngine

```typescript
export class SearchEngine {
  constructor(agents: Map<string, Agent>, registry: RegistryReader);

  search(query: SearchQuery): SearchResult;
}
```

### 5.5. LogReader — append-only

```typescript
export class LogReader {
  constructor(seedLogs?: LogEntry[], bus?: EventBus, options?: { maxEntries?: number });

  onLog(cb: (entry: LogEntry) => void): () => void;  // returns unsubscribe
  append(entry: LogEntry): void;                     // append-only (cap maxEntries)
  getAllLogs(): LogEntry[];                          // paginé si large
  readLogs(filter?: LogFilter): LogEntry[];
  // clearLogs() : réservé aux STORES DE TEST — PAS dans l'API de production (auditabilité)
}
```

### 5.6. DoctorEngine

```typescript
export class DoctorEngine {
  constructor(actions?: Record<string, DoctorFixAction>);

  setContext(ctx: Partial<DoctorContext>): void;
  diagnose(): DoctorIssue[];                        // pur
  planFixes(issues?: DoctorIssue[]): DoctorIssue[]; // pur — prévisualisation
  applyFixes(issueIds?: string[]): Promise<FixReport>;  // autorisé + audité (Promise!)
  fix(issueIds?: string[]): Promise<FixReport>;     // = planFixes + applyFixes (audité)
}
```

**Règle** : une action de correction n'est **jamais** exécutée uniquement parce qu'un `fixActionId` apparaît dans le diagnostic. `fix()` est `async` (les actions sont des `Promise<boolean>`), produit une **prévisualisation**, demande une **autorisation** et crée une **entrée d'audit**.

### 5.7. PromptEngine

```typescript
export class PromptEngine {
  constructor(
    registry: RegistryReader,
    stateMachine: StateMachineEngine,
    logReader: LogReader,
    providers?: LLMProvider[]
  );

  // Templates (déterministe)
  createTemplate(name: string, description: string, template: string, tags?: string[]): PromptTemplate;
  updateTemplate(id: string, data: Partial<PromptTemplate>): PromptTemplate;
  deleteTemplate(id: string): void;
  getTemplate(id: string): PromptTemplate;          // throw NotFoundError
  listTemplates(filter?: { search?: string; tag?: string }): PromptTemplate[];
  importTemplates(templates: PromptTemplate[]): void;

  // Résolution (déterministe, bornée)
  resolveTemplate(id: string, context?: { agentId?: string }): ResolvedPrompt;
  build(template: string, context?: { agentId?: string }): ResolvedPrompt;

  // Évaluation LLM (port injecté, borné)
  evaluate(request: LLMRequest, opts?: { timeoutMs?: number; maxTokens?: number }): Promise<LLMResponse>;
  evaluateWithProvider(providerName: string, request: LLMRequest): Promise<LLMResponse>;
  listProviders(): string[];
  addProvider(provider: LLMProvider): void;
}
```

**Variables sources :**
- `agent:*` → `registry.loadAgent(agentId)`
- `state:*` → `stateMachine.getCurrentState()`, `getHistory(5)`, `loadMachine()`
- `logs:*` → `logReader.readLogs({ lines: 15 })` — borné (15 lignes max)
- `system:*` → version '1.0.0', timestamp now

**Bornes de sécurité (invariant) :** substitution échappée, variables inconnues → `[unresolved]`, pas de récursion, taille max de prompt.

---

## 6. Managers

### 6.1. SecretManager

```typescript
export class SecretManager {
  constructor(masterKey: string, options?: { allowDevelopmentDefault?: boolean });

  setSecret(key: string, value: string): EncryptedSecret;
  getSecret(key: string): Secret;                    // DÉCHIFFRÉ — réservé à l'appelant autorisé
  removeSecret(key: string): boolean;
  listSecrets(): string[];                           // clés uniquement
  getAllSecrets(): EncryptedSecret[];                // CRYPTÉS (jamais en clair par défaut)
  importSecrets(secrets: EncryptedSecret[]): void;
}
```

**Dérivation de clé :**
- `scrypt(masterKey, salt, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })` → 32 octets (AES-256).
- `salt` **aléatoire** (16 octets) généré **par enveloppe** et stocké avec le ciphertext — jamais fixe.
- Chaque secret : nonce/IV unique (12 octets) + auth tag (16 octets) — voir `EncryptedSecret` (AES-256-GCM).
- Enveloppe versionnée (`formatVersion: '1'`).

**Production :** `masterKey` obligatoire.
**Development/Test :** si `allowDevelopmentDefault: true`, la clé par défaut `'akoris-default-dev-key'` est autorisée.

### 6.2. AliasManager

```typescript
export class AliasManager {
  setAlias(alias: Alias): void;
  getAlias(name: string): Alias;                     // throw NotFoundError
  removeAlias(name: string): boolean;
  listAliases(): Alias[];
  resolve(name: string): string | undefined;
}
```

### 6.3. EventBus

```typescript
type AkorisEvent =
  | { type: 'log:entry'; payload: LogEntry }
  | { type: 'state:transition'; payload: TransitionHistoryItem };

export class EventBus {
  on<T extends AkorisEvent['type']>(
    type: T,
    callback: (event: Extract<AkorisEvent, { type: T }>) => void
  ): () => void;
  emit(event: AkorisEvent): void;
  off<T extends AkorisEvent['type']>(
    type: T,
    callback: (event: Extract<AkorisEvent, { type: T }>) => void
  ): void;
  clear(): void;
}
```

**Stratégie d'erreur (I-3) :**
- `emit()` **isole chaque listener** ; une exception levée par un callback est **journalisée** (via `LogReader`, sans secret), jamais propagée au résultat `committed`.
- L'outbox / retry des événements critiques est géré par `@akoris/io` / la couche appelante.

---

## 7. Erreurs

```typescript
export class NotFoundError extends Error {
  constructor(resource: string, id: string);
}

export class TransitionError extends Error {
  constructor(from: string, to: string, reason: string);
}

export class ValidationError extends Error {
  constructor(message: string, field?: string);
}

export class VersionConflictError extends Error {
  constructor(expected: number, actual: number);
  // name = 'VersionConflictError'
}

export class PersistenceError extends Error {
  constructor(message: string);
  // name = 'PersistenceError'
}
```

`TransitionOutcome` (voir §4.13) distingue **quatre** résultats : `committed`, `rejected`, `persistence-failed`, `conflict`.

---

## 8. API publique

### 8.1. `createCore()`

```typescript
export interface CoreOptions {
  store: ProjectStore;           // Persistance (port injecté, snapshot atomique)
  masterKey?: string;            // Clé maître (obligatoire en production)
  agents?: Agent[];              // Seed (pour tests)
  machine?: StateMachine;        // Seed (pour tests)
  allowDevelopmentDefault?: boolean; // Autoriser la clé par défaut
}

export interface Core {
  // Registry
  registry: RegistryReader;
  searchEngine: SearchEngine;

  // State Machine
  stateMachine: StateMachineEngine;

  // Quality
  qualityGateEngine: QualityGateEngine;
  doctor: DoctorEngine;

  // Data
  logReader: LogReader;
  secrets: SecretManager;
  aliases: AliasManager;
  prompts: PromptEngine;

  // Persistence
  persist(): Promise<void>;      // saveSnapshotIfVersion(version) atomique — state = source de vérité

  // Events
  bus: EventBus;
}

export function createCore(options: CoreOptions): Core;
```

### 8.2. Public API Stability

```text
PUBLIC API (stable)
├── createCore()
├── Core
├── CoreOptions
├── ProjectStore (snapshot atomique)
├── SnapshotPersister
├── FullSnapshot
├── TransitionOutcome / TransitionContext
├── AuthorizationContext
├── EvidenceE1
├── LLMProvider
├── Tous les types exportés
├── NotFoundError, TransitionError, ValidationError, VersionConflictError, PersistenceError
└── AkorisEvent (type)

INTERNAL (non stable)
├── Implémentations internes des engines
├── Helpers
├── Evaluators internes
└── Algorithmes internes
```

---

## 9. Critères d'acceptation par version

| Version | Nom | Critères d'acceptation |
|---|---|---|
| **v0.1.0** | Seed | Structure créée, `pnpm build` passe, contrats Contract-First + vecteurs E1 définis |
| **v0.2.0** | Foundation | RegistryReader lit les 40 agents, EventBus émet/reçoit, tests passent |
| **v0.3.0** | Governance Runtime | Transitions atomiques, gates évalués, E1 chaîné calculé, snapshot persistant, événements émis — **tests d'invariants I-1 à I-6 obligatoires** |
| **v0.4.0** | Runtime Services | Logs append-only, secrets EncryptedSecret, alias fonctionnent, ProjectStore async, tests passent |
| **v0.5.0** | Intelligence | SearchEngine retourne des résultats, DoctorEngine diagnostique/planifie/applique, tests passent |
| **v0.6.0** | AI Runtime | PromptEngine résout les variables, appelle LLM borné, tests passent |
| **v1.0.0** | Stable | Core complet, 100% chemins critiques testés + invariants, docs, createCore() fonctionne |

### 9.1. Tests critiques — v0.3.0 (à valider impérativement)

- [ ] Transition valide → succès, nouvel état, historique
- [ ] Transition inexistante → refusée
- [ ] `from !== currentState` → refusé
- [ ] `roles` incompatibles avec `authorizedBy` → refusé
- [ ] `actorId` absent du Registry → refusé (I-5)
- [ ] Agent artificiel + `HUMAN_DECISION` → refusé (I-5)
- [ ] Gate PASS → transition
- [ ] Gate FAIL → aucune mutation (I-1)
- [ ] Gate PENDING → aucune mutation si gate requis
- [ ] Échec de persistance → `persistence-failed`, aucune mutation mémoire (I-1)
- [ ] Conflit de version → `conflict` (I-6)
- [ ] Réentrance pendant une transition → rejetée (I-4)
- [ ] Historique créé uniquement après validation complète
- [ ] Événement émis uniquement après commit / persistance (I-3)
- [ ] Historique non mutable par l'API publique (I-8)
- [ ] État final cohérent avec historique / reconstruction idempotente (I-2)
- [ ] Machine 11 états correctement chargée
- [ ] E1 calculé (SHA-256 chaîné) pour chaque transition — vecteurs fixes
- [ ] `VALIDATED → RELEASED` nécessite Decision Gate humain (externe)

---

## 10. Matrice de versionnement

| Version | Modules | Tests | Build |
|---|---|---|---|
| **v0.1.0** | types, errors, contrats | vecteurs E1 | ✅ |
| **v0.2.0** | RegistryReader, EventBus | 10+ | ✅ |
| **v0.3.0** | StateMachine, QualityGate, E1 | 20+ (invariants) | ✅ |
| **v0.4.0** | LogReader, SecretManager, AliasManager | 30+ (frontière secrets) | ✅ |
| **v0.5.0** | SearchEngine, DoctorEngine | 40+ | ✅ |
| **v0.6.0** | PromptEngine, LLM | 50+ | ✅ |
| **v1.0.0** | Core complet | 60+ (invariants) | ✅ |

---

## 11. Definition of Done — chaque release

- [ ] `pnpm build` passe
- [ ] `pnpm test` passe (tous les tests)
- [ ] Les **invariants de gouvernance** I-1 à I-8 sont couverts par des tests
- [ ] Les chemins critiques de gouvernance sont testés
- [ ] `tsc --noEmit` passe (0 erreur)
- [ ] CHANGELOG.md mis à jour
- [ ] README.md mis à jour (si API publique modifiée)
- [ ] La version est taguée dans le dépôt (v1.0.0 sous réserve d'audit)

---

## 12. Ce qui est explicitement hors périmètre v1.0.0

- ❌ Lecture/écriture de fichiers (`@akoris/io`)
- ❌ Serveur HTTP / WebSocket (`@akoris/api`)
- ❌ Interface terminal (`@akoris/cli`)
- ❌ Dashboard React (`@akoris/dashboard`)
- ❌ Authentification / RBAC
- ❌ Gestion des utilisateurs
- ❌ Interface graphique
- ❌ Plugins dynamiques
- ❌ Evidence Engine (E2/E3) — seule la trace E1 (SHA-256 chaîné) est intégrée
- ❌ Policy Engine
- ❌ Decision Engine (la décision humaine est externe)
- ❌ Audit Engine
- ❌ HttpLLMProvider (reporté à `@akoris/ai` / SDK)

---

> **Fin du document — CORE ENGINE SPECIFICATION v0.1 (Proposed / Architecture Draft)**