---
title: "AKORIS Control Center — Core Engine Specification"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "00-vision.md"
  - "01-system-architecture.md"
  - "02-technical-architecture.md"
  - "ADR-003-core-first.md"
---

# 03 — Core Engine Specification

## 1. Définition du Core Engine

Le Core Engine est l'unique détenteur de la **logique métier** d'AKORIS. Il est indépendant de toute interface (CLI, API, Dashboard, SDK) et ne connaît ni Fastify, ni React, ni Commander.

Le Core expose une API publique (TypeScript) que toutes les interfaces consomment. Cette API est stable, versionnée, et testée indépendamment.

### 1.1. Responsabilités du Core

- **Registry** : lecture, validation et indexation du référentiel de gouvernance (`registry/`).
- **State Machine** : gestion du cycle de vie du projet (états, transitions, Quality Gates).
- **Search** : indexation et recherche fédérée dans toutes les sources (agents, règles, ADR, logs, etc.).
- **Prompts** : construction de prompts, injection de contexte, test LLM, gestion des templates.
- **Doctor** : diagnostic et réparation automatique du projet (`doctor --fix`).
- **Logs** : lecture des logs statiques et streaming en temps réel (`watch`).
- **Alias** : gestion des alias de commandes (CRUD).
- **Secrets** : chiffrement/déchiffrement des tokens (AES).
- **Quality** : évaluation des Quality Gates (futur).
- **Metrics** : agrégation des métriques (futur).
- **Deploy** : orchestration des déploiements (via les providers).

### 1.2. Non-responsabilités (hors périmètre)

- Le Core ne gère pas les **utilisateurs** (authentification, permissions). Ceci est délégué à l'API (via des tokens locaux ou OAuth à terme).
- Le Core ne gère pas le **réseau** (WebSocket, HTTP). Il expose des méthodes synchrones ou asynchrones (Promise) qui sont appelées par l'API.
- Le Core n'effectue pas d'**appels HTTP** directs (sauf pour les providers LLM, qui sont encapsulés dans un service dédié).
- Le Core ne contient **aucune logique UI** (couleurs, formatage, affichage).

---

## 2. API Publique du Core (TypeScript)

Le Core expose une interface principale, consommée par le CLI, l'API et le SDK.

```typescript
// packages/core/src/index.ts

export interface Core {
  // Registry
  registry: RegistryReader;

  // State Machine
  state: StateMachineEngine;

  // Search
  search: SearchEngine;

  // Prompts & AI
  prompts: PromptEngine;

  // Doctor
  doctor: DoctorEngine;

  // Logs
  logs: LogReader;

  // Alias
  alias: AliasManager;

  // Secrets
  secrets: SecretManager;

  // Quality (future)
  // quality: QualityEngine;

  // Metrics (future)
  // metrics: MetricsEngine;

  // Deploy (future)
  // deploy: DeployEngine;
}

// Factory function to instantiate the Core
export function createCore(options: CoreOptions): Core;
```

**Conventions :**
- Chaque service expose des méthodes synchrones ou asynchrones (Promise).
- Les méthodes qui lisent le filesystem acceptent un `projectRoot` (chemin absolu vers la racine du projet).
- Les méthodes qui modifient l'état du projet renvoient l'objet modifié (immutabilité par conception).
- Toutes les erreurs sont typées (voir `13-error-model.md`).

---

## 3. Modules du Core (détail)

### 3.1. RegistryReader

**Responsabilité** : Lire, valider et indexer le Registry (agents, règles, événements, QG, etc.).

**Méthodes principales** :
```typescript
interface RegistryReader {
  // Charge l'index complet du Registry (registry.json)
  loadIndex(projectRoot: string): Promise<RegistryIndex>;

  // Charge un agent spécifique (agent.json)
  loadAgent(projectRoot: string, agentId: string): Promise<Agent>;

  // Liste tous les agents (avec filtre domaine/statut)
  listAgents(projectRoot: string, filter?: AgentFilter): Promise<Agent[]>;

  // Valide l'intégrité du Registry (schémas JSON, références croisées)
  validate(projectRoot: string): Promise<ValidationReport>;

  // Surveille les changements du Registry (fs.watch)
  watch(projectRoot: string, callback: (event: RegistryEvent) => void): () => void;
}
```

### 3.2. StateMachineEngine

**Responsabilité** : Gérer le cycle de vie du projet.

**Méthodes principales** :
```typescript
interface StateMachineEngine {
  // Charge la machine à états (state-machine.json)
  loadMachine(projectRoot: string): Promise<StateMachine>;

  // État courant du projet (depuis .akoris/state.json)
  getCurrentState(projectRoot: string): Promise<State>;

  // Historique des transitions
  getHistory(projectRoot: string): Promise<TransitionRecord[]>;

  // Vérifie si une transition est autorisée (gates, autorisations)
  canTransition(projectRoot: string, from: string, to: string): Promise<TransitionCheck>;

  // Exécute une transition (si possible)
  transition(projectRoot: string, from: string, to: string, actor?: string): Promise<TransitionResult>;

  // Exporte un rapport d'état (Markdown, JSON, texte)
  exportReport(projectRoot: string, format: 'markdown' | 'json' | 'text'): Promise<string>;
}
```

### 3.3. SearchEngine

**Responsabilité** : Indexer et rechercher dans toutes les sources.

**Méthodes principales** :
```typescript
interface SearchEngine {
  // Recherche fédérée
  search(projectRoot: string, query: string, options?: SearchOptions): Promise<SearchResult[]>;

  // Indexe toutes les sources (agents, règles, ADR, logs, etc.)
  index(projectRoot: string): Promise<void>;

  // Filtres : type, limite, score minimum
  searchWithFilters(projectRoot: string, query: string, filters: SearchFilters): Promise<SearchResult[]>;
}
```

**Sources indexées :**
- Agents (id, name, domain, tags)
- Règles (id, name, description, severity)
- ADRs (titre, statut, contenu)
- Livrables (id, name, type)
- Événements (id, name)
- Capacités (id → agent associé)
- Logs (agentId, action, details) — 100 dernières entrées.

### 3.4. PromptEngine

**Responsabilité** : Construire, tester et sauvegarder des prompts.

**Méthodes principales** :
```typescript
interface PromptEngine {
  // Construit un prompt à partir d'un agent, d'un contexte et de variables
  buildPrompt(projectRoot: string, input: PromptInput): Promise<Prompt>;

  // Injecte le contexte (ADR, Registry, logs, etc.) dans le prompt
  injectContext(projectRoot: string, context: PromptContext): Promise<string>;

  // Teste un prompt sur un LLM (OpenAI, Anthropic, etc.)
  executePrompt(projectRoot: string, prompt: Prompt, provider: LLMProvider): Promise<LLMResponse>;

  // Sauvegarde un prompt dans la bibliothèque (Prompt Library)
  savePrompt(projectRoot: string, prompt: Prompt): Promise<void>;

  // Liste les prompts sauvegardés
  listPrompts(projectRoot: string): Promise<Prompt[]>;
}
```

### 3.5. DoctorEngine

**Responsabilité** : Diagnostiquer et réparer automatiquement le projet.

**Méthodes principales** :
```typescript
interface DoctorEngine {
  // Diagnostique le projet (liste les problèmes)
  diagnose(projectRoot: string): Promise<DiagnosisReport>;

  // Répare automatiquement les problèmes (création de dossiers, régénération de fichiers)
  fix(projectRoot: string, options?: FixOptions): Promise<FixReport>;

  // Vérifie l'intégrité du Core (état du Core lui-même)
  selfCheck(): Promise<SelfCheckReport>;
}
```

### 3.6. LogReader

**Responsabilité** : Lire et streamer les logs.

**Méthodes principales** :
```typescript
interface LogReader {
  // Lit les logs statiques (filtres : agent, since, lines)
  readLogs(projectRoot: string, filter?: LogFilter): Promise<LogEntry[]>;

  // Stream en temps réel (tail -f)
  watchLogs(projectRoot: string, filter?: LogFilter, onEntry?: (entry: LogEntry) => void): () => void;
}
```

### 3.7. AliasManager

**Responsabilité** : Gérer les alias de commandes.

**Méthodes principales** :
```typescript
interface AliasManager {
  // Liste tous les alias
  listAliases(projectRoot: string): Promise<Alias[]>;

  // Ajoute ou met à jour un alias
  setAlias(projectRoot: string, name: string, command: string): Promise<void>;

  // Supprime un alias
  removeAlias(projectRoot: string, name: string): Promise<void>;

  // Résout un alias (retourne la commande associée)
  resolveAlias(projectRoot: string, name: string): Promise<string | null>;
}
```

### 3.8. SecretManager

**Responsabilité** : Chiffrer, stocker et déchiffrer les secrets.

**Méthodes principales** :
```typescript
interface SecretManager {
  // Définit un secret (chiffré et sauvegardé dans .akoris/secrets.enc)
  setSecret(projectRoot: string, key: string, value: string): Promise<void>;

  // Récupère un secret (déchiffré)
  getSecret(projectRoot: string, key: string): Promise<string | null>;

  // Liste toutes les clés de secrets
  listSecrets(projectRoot: string): Promise<string[]>;

  // Supprime un secret
  removeSecret(projectRoot: string, key: string): Promise<void>;

  // Vérifie la validité d'un secret (ex: token GitHub valide)
  validateSecret(projectRoot: string, key: string, provider: string): Promise<boolean>;
}
```

**Chiffrement** : AES-256-GCM, clé maîtresse stockée dans `.akoris/.secret.key` (générée automatiquement à la première utilisation).

### 3.9. QualityEngine (future)

**Responsabilité** : Évaluer les Quality Gates.

**Méthodes principales** (esquisse) :
```typescript
interface QualityEngine {
  // Évalue un Quality Gate
  evaluateGate(projectRoot: string, gateId: string, context: GateContext): Promise<GateResult>;

  // Vérifie tous les gates requis avant une transition
  checkGates(projectRoot: string, transition: Transition): Promise<GateCheckReport>;
}
```

---

## 4. Règles d'architecture du Core

1. **Le Core ne dépend d'aucune bibliothèque externe** (hors Node.js). Pas de `commander`, `fastify`, `react`, `chalk`, `ora`, etc.
2. **Le Core ne lit ni n'écrit directement dans le filesystem** (excepté via des méthodes de service dédiées). Toutes les interactions avec les fichiers passent par `fs/promises` encapsulées.
3. **Le Core ne contient pas de logique de formatage** (couleurs, JSON, etc.). Ceci est délégué aux interfaces (output/format.ts pour le CLI, API pour le Dashboard).
4. **Le Core est testé unitairement** sans mocks de fichiers (les mocks sont réservés aux tests d'intégration).
5. **Les erreurs sont typées** (`CoreError` avec `code`, `message`, `suggestion`). Voir `13-error-model.md`.
6. **Le Core est versionné** : son API publique suit SemVer, et chaque package qui le consomme déclare sa dépendance.

---

## 5. Cycle de vie et persistance

Le Core est **stateless** (il ne conserve pas d'état en mémoire entre les appels). Tout état est persistant sur le filesystem (`.akoris/state.json`, `registry/`, etc.).

- **État du projet** : `.akoris/state.json`
- **Alias** : `.akoris/aliases.json`
- **Secrets** : `.akoris/secrets.enc`
- **Registry** : `registry/` (versionné dans le dépôt)
- **Logs** : `.akoris/logs/sessions/`
- **Prompts (Library)** : `.akoris/prompts/` (futur)

---

## 6. Tests du Core

| Type de test | Outil | Couverture visée |
|--------------|-------|------------------|
| Unitaires | Vitest | 90 % |
| Intégration (avec fichiers temporaires) | Vitest | 80 % |
| Performance (benchmark) | Vitest + custom | – |

**Règle** : Aucune modification du Core ne peut être mergée sans que les tests unitaires soient verts.

---

## 7. Cohérence avec le Blueprint

- Le Core est indépendant de toute interface (conformément à `01-system-architecture.md` et au principe #1 de `00-vision.md`).
- Les interfaces du Core sont clairement définies (`03-core.md` vs `04-domain-model.md`).
- Le Core est testable et versionné (principe de qualité).
- Le Core prépare l'extensibilité (modules `quality`, `metrics`, `deploy` sont déjà esquissés).

---

## 8. Prochaine étape

Avec `03-core.md`, la Phase A du Blueprint est **complète** :

- [x] `00-vision.md` — **Approved**
- [x] `01-system-architecture.md` — **Approved**
- [x] `02-technical-architecture.md` — **Approved**
- [x] `03-core.md` — **Draft** (prêt pour revue)

La prochaine étape est la **Phase B** (Contrats) : `04-domain-model.md`, `05-api-contract.md`, `06-events.md`, `07-websocket.md`, `11-sdk.md`.

---

## Statut

- `00-vision.md` : ✅ **Approved**
- `01-system-architecture.md` : ✅ **Approved**
- `02-technical-architecture.md` : ✅ **Approved**
- `03-core.md` : 🔍 **Draft** — prêt pour votre revue

**Prochaine action** : Validez `03-core.md` (ou demandez des ajustements), puis nous passerons à `04-domain-model.md` (définition des entités métier).
