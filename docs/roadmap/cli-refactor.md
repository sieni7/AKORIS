---
titre: CLI Refactor — Roadmap
version: 0.1
statut: Draft
date: 2026-07-26
owner: [à compléter]
dépend_de: Milestone 2 (Control Center MVP)
---

# CLI Refactor — Roadmap

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

Le CLI doit évoluer vers une expérience terminal professionnelle sans casser les contrats automation existants. Cette roadmap définit la vision, l'architecture cible, le séquencement et les critères de validation de cette transformation.

## 2. État actuel du CLI

Architecture actuelle :

```
packages/cli/src/
  index.ts
  commands/
  services/
  output/
```

Limites identifiées :

- **`index.ts` trop centralisé** : le point d'entrée mélange bootstrap, enregistrement de commandes et configuration, rendant la maintenance et l'évolution difficiles.
- **Affichage mélangé avec la logique** : les commandes appellent `console.log` directement, couplant présentation et métier.
- **Absence de design system terminal** : chaque commande formate sa sortie indépendamment, créant une expérience incohérente.
- **Sorties non homogènes** : les tableaux, listes et messages d'état n'ont pas de mise en forme commune.
- **Faible expérience utilisateur** : pas de welcome screen, pas d'aide catégorisée, pas de feedback visuel (spinners, progress bars).
- **Difficulté à créer de nouvelles commandes élégantes** : l'absence de renderer pousse chaque développeur à réinventer le formatage.

## 3. Vision cible

AKORIS CLI devient une interface terminal professionnelle pour piloter l'écosystème AKORIS.

Objectifs :

- **Expérience développeur premium** : interactions fluides, feedback immédiat, navigation intuitive.
- **Cohérence visuelle** : design system unique appliqué à toutes les commandes.
- **Informations synthétiques** : chaque sortie est pensée pour donner l'essentiel en un coup d'œil.
- **Navigation intuitive** : aide organisée par catégories, welcome screen contextuel.
- **Feedback temps réel** : spinners, barres de progression, logs live.
- **Compatible humain + automation** : le même CLI produit une sortie humaine riche en terminal interactif et une sortie JSON stable et prévisible en CI.

## 4. Architecture cible

```
packages/cli/src/
├── index.ts
├── app/
│   ├── bootstrap.ts
│   ├── program.ts
│   └── lifecycle.ts
├── ui/
│   ├── theme.ts
│   ├── colors.ts
│   ├── icons.ts
│   ├── box.ts
│   ├── table.ts
│   ├── tree.ts
│   ├── spinner.ts
│   ├── progress.ts
│   └── cards.ts
├── output/
│   ├── renderer.ts
│   ├── json.ts
│   ├── markdown.ts
│   └── terminal.ts
├── commands/     (structure inchangée — hors périmètre de la refonte)
├── services/     (structure inchangée — hors périmètre de la refonte)
└── utils/        (structure inchangée — hors périmètre de la refonte)
```

### Rôle de chaque couche

**`app/`** — Orchestration du CLI. Point d'entrée unique responsable de l'initialisation, du chargement de la configuration, de l'enregistrement des commandes et du cycle de vie. Contrainte stricte : aucune logique métier, aucun rendu terminal, aucune règle Core. Cette séparation évite qu'un futur développeur ne réintroduise de la logique dans `index.ts` ou dans `app/` par facilité.

**`ui/`** — Design system terminal. Composants réutilisables (box, table, tree, spinner, progress, cards) et tokens de style (theme, colors, icons). Aucune dépendance vers les commandes ou services.

**`output/`** — Renderer polymorphe. Trois formats : terminal (humain), JSON (automation), Markdown (documentation). Le renderer est le seul module habilité à écrire dans `stdout`/`stderr`.

**`commands/`**, **`services/`**, **`utils/`** — Structures inchangées. Ces couches ne font pas l'objet d'une réorganisation structurelle. Seule leur interaction avec la sortie change : elles consomment le renderer commun au lieu d'écrire directement via `console.log`.

## 5. Objectifs UX

### Welcome Screen

Affiché lors de l'exécution de `akoris` sans sous-commande :

- identité AKORIS (logo ASCII)
- version du CLI et du Core
- workspace courant
- état du projet (health score)
- raccourcis vers les commandes principales

### Help System

Aide complète organisée par catégories fonctionnelles :

```
PROJECT
  init
  status
  state

QUALITY
  audit
  doctor
  quality

REGISTRY
  registry
  agent
  capability

SYSTEM
  install
  upgrade
  export
```

### Output System

Trois renderers accessibles selon le contexte :

- **Terminal** : table, tree, card, timeline, progress — riche, coloré, interactif.
- **JSON** : `akoris status --json` — sortie structurée, stable, versionnée.
- **Markdown** : `akoris doctor --output report.md` — sortie formatée pour documentation et rapports.

## 6. Design System Terminal

### Couleurs

```ts
theme.primary   // #xxx — actions principales, titres
theme.success   // #xxx — succès, états verts
theme.warning   // #xxx — avertissements
theme.error     // #xxx — erreurs, blocages
```

### Icônes

```
✓ success
✗ error
⚠ warning
ℹ info
→ action
◆ section
```

### Composants

- **Card** : affichage synthétique d'une entité (agent, capability).
- **Table** : données tabulaires avec colonnes alignées et en-têtes stylisés.
- **Tree** : hiérarchies (domaines, capabilities, arborescence de projet).
- **ProgressBar** : progression d'une opération longue.
- **Spinner** : indication d'activité asynchrone.
- **Timeline** : historique d'événements (audit, logs).
- **Summary** : récapitulatif de fin de commande.

### 6bis. Comportement en environnement non-interactif (CI/automation)

Pour garantir que la refonte esthétique ne casse pas les pipelines CI existants :

- Détection automatique de `process.stdout.isTTY` et de la variable `NO_COLOR`.
- Couleurs, spinners et animations désactivés dans les environnements non-TTY.
- Tableaux, arbres et cards disposent d'un équivalent texte plat, lisible dans les logs CI.
- La sortie `--json` reste indépendante de ce comportement : toujours structurée, jamais de couleur ni de mise en forme humaine.

### 6ter. Technologies envisagées

Les choix techniques seront validés pendant le Sprint Zero de la refonte. Bibliothèques candidates à évaluer :

- `chalk` : gestion des couleurs
- `ora` : spinners
- `cli-table3` : tableaux
- `treeify` ou équivalent : arbres
- `prompts` / `enquirer` : interactions terminal
- `colorette` : alternative légère pour la couleur

Aucune dépendance ne sera ajoutée sans justification architecturale documentée (principe Zero Uncontrolled Technical Debt).

### 6quater. Gouvernance des sorties CLI

Les sorties produites par AKORIS CLI sont considérées comme des interfaces publiques. Trois modes sont maintenus :

#### Human Mode

- **Destination** : terminal interactif
- **Objectif** : lisibilité, compréhension rapide, expérience développeur
- **Exemple** : `akoris status`

#### Automation Mode

- **Destination** : scripts, CI/CD, Control Center
- **Objectif** : stabilité, parsing machine
- **Exemple** : `akoris status --json`
- **Contraintes** : aucune couleur, aucune animation, schéma versionné, compatibilité ascendante

#### Documentation Mode

- **Destination** : rapports, audits, documentation technique
- **Exemple** : `akoris doctor --output report.md`
- **Objectif** : partage humain, archivage, traçabilité

#### Processus d'évolution

Toute évolution de format doit suivre un processus explicite :

1. Proposition de changement
2. Validation humaine
3. Documentation
4. Versionnement si rupture

## 7. Commandes concernées

### Priorité haute

```
status
doctor
registry
audit
quality
logs
state
```

### Priorité moyenne

```
agent
capability
search
metrics
knowledge
```

### Priorité basse

```
install
upgrade
export
```

## 8. Intégration future avec Control Center

Synergies prévues entre le CLI refondu et le Control Center (Milestone 2) :

### Health Score

```
Health
██████████████░░ 82%
```

Affichage terminal du même health score que le dashboard, avec barre de progression colorée.

### State Machine

```
CURRENT STATE
IMPLEMENTATION

Next:
REVIEW
TESTING
RELEASE
```

Visualisation de la machine à états directement dans le terminal.

### Registry

```
Agents
62 active
12 domains
184 capabilities
```

Récapitulatif du registry en format card, synchronisé avec les données du Control Center.

### Logs

```
Live execution stream
```

Stream de logs en temps réel, filtrable par niveau et par service.

## 9. Roadmap d'implémentation

Les durées sont exprimées en sprints relatifs. Le calendrier réel sera fixé lors du Sprint Zero de la refonte.

### Principe de migration

Refonte progressive. Les anciennes commandes continuent de fonctionner pendant toute la transition. Aucune migration "big bang" : le CLI doit rester utilisable et stable à chaque étape intermédiaire.

Stratégie de migration par commande :

```
Ancien flux :

command
  ↓
console.log()

Nouveau flux :

command
  ↓
service
  ↓
renderer
  ↓
terminal / json / markdown
```

Chaque commande est migrée individuellement vers le nouveau flux.

### Phase 1 — Architecture interne

- **Objectif** : séparer présentation et logique
- **Dépendance** : aucune (peut démarrer dès la fin de la Milestone 2)
- **Tâches** :
  - Extraire `index.ts` vers `app/bootstrap.ts`, `app/program.ts`, `app/lifecycle.ts`
  - Créer la couche `ui/` avec les tokens de base (theme, colors, icons)
  - Créer le renderer `output/` avec les trois modes (terminal, json, markdown)
  - Mettre en place la détection TTY/`NO_COLOR`
- **Durée** : 2 sprints

### Phase 2 — Design System CLI

- **Dépendance** : Phase 1 terminée
- **Tâches** :
  - Développer les composants `ui/` (box, table, tree, spinner, progress, cards)
  - Écrire les tests unitaires de chaque composant
  - Valider le rendu en mode non-TTY pour chaque composant
- **Durée** : 2 sprints

### Phase 3 — Refonte des écrans

- **Dépendance** : Phase 2 terminée
- **Tâches** :
  - Welcome screen
  - Help system catégorisé
  - Migration des commandes haute priorité vers le renderer commun
  - Tests de snapshot sur les écrans critiques
- **Durée** : 2 sprints

### Phase 4 — Expérience avancée

- **Dépendance** : Phase 3 terminée
- **Tâches** :
  - Migration des commandes priorité moyenne
  - Interactive views (prompts, sélecteurs)
  - Progress bars et live logs
  - Dashboard terminal (vue synthétique multi-panneaux)
- **Durée** : 2 sprints

## 10. Git Strategy

Conventional Commits pour l'ensemble des changements :

```
refactor(cli): extract application bootstrap
feat(cli-ui): add terminal design system
feat(cli): redesign welcome experience
feat(cli): improve command help system
feat(cli): add dashboard terminal views
```

Chaque commit correspond à une étape réversible. Aucun commit de rupture n'est introduit sans phase de transition documentée.

## 11. Risques

| Risque | Solution |
|--------|----------|
| **Sur-ingénierie** — architecture trop complexe pour un CLI | Rester simple : `ui/` expose des fonctions, pas de classes. Pas de DI framework. Pas de plugin system. |
| **Divergence CLI / Dashboard** — les deux affichent des données différentes | Les données proviennent du même Core Engine. Le CLI et le Dashboard sont des clients du même modèle. |
| **Duplication logique métier** — une commande duplique une règle Core | Principe : toute logique métier est dans `@akoris/core`. Les commandes ne font qu'appeler des services et passer le résultat au renderer. |
| **Dépendances UI inutiles** — ajout de bibliothèques sans justification | Chaque dépendance doit être validée et documentée dans l'ADR correspondant (Sprint Zero). |
| **Rupture de la sortie `--json` pour les consommateurs automation** | La sortie JSON est un contrat stable. Toute évolution passe par un versionnement explicite. Le mode automation est testé en CI. |
| **Dégradation de l'expérience en environnement CI** | L'implémentation de la section 6bis (non-TTY / `NO_COLOR`) est un critère de validation obligatoire de la Phase 1. Des tests CI vérifient le comportement. |


## 12. Critères de réussite

Le refactor est terminé quand :

- **`index.ts`** ne contient que le bootstrap applicatif — aucune logique métier ni aucun rendu direct
- **Aucune logique métier** n'est présente dans la couche `ui/`
- **Toutes les commandes** utilisent le renderer commun
- **La sortie JSON** reste stable et conforme au contrat existant
- **Le comportement non-TTY / `NO_COLOR`** est implémenté et testé
- **L'UX est cohérente** sur l'ensemble des commandes prioritaires (haute + moyenne)
- **La documentation** est complète
- **Les tests CLI** passent
- **Les renderers** terminal/json/markdown disposent de tests unitaires
- **Les sorties CI** (`NO_COLOR`, non-TTY) sont testées
- **Les snapshots** des écrans critiques peuvent être validés
