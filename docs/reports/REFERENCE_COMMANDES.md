# Référence complète des commandes AKORIS CLI

**Version :** 2.0.0 — **23 commandes racine, 71 sous-commandes**

---

## Table des matières

- [1. Commandes générales](#1-commandes-générales)
- [2. Registry](#2-registry)
- [3. Playbook](#3-playbook)
- [4. Agent](#4-agent)
- [5. Sprint](#5-sprint)
- [6. ADR](#6-adr)
- [7. Audit](#7-audit)
- [8. Quality](#8-quality)
- [9. Docs](#9-docs)
- [10. Metrics](#10-metrics)
- [11. Knowledge](#11-knowledge)
- [12. Manifest](#12-manifest)
- [13. Validate](#13-validate)
- [14. Install](#14-install)
- [15. Export](#15-export)
- [16. Upgrade](#16-upgrade)
- [17. State (Core Engine)](#17-state-core-engine)
- [18. Activation (Core Engine)](#18-activation-core-engine)
- [19. Capability (Core Engine)](#19-capability-core-engine)

---

## 1. Commandes générales

### `akoris`

Affiche le message de bienvenue ASCII, la version, les engagements fondamentaux et les commandes principales.

```text
Usage: a koris [options] [command]
```

Pas de paramètres. Affiche un écran d'accueil.

---

### `akoris init [name]`

Initialise un nouveau projet AKORIS dans le dossier courant.

| Paramètre | Description |
|-----------|-------------|
| `name` | Nom du projet (argument positionnel) |

| Option | Description | Défaut |
|--------|-------------|--------|
| `-t, --type <type>` | Type de projet : `app`, `saas`, `api`, `lib` | `app` |
| `-p, --path <path>` | Chemin d'installation du projet | dossier courant |
| `-h, --help` | Aide de la commande | |

**Exemple :** `akoris init mon-app -t saas`

---

### `akoris doctor [--fix]`

Diagnostique l'état du projet AKORIS. Vérifie la structure, le registry, la configuration.

| Option | Description |
|--------|-------------|
| `--fix` | Tente de corriger automatiquement les problèmes détectés |
| `-h, --help` | Aide de la commande |

**Exemple :** `akoris doctor --fix`

---

### `akoris info`

Affiche les informations détaillées du projet courant (version, playbook actif, composants).

| Option | Description |
|--------|-------------|
| `-h, --help` | Aide de la commande |

**Exemple :** `akoris info`

---

### `akoris status`

Affiche l'état global de santé du projet : version du Registry, état de la machine à états, intégrité des fichiers.

| Option | Description |
|--------|-------------|
| `-h, --help` | Aide de la commande |

**Exemple :** `akoris status`

---

### `akoris about`

Affiche le manifeste AKORIS : vision, 3 engagements, 10 principes fondateurs, versions.

| Option | Description |
|--------|-------------|
| `-h, --help` | Aide de la commande |

**Exemple :** `akoris about`

---

## 2. Registry

### `akoris registry`

Gère le Registry AKORIS — le référentiel central de gouvernance.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste tous les composants du Registry (policies, agents, contrats, workflows...) |
| `info <domain>` | Affiche les informations d'un domaine (`CORE`, `DEV`, `QA`, `EXP`, `GOV`) |
| `update` | Met à jour le Registry depuis le dépôt distant (placeholder) |
| `sync [options]` | Synchronise le Registry vers le dossier `.akoris/` |
| `validate` | Valide les schémas et la structure du Registry |
| `index [options]` | Affiche l'index complet du Registry v2 (composants, domaines) |
| `watch` | Surveille les changements dans les fichiers du Registry |

#### `akoris registry index`

| Option | Description |
|--------|-------------|
| `--json` | Sortie au format JSON brut |

**Exemple :** `akoris registry index --json`

#### `akoris registry sync`

| Option | Description |
|--------|-------------|
| `--force` | Force la resynchronisation complète |
| `-h, --help` | Aide |

**Exemple :** `akoris registry sync --force`

---

## 3. Playbook

### `akoris playbook`

Gère les playbooks AKORIS — des guides de projet préconfigurés.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste les playbooks disponibles dans `playbooks/` |
| `install <name>` | Installe un playbook (copie les fichiers) |
| `remove <name>` | Supprime un playbook installé |
| `current` | Affiche le playbook actif depuis `MANIFEST.json` |

**Playbooks disponibles :** `react-vite-supabase`, `nextjs`, `laravel`

**Exemple :** `akoris playbook install nextjs`

---

## 4. Agent

### `akoris agent`

Gère les agents AKORIS — 33 agents répartis en 5 domaines.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste tous les agents du Registry |
| `info <id>` | Affiche les détails d'un agent (ex: `CORE-01`) |
| `activate <id>` | Active un agent (enregistrement dans `.akoris/`) |
| `deactivate <id>` | Désactive un agent |
| `contract <id>` | Affiche les contrats associés à un agent |
| `audit <id>` | Lance un audit sur le travail d'un agent |

**Exemple :** `akoris agent info CORE-01`

---

## 5. Sprint

### `akoris sprint`

Gère les sprints de développement.

| Sous-commande | Description |
|---------------|-------------|
| `start <number>` | Démarre un nouveau sprint (ex: `1`) |
| `report <number>` | Génère un rapport pour un sprint |
| `close <number>` | Clôture un sprint avec vérifications finales |
| `history` | Affiche l'historique des sprints depuis `.akoris/audits/` |

**Exemple :** `akoris sprint start 1`

---

## 6. ADR

### `akoris adr`

Gère les Architecture Decision Records.

| Sous-commande | Description |
|---------------|-------------|
| `new [title]` | Crée un nouvel ADR depuis le template du Registry |
| `list` | Liste tous les ADRs dans `.akoris/decisions/` |
| `show <id>` | Affiche un ADR spécifique |
| `export` | Exporte tous les ADRs (placeholder) |

**Exemple :** `akoris adr new "Migration vers PostgreSQL"`

---

## 7. Audit

### `akoris audit`

Lance des audits sur différentes dimensions du projet.

| Sous-commande | Description |
|---------------|-------------|
| `sprint [options]` | Audit de sprint complet |
| `project [options]` | Audit complet du projet |
| `release [options]` | Audit de pré-release |
| `architecture [options]` | Valide les décisions d'architecture |
| `documentation [options]` | Valide la complétude de la documentation |

| Option commune | Description | Défaut |
|----------------|-------------|--------|
| `--json` | Sortie au format JSON | |
| `--verbose` | Mode verbeux | |

**Exemple :** `akoris audit sprint --verbose`

---

## 8. Quality

### `akoris quality`

Gère les Quality Gates et les métriques de qualité.

| Sous-commande | Description |
|---------------|-------------|
| `check` | Exécute les vérifications de qualité |
| `gates` | Liste tous les Quality Gates définis |
| `validate` | Valide le projet contre tous les Quality Gates |
| `metrics` | Affiche les métriques de qualité |

**Exemple :** `akoris quality gates`

---

## 9. Docs

### `akoris docs`

Gère la documentation du projet.

| Sous-commande | Description |
|---------------|-------------|
| `generate` | Génère la documentation depuis les templates (placeholder) |
| `validate` | Valide la structure de la documentation |
| `export <format>` | Exporte la documentation au format spécifié (`pdf`, `html`, `markdown`) |

**Exemple :** `akoris docs export pdf`

---

## 10. Metrics

### `akoris metrics`

Gère les métriques du projet.

| Sous-commande | Description |
|---------------|-------------|
| `run` | Affiche les métriques courantes depuis les définitions du Registry |
| `history` | Affiche l'historique des métriques depuis `.akoris/metrics/` |
| `export [options]` | Exporte les métriques au format JSON |

| Option (`export`) | Description |
|-------------------|-------------|
| `--output <path>` | Chemin du fichier de sortie |
| `-h, --help` | Aide |

**Exemple :** `akoris metrics run`

---

## 11. Knowledge

### `akoris knowledge`

Gère la base de connaissance du projet.

| Sous-commande | Description |
|---------------|-------------|
| `search <query>` | Recherche dans la base de connaissance (placeholder) |
| `export [options]` | Exporte la connaissance depuis `.akoris/knowledge/` |
| `import <path>` | Importe la connaissance depuis un fichier |

| Option (`export`) | Description |
|-------------------|-------------|
| `--output <path>` | Chemin du fichier de sortie |
| `-h, --help` | Aide |

**Exemple :** `akoris knowledge search "ADR"`

---

## 12. Manifest

### `akoris manifest`

Gère le fichier `MANIFEST.json` du projet.

| Sous-commande | Description |
|---------------|-------------|
| `show` | Affiche le contenu du `MANIFEST.json` |
| `update [options]` | Met à jour les champs du manifeste |
| `validate` | Valide la structure du manifeste |

| Option (`update`) | Description |
|-------------------|-------------|
| `--name <name>` | Nouveau nom du projet |
| `--version <ver>` | Nouvelle version |
| `--playbook <pb>` | Playbook actif |
| `-h, --help` | Aide |

**Exemple :** `akoris manifest update --version 2.0.0`

---

## 13. Validate

### `akoris validate`

Valide différents aspects du projet AKORIS.

| Sous-commande | Description |
|---------------|-------------|
| `architecture` | Valide l'architecture (structure des dossiers, ADRs) |
| `documentation` | Valide que la documentation existe et est complète |
| `security` | Valide les politiques de sécurité (placeholder) |
| `registry` | Valide les schémas et fichiers du Registry |

**Exemple :** `akoris validate registry`

---

## 14. Install

### `akoris install`

Installe des composants AKORIS dans le projet.

| Sous-commande | Description |
|---------------|-------------|
| `playbook <name>` | Installe un playbook depuis `playbooks/` |
| `expert <name>` | Installe un agent expert (placeholder) |
| `connector <name>` | Installe un connecteur (`github`, `gitlab`, `supabase`, `netlify`) |
| `adapter <name>` | Installe un adaptateur (`opencode`, `cursor`, `claude-code`, `codex`) |

**Exemple :** `akoris install connector github`

---

## 15. Export

### `akoris export`

Exporte les données du projet AKORIS.

| Sous-commande | Description |
|---------------|-------------|
| `registry [options]` | Exporte le Registry au format JSON |
| `audit [options]` | Exporte le dernier rapport d'audit |
| `project [options]` | Exporte le résumé complet du projet |

| Option commune | Description |
|----------------|-------------|
| `--output <path>` | Chemin du fichier de sortie |
| `-h, --help` | Aide |

**Exemple :** `akoris export project --output rapport.json`

---

## 16. Upgrade

### `akoris upgrade`

Met à jour le CLI AKORIS vers la dernière version.

| Option | Description |
|--------|-------------|
| `-h, --help` | Aide |

**Exemple :** `akoris upgrade`

---

## 17. State (Core Engine)

### `akoris state`

Gère la machine à états du projet AKORIS. Moteur d'orchestration qui suit et valide le cycle de vie du projet.

**États :** `Draft` → `Planned` → `Active` → `Audit` → `Validated` → `Released` → `Archived`

| Sous-commande | Description |
|---------------|-------------|
| `show` | Affiche l'état courant, les états définis et les transitions possibles |
| `history` | Affiche tout l'historique des transitions avec dates |
| `transition [options]` | Tente une transition d'état avec validation des gates |
| `info` | Affiche la définition complète de la machine à états |

#### `akoris state transition`

| Option | Description |
|--------|-------------|
| `--from <state>` | État de départ (ex: `Draft`) |
| `--to <state>` | État d'arrivée (ex: `Planned`) |
| `-h, --help` | Aide |

**Exemples :**

```bash
akoris state show
akoris state transition --from Draft --to Planned
akoris state history
akoris state info
```

**Transitions disponibles :**

| De → Vers | Gates | Autorisation |
|-----------|-------|-------------|
| Draft → Planned | ADR validés, Architecture définie, Backlog priorisé | GOV-02 |
| Planned → Active | Ressources allouées, Environnements prêts, CI/CD configuré | GOV-02 |
| Active → Audit | Feature freeze respecté, Tests rédigés, Documentation préliminaire | CORE-01 |
| Audit → Validated | Security OK, Performance OK, Accessibility OK, Documentation OK, Code quality OK | GOV-02 |
| Validated → Released | Release approuvée, CI/CD green, CHANGELOG mis à jour | GOV-02 |
| Released → Archived | Post-mortem réalisé, Connaissances capitalisées, Documentation finalisée | CORE-01 |
| Active → Planned | Repriorisation nécessaire | CORE-01 |
| Audit → Active | Correctifs appliqués, Nouvel audit planifié | CORE-01 |

---

## 18. Activation (Core Engine)

### `akoris activation`

Gère l'activation des agents par événement. Interprète `activation-matrix.json` pour suggérer les bons agents selon le contexte.

| Sous-commande | Description |
|---------------|-------------|
| `suggest [options]` | Suggère les agents à activer pour un événement |
| `list [options]` | Liste tous les événements et leurs agents par phase |
| `events [options]` | Liste les événements auxquels un agent participe |

#### `akoris activation suggest`

| Option | Description |
|--------|-------------|
| `--event <id>` | Identifiant de l'événement (ex: `RELEASE_PREP`) |
| `-h, --help` | Aide |

#### `akoris activation list`

| Option | Description |
|--------|-------------|
| `--phase <phase>` | Filtre par phase (`initiation`, `development`, `quality`, `release`...) |
| `-h, --help` | Aide |

#### `akoris activation events`

| Option | Description |
|--------|-------------|
| `--agent <id>` | Identifiant de l'agent (ex: `CORE-01`) |
| `-h, --help` | Aide |

**Événements disponibles (18) :**

| Phase | Événements |
|-------|------------|
| Initiation | `PROJECT_INIT` |
| Développement | `SPRINT_START`, `FEATURE_START` |
| Review | `SPRINT_REVIEW` |
| Design | `ARCHITECTURE_DECISION` |
| Qualité | `CODE_REVIEW`, `SECURITY_AUDIT`, `PERFORMANCE_AUDIT`, `ACCESSIBILITY_AUDIT`, `DOCUMENTATION_AUDIT`, `TECHNICAL_DEBT_REVIEW` |
| Gouvernance | `QUALITY_GATE`, `COMPLIANCE_AUDIT` |
| Release | `RELEASE_PREP`, `RELEASE_APPROVED` |
| Opérations | `INCIDENT` |
| Amélioration | `PROJECT_RETRO`, `KNOWLEDGE_CAPTURE` |

**Exemples :**

```bash
akoris activation suggest --event RELEASE_PREP
akoris activation list --phase quality
akoris activation events --agent CORE-01
```

---

## 19. Capability (Core Engine)

### `akoris capability`

Recherche et résolution des capacités des agents. Interprète `capabilities.json` (69 capacités) pour trouver les agents compétents.

| Sous-commande | Description |
|---------------|-------------|
| `find <capability>` | Trouve les agents possédant une capacité spécifique |
| `search <query>` | Recherche des capacités par mot-clé (insensible à la casse) |
| `team <tasks...>` | Construit une équipe d'agents pour une liste de tâches |
| `list [options]` | Liste toutes les capacités disponibles |

#### `akoris capability find`

| Paramètre | Description |
|-----------|-------------|
| `capability` | Identifiant de la capacité (ex: `design_architecture`) |

| Option | Description |
|--------|-------------|
| `--json` | Sortie au format JSON |
| `-h, --help` | Aide |

#### `akoris capability search`

| Paramètre | Description |
|-----------|-------------|
| `query` | Mot-clé de recherche (ex: `audit`, `design`, `security`) |

| Option | Description |
|--------|-------------|
| `--json` | Sortie au format JSON |
| `-h, --help` | Aide |

#### `akoris capability team`

| Paramètre | Description |
|-----------|-------------|
| `tasks` | Liste des tâches (ex: `design_architecture audit_security`) |

| Option | Description |
|--------|-------------|
| `--json` | Sortie au format JSON |
| `-h, --help` | Aide |

#### `akoris capability list`

| Option | Description |
|--------|-------------|
| `--domain <id>` | Filtre par domaine (`CORE`, `DEV`, `QA`, `EXP`, `GOV`) |
| `--json` | Sortie au format JSON |
| `-h, --help` | Aide |

**Exemples :**

```bash
akoris capability find design_architecture
akoris capability search audit
akoris capability team design_architecture audit_security write_unit_tests
akoris capability list --domain QA
```

**Domaines de capacités (69) :**

| Domaine | Capacités clés |
|---------|----------------|
| CORE (20) | design_architecture, coordinate_agents, define_security_policy, setup_cicd |
| DEV (10) | design_rest_api, design_component_tree, implement_service_workers |
| QA (9) | review_code_quality, write_unit_tests, audit_owasp, run_load_tests |
| EXP (12) | optimize_prompts, design_multi_tenant, audit_rgpd, design_etl_pipelines |
| GOV (9) | enforce_constitution, validate_quality_gates, capitalize_experience |

---

## Annexe — 23 commandes racine

```
akoris            Message de bienvenue
akoris init       Initialiser un projet
akoris doctor     Diagnostic complet
akoris info       Informations projet
akoris status     État de santé
akoris about      Manifeste AKORIS
akoris registry   Gestion du Registry (7 sous-commandes)
akoris playbook   Gestion des playbooks (4)
akoris agent      Gestion des agents (6)
akoris sprint     Gestion des sprints (4)
akoris adr        Gestion des ADRs (4)
akoris audit      Lancement d'audits (5)
akoris quality    Gestion de la qualité (4)
akoris docs       Gestion de la documentation (3)
akoris metrics    Gestion des métriques (3)
akoris knowledge  Gestion de la connaissance (3)
akoris manifest   Gestion du MANIFEST (3)
akoris validate   Validations (4)
akoris install    Installation de composants (4)
akoris export     Export de données (3)
akoris upgrade    Mise à jour du CLI
akoris state      Machine à états (4) — Core Engine
akoris activation Activation des agents (3) — Core Engine
akoris capability Recherche de capacités (4) — Core Engine
```

---

*Document généré le 25/07/2026 — AKORIS v2.0.0*
