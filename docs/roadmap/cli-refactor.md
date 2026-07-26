# CLI Refactor — Roadmap

**version** : 2.0
**statut** : Approuvé
**date** : 2026-07-26
**owner** : AKORIS Core Team
**dépend_de** : Milestone 2 (Control Center MVP)

---

## 1. Introduction

AKORIS CLI est actuellement fonctionnel et stable depuis la Milestone 1. Sa conception a priorisé la solidité du noyau, l'intégration avec le Core Engine et la mise en place des tests. L'architecture de l'interface terminal est restée minimale : les commandes écrivent leur sortie directement, sans couche de présentation unifiée.

La refonte intervient après la Milestone 2 (Control Center MVP), dans un ordre délibéré :

```
Milestone 1
Foundation
(Core + Shared + CLI stable)
    ↓
Milestone 2
Control Center MVP
(API + SDK + Dashboard)
    ↓
CLI Refactor
Terminal Experience Layer
    ↓
Milestone 3+
Advanced Automation
```

Le CLI doit évoluer vers une **expérience terminal professionnelle** sans casser les commandes existantes. Le Control Center a prouvé 5 concepts unifiés (Health, Registry, State Machine, Quality/Doctor, Logs) : le CLI doit les exposer dans le terminal avec la même cohérence.

**Principe fondateur** : les données du CLI et du Dashboard proviennent du même Core Engine. Aucune divergence UX possible.

---

## 2. Architecture cible

```
packages/cli/src/
├── index.ts                    # Entry point (#!/usr/bin/env node)
├── app/                        # Orchestration
│   ├── bootstrap.ts            # Initialisation, config loading
│   ├── program.ts              # Commander program setup
│   └── lifecycle.ts            # Hooks before/after/error
├── ui/                         # Design system terminal
│   ├── theme.ts                # Tokens (colors, spacing, borders)
│   ├── icons.ts                # Unicode icons (✓ ✗ ⚠ ℹ)
│   ├── box.ts                  # Card / bordered box
│   ├── table.ts                # Tabular data with aligned columns
│   ├── tree.ts                 # Hierarchical display
│   ├── spinner.ts              # Async activity indicator
│   ├── progress.ts             # Progress bar
│   └── timeline.ts             # Event history (logs, transitions)
├── output/                     # Renderer framework
│   ├── renderer.ts             # Contrat d'interface (IRenderer)
│   ├── terminal.ts             # Mode humain (chalk + ui/)
│   ├── json.ts                 # Mode automation (JSON.stringify)
│   └── markdown.ts             # Mode documentation (rapports)
├── commands/                   # Organisées par concept (noms publics inchangés)
│   ├── status/                 # akoris status
│   ├── doctor/                 # akoris doctor
│   ├── registry/               # akoris registry
│   ├── state/                  # akoris state
│   ├── logs/                   # akoris logs
│   ├── gates/                  # akoris gates
│   ├── secrets/                # akoris secrets
│   ├── aliases/                # akoris aliases
│   └── prompts/                # akoris prompts
├── services/
│   └── core-factory.ts         # createCoreService() — identique à l'API
└── utils/
    ├── config.ts               # cosmiconfig loader
    └── errors.ts               # Handler avec suggestion
```

### Rôle de chaque couche

| Couche | Responsabilité | Dépendances |
|--------|---------------|-------------|
| `app/` | Orchestration du CLI. Point d'entrée unique responsable de l'initialisation, du chargement de la configuration, de l'enregistrement des commandes et du cycle de vie. **Aucune logique métier, aucun rendu.** | Aucune |
| `ui/` | Design system terminal. Composants réutilisables (box, table, tree, spinner, progress, timeline) et tokens (theme, colors, icons). **Aucune dépendance vers commandes ou services.** | `chalk` |
| `output/` | Renderer framework. Implémente le contrat `IRenderer` pour chaque mode. **Seul module habilité à écrire dans stdout/stderr.** | `ui/` |
| `commands/` | Logique des commandes. Appelle les services Core, construit les données structurées, les passe au renderer. **Ne connaît pas le format de sortie.** | `@akoris/core`, `output/` |
| `services/` | Factory du Core Engine. Même seed que l'API (`createCoreService()`). | `@akoris/core` |
| `utils/` | Helpers transverses (config, error handling). | Aucune |

---

## 3. Renderer Contract

Contrat central de la refonte. Toutes les commandes utilisent cette interface — jamais `console.log` directement.

```typescript
// output/renderer.ts
interface IRenderer {
  /** Message d'information générique */
  info(message: string): void;

  /** Message de succès */
  success(message: string): void;

  /** Message d'avertissement */
  warning(message: string): void;

  /** Message d'erreur */
  error(message: string): void;

  /** Tableau avec colonnes alignées et en-têtes stylisés */
  table(headers: string[], rows: string[][]): void;

  /** Affichage hiérarchique (domaines, capabilities, arborescences) */
  tree(nodes: TreeNode[]): void;

  /** Fiche synthétique (agent, capability, issue) */
  card(title: string, fields: Record<string, string>, footer?: string): void;

  /** Chronologie d'événements (historique transitions, logs) */
  timeline(events: TimelineEvent[]): void;

  /** Barre de progression pour opérations longues */
  progress(current: number, total: number, label?: string): void;

  /** Indicateur d'activité asynchrone */
  spinner<T>(label: string, task: () => Promise<T>): Promise<T>;
}

// Types support
interface TreeNode { label: string; children?: TreeNode[] }
interface TimelineEvent { timestamp: string; label: string; icon?: string }
```

### Modes de rendu

| Mode | Classe | Déclencheur | Usage |
|------|--------|-------------|-------|
| Terminal | `TerminalRenderer` | `stdout.isTTY && !NO_COLOR` | Usage interactif |
| JSON | `JSONRenderer` | `--json` flag ou `stdout` non-TTY | Automation, CI |
| Markdown | `MarkdownRenderer` | `--output report.md` | Rapports, audits |

### Comportement non-TTY

- `process.stdout.isTTY` détecté automatiquement
- Variable `NO_COLOR` respectée
- Spinners et animations désactivés
- Tableaux et cards convertis en texte plat lisible dans les logs CI
- La sortie `--json` reste indépendante : toujours structurée, jamais de mise en forme humaine

---

## 4. Réorganisation des commandes

### Principe : noms publics inchangés

Les utilisateurs continuent d'appeler les mêmes commandes qu'aujourd'hui. Seule l'organisation interne du code change.

| Commande publique | Dossier interne | Mapped au concept Dashboard |
|-----------------|-----------------|----------------------------|
| `akoris status` | `commands/status/` | Health Dashboard |
| `akoris doctor` | `commands/doctor/` | Quality + Doctor |
| `akoris registry` | `commands/registry/` | Registry Explorer |
| `akoris state` | `commands/state/` | State Machine |
| `akoris logs` | `commands/logs/` | Live Logs |
| `akoris gates` | `commands/gates/` | Quality Gates |
| `akoris secrets` | `commands/secrets/` | (nouveau) |
| `akoris aliases` | `commands/aliases/` | (nouveau) |
| `akoris prompts` | `commands/prompts/` | AI Studio |

**Aucun wrapper de compatibilité nécessaire** — puisque les noms publics ne changent pas, les scripts CI existants continuent de fonctionner. Seule l'implémentation interne est remplacée.

---

## 5. Design System Terminal

### Composants

| Composant | Fichier | Usage |
|-----------|---------|-------|
| **Box** | `ui/box.ts` | Encadré avec bordure, titre optionnel, section colorée |
| **Table** | `ui/table.ts` | Lignes/colonnes alignées, en-tête stylisé, couleurs alternées |
| **Tree** | `ui/tree.ts` | Hiérarchies (domaines → agents, capabilities) |
| **Spinner** | `ui/spinner.ts` | Animation pendant une opération asynchrone |
| **Progress** | `ui/progress.ts` | Barre de progression (XX%) |
| **Timeline** | `ui/timeline.ts` | Événements chronologiques avec icônes |

### Tokens

```typescript
// ui/theme.ts
const theme = {
  primary:    chalk.hex('#6366f1'),    // actions, titres
  success:    chalk.hex('#22c55e'),    // ✓ succès
  warning:    chalk.hex('#f59e0b'),    // ⚠ avertissements
  error:      chalk.hex('#ef4444'),    // ✗ erreurs
  muted:      chalk.hex('#6b7280'),    // ℹ informations secondaires
};

// ui/icons.ts
const icons = {
  success:   '✓',
  error:     '✗',
  warning:   '⚠',
  info:      'ℹ',
  arrow:     '→',
  bullet:    '◆',
};
```

---

## 6. Plan d'exécution

### Sprint Zero — Validation

**Objectif** : valider architecture, renderer, dépendances et performances avant d'engager la refonte.

| Tâche | Description | Livrable |
|-------|-------------|----------|
| Z.1 | Valider le folder layout et les naming conventions | ADR folder-layout |
| Z.2 | Définir et geler l'interface `IRenderer` | ADR renderer-contract |
| Z.3 | Définir l'API des composants `ui/` (signatures) | ADR components-api |
| Z.4 | Évaluer `chalk` vs `picocolors` vs `kleur` | Choix : `chalk` |
| Z.5 | Évaluer `cli-table3` vs `cli-table` vs `easy-table` | Choix : `cli-table3` |
| Z.6 | Évaluer `ora` vs `cli-spinners` vs `nanospinner` | Choix : `ora` |
| Z.7 | Évaluer `commander` vs `yargs` vs `clRio` | Choix : `commander` v12 |
| Z.8 | POC 3 commandes (`status`, `registry list`, `state show`) avec la stack retenue | Code validé |
| Z.9 | Mesurer cold start, warm exec, perf `--json` | Benchmarks |
| Z.10 | Valider comportement non-TTY / NO_COLOR en CI | Tests CI passent |
| Z.11 | Documenter les règles de codage du CLI | CONTRIBUTING.md |

**Critères de sortie** :
- ✅ Toutes les bibliothèques choisies et documentées dans un ADR
- ✅ Interface `IRenderer` gelée et validée sur 3 commandes POC
- ✅ Budgets perf respectés (cold start < 500ms, warm < 300ms, json < 200ms)
- ✅ Comportement non-TTY validé en CI

---

### Phase 1 — Architecture CLI

**Dépendance** : Sprint Zero terminé
**Peut démarrer en parallèle de** : néant

| Tâche | Description |
|-------|-------------|
| 1.1 | Créer `packages/cli/package.json`, `tsconfig.json`, `tsup.config.ts` |
| 1.2 | Ajouter `packages/cli` au `pnpm-workspace.yaml` |
| 1.3 | Implémenter `app/bootstrap.ts` + `app/program.ts` + `app/lifecycle.ts` |
| 1.4 | Implémenter `services/core-factory.ts` (même seed que l'API) |
| 1.5 | Implémenter `ui/theme.ts` + `ui/icons.ts` (tokens) |
| 1.6 | Implémenter `output/renderer.ts` (interface + dispatch) |
| 1.7 | Implémenter `output/terminal.ts` (délègue à ui/) |
| 1.8 | Implémenter `output/json.ts` |
| 1.9 | Implémenter `output/markdown.ts` |
| 1.10 | Tests : détection TTY/NO_COLOR, renderer dispatch |

**Definition of Done** :
- ✅ `index.ts` < 50 lignes (bootstrap uniquement)
- ✅ Les 3 renderers implémentés et testés
- ✅ La factory Core produit les mêmes données que l'API
- ✅ Budgets perf validés

---

### Phase 2 — Terminal Design System

**Dépendance** : Phase 1 terminée (UI tokens disponibles)
**Peut démarrer en parallèle de** : néant

| Tâche | Description |
|-------|-------------|
| 2.1 | Implémenter `ui/box.ts` |
| 2.2 | Implémenter `ui/table.ts` |
| 2.3 | Implémenter `ui/tree.ts` |
| 2.4 | Implémenter `ui/spinner.ts` |
| 2.5 | Implémenter `ui/progress.ts` |
| 2.6 | Implémenter `ui/timeline.ts` |
| 2.7 | Tests unitaires de chaque composant + snapshots |
| 2.8 | Valider le rendu non-TTY pour chaque composant |

**Definition of Done** :
- ✅ Tous les composants implémentés et testés
- ✅ Snapshots des composants validés et intégrés à la CI
- ✅ Rendu non-TTY fonctionnel

---

### Phase 3 — Migration progressive des commandes

**Dépendance** : Phase 1 + 2 terminées
**Tâches parallélisables** : oui, chaque commande est indépendante

| Tâche | Commande | Priorité | Dépendance EventBus |
|-------|----------|----------|---------------------|
| 3.1 | `akoris status` (show, score) | Haute | Non |
| 3.2 | `akoris doctor` (diagnose, fix) | Haute | Non |
| 3.3 | `akoris registry` (list, get, search) | Haute | Non |
| 3.4 | `akoris state` (show, graph, transition, history) | Haute | Non |
| 3.5 | `akoris logs` (show) | Haute | Non |
| 3.6 | `akoris logs` (watch) | Haute | **Oui** — nécessite EventBus Core |
| 3.7 | `akoris state` (watch) | Haute | **Oui** — nécessite EventBus Core |
| 3.8 | `akoris gates` (list, check) | Moyenne | Non |
| 3.9 | `akoris secrets` (set, get, rm, ls) | Moyenne | Non |
| 3.10 | `akoris aliases` (set, get, rm, ls) | Moyenne | Non |
| 3.11 | `akoris prompts` (list, create, resolve, evaluate) | Basse | Non |

**Definition of Done** :
- ✅ Toutes les commandes haute priorité migrées vers le nouveau renderer
- ✅ La sortie `--json` est identique à l'ancienne (tests de snapshot)
- ✅ `akoris --help` affiché sans erreur
- ✅ Les commandes watch fonctionnent (si EventBus disponible)

---

### Phase 4 — UX Terminal

**Dépendance** : Phase 3 avancée (au moins status + registry migrés)

| Tâche | Description |
|-------|-------------|
| 4.1 | Welcome screen : logo ASCII, version, health score |
| 4.2 | Help system catégorisé par concepts (Project, Quality, Registry, System) |
| 4.3 | Auto-complétion bash/zsh (générée par commander) |
| 4.4 | Couleurs adaptatives (thème clair/sombre détecté) |

---

### Phase 5 — Tests & Documentation

**Dépendance** : Phase 3 terminée
**Peut démarrer en parallèle de** : Phase 4

| Tâche | Description |
|-------|-------------|
| 5.1 | Tests unitaires par commande (snapshot output) |
| 5.2 | Tests E2E CLI via `child_process.exec` |
| 5.3 | Tests CI : perf budgets, stabilité `--json`, non-TTY |
| 5.4 | `docs/cli/commands.md` — toutes les commandes |
| 5.5 | `docs/cli/examples.md` — cas d'usage |
| 5.6 | Mise à jour `README.md` |

---

## 7. Roadmap séparée : Unified Event System

Conformément au principe de séparation des responsabilités, l'EventBus est retiré de cette roadmap et fera l'objet d'un document dédié.

```
docs/architecture/event-system.md
```

**Périmètre** : Core Runtime — EventBus typé, instrumentation des engines, consommateurs (CLI watch, API WebSocket, Dashboard live).

**Bénéficiaires** : CLI (watch), API (WebSocket push), Dashboard (live updates), plugins, extensions.

**Non bloquant pour le CLI Refactor** : les commandes `watch` (logs, state) seront livrées dans une phase ultérieure, une fois l'EventSystem disponible.

---

## 8. Diagramme des dépendances

```
Sprint Zero
    │
    ▼
Phase 1 (Architecture CLI)
    │
    ├──────────────────────┐
    ▼                      ▼
Phase 2               [EventSystem]
(Design System)       (roadmap séparée)
    │                      │
    └──────────┬───────────┘
               ▼
         Phase 3 (Commandes)
               │
          ┌────┴────┐
          ▼         ▼
     Phase 4     Phase 5
     (UX)        (Tests + Docs)
```

**Parallélismes possibles** :
- Phase 1 et EventSystem peuvent démarrer en même temps
- Les commandes sans `watch` (3.1-3.5, 3.8-3.11) peuvent sortir avant l'EventSystem
- Phase 4 et 5 peuvent être menées en parallèle

---

## 9. Budgets de performance

| Mode | Objectif | Mesuré en |
|------|----------|-----------|
| Cold start (première commande) | < 500 ms | CI benchmark |
| Warm execution | < 300 ms | CI benchmark |
| JSON mode (`--json`) | < 200 ms | CI benchmark |
| Interactive (spinners) | < 400 ms | CI benchmark |

Ces budgets sont vérifiés dans la CI à chaque PR sur le dossier `packages/cli/`.

---

## 10. Critères de succès

La refonte est terminée quand :

- ✅ `index.ts` ne contient que le bootstrap applicatif (< 50 lignes)
- ✅ Aucune commande n'appelle `console.log` directement
- ✅ Toutes les commandes haute priorité utilisent `IRenderer`
- ✅ La sortie `--json` reste stable et conforme (tests snapshot)
- ✅ Le comportement non-TTY / NO_COLOR est implémenté et testé
- ✅ Tous les composants `ui/` ont des tests unitaires + snapshots
- ✅ Les budgets de performance sont respectés
- ✅ `docs/cli/commands.md` et `docs/cli/examples.md` sont publiés
- ✅ Tous les tests CLI passent (unitaires, intégration, E2E)

---

## 11. Risques et atténuations

| Risque | Solution |
|--------|----------|
| **Sur-ingénierie** — architecture trop complexe pour un CLI | `ui/` expose des fonctions pures, pas de classes. Pas de DI, pas de plugin system. |
| **Divergence CLI / Dashboard** | Les données proviennent du même `createCoreService()`. Les deux sont des clients du même modèle. |
| **Duplication logique métier** | Toute logique métier reste dans `@akoris/core`. Les commandes ne font qu'appeler des services et passer le résultat au renderer. |
| **Dépendances UI inutiles** | Chaque dépendance est validée et documentée dans l'ADR du Sprint Zero. Critères : maintenance, taille, licence, activité. |
| **Rupture de la sortie `--json`** | Tests snapshot CI vérifient la non-régression. Toute évolution passe par un versionnement explicite. |
| **Dégradation en environnement CI** | La détection non-TTY / NO_COLOR est un critère de validation obligatoire de la Phase 1. Tests CI dédiés. |
| **Commandes watch bloquées** | Décorrélées de la roadmap CLI. Livrées quand EventSystem Core sera disponible. |

---

**Document approuvé — 2026-07-26 — version 2.0**
