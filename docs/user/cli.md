# Référence des commandes AKORIS CLI

23 commandes réparties en 5 catégories.

**Options globales** (disponibles sur toutes les commandes) :

| Option | Rôle |
|--------|------|
| `--json` | Sortie au format JSON structuré |
| `--verbose` | Affiche les détails supplémentaires |
| `--quiet` | Réduit la sortie au minimum |
| `--no-color` | Désactive les couleurs (utile pour CI) |
| `--output <file>` | Exporte le résultat dans un fichier |
| `--help` | Aide détaillée de la commande |

---

## Core

### `akoris init`

Initialise un nouveau projet AKORIS.

```bash
akoris init mon-projet
akoris init api --template microservice
akoris init --help
```

| Option | Défaut | Description |
|--------|--------|-------------|
| `name` | — | Nom du projet |
| `-t, --type <type>` | `app` | Type (`app`, `saas`, `api`, `lib`) |
| `-p, --path <path>` | `cwd` | Chemin du projet |
| `--template <name>` | — | Template d'agents (`fullstack`, `microservice`, `data-pipeline`) |

### `akoris doctor`

Diagnostique et répare l'état du projet. Vérifie 6 points de santé (dossiers, state.json, Registry, manifeste, etc.).

```bash
akoris doctor          # Diagnostic seul
akoris doctor --fix    # Crée les dossiers et fichiers manquants
akoris doctor --json   # Sortie JSON
```

### `akoris status`

Affiche l'état global du projet AKORIS (version, Registry, qualité).

```bash
akoris status
akoris status --json
```

### `akoris info`

Affiche les informations du projet AKORIS courant.

### `akoris about`

Affiche la vision, les principes et les informations du projet.

---

## Registry

### `akoris registry`

Gère le Registry AKORIS.

```bash
akoris registry sync          # Synchronise le Registry
akoris registry list agents   # Liste les agents
akoris registry list rules    # Liste les règles
akoris registry show <id>     # Détail d'un élément
akoris registry validate      # Valide la structure
akoris registry stats         # Statistiques
akoris registry status        # État de santé
akoris registry --json        # Sortie JSON
```

### `akoris manifest`

Gère le fichier `MANIFEST.json` du projet.

```bash
akoris manifest show          # Affiche le manifeste
akoris manifest validate      # Valide le manifeste
akoris manifest create        # Crée un manifeste par défaut
akoris manifest --json
```

### `akoris validate`

Valide différents aspects du projet AKORIS.

```bash
akoris validate registry      # Valide le Registry
akoris validate project       # Valide la structure du projet
akoris validate manifest      # Valide le MANIFEST.json
akoris validate --json
```

---

## Qualité

### `akoris audit`

Lance un audit AKORIS.

```bash
akoris audit sprint           # Audit de sprint
akoris audit project          # Audit complet du projet
akoris audit --json
```

### `akoris quality`

Vérifie les Quality Gates et gère la qualité.

```bash
akoris quality check          # Vérifie tous les quality gates
akoris quality gates          # Liste les quality gates
akoris quality history        # Historique des vérifications
akoris quality --json
```

### `akoris install`

Installe des composants AKORIS.

```bash
akoris install playbook <nom>       # Installe un playbook
akoris install expert <id>          # Installe un expert
akoris install connecteur <nom>     # Installe un connecteur
akoris install adaptateur <nom>     # Installe un adaptateur
akoris install --json
```

### `akoris upgrade`

Met à jour la CLI AKORIS vers la dernière version.

---

## Artéfacts

### `akoris adr`

Gère les Architecture Decision Records.

```bash
akoris adr list              # Liste les ADRs
akoris adr show <id>         # Affiche un ADR
akoris adr new               # Crée un nouvel ADR
akoris adr --json
```

### `akoris sprint`

Gère les sprints AKORIS.

```bash
akoris sprint list           # Liste les sprints
akoris sprint show <id>      # Affiche un sprint
akoris sprint start          # Démarre un sprint
akoris sprint close          # Clôture un sprint
akoris sprint --json
```

### `akoris docs`

Gère la documentation du projet.

```bash
akoris docs list             # Liste les documents
akoris docs generate         # Génère la documentation
akoris docs --json
```

### `akoris metrics`

Affiche et gère les métriques du projet.

```bash
akoris metrics list          # Liste les métriques
akoris metrics show <id>     # Affiche une métrique
akoris metrics --json
```

### `akoris knowledge`

Gère la base de connaissances du projet.

```bash
akoris knowledge list        # Liste les entrées
akoris knowledge search <q>  # Cherche dans la base
akoris knowledge add         # Ajoute une entrée
akoris knowledge --json
```

---

## Productivité

### `akoris search`

Moteur de recherche unifiée dans 7 sources : agents, règles, ADRs, logs, capacités, livrables, événements.

```bash
akoris search "database"                # Recherche toutes sources
akoris search "security" --type agent   # Filtre par type
akoris search "test" --json             # Sortie JSON
akoris search "release" --verbose       # Avec détails
```

| Option | Description |
|--------|-------------|
| `query` | Terme de recherche (obligatoire) |
| `--type <type>` | Filtre par type (`agent`, `rule`, `adr`, `log`, `capability`, `deliverable`, `event`) |

### `akoris alias`

Crée et gère des raccourcis pour les commandes fréquentes.

```bash
akoris alias set go "state transition --from Draft --to Active"
akoris go                                # Exécute l'alias
akoris alias list                        # Liste tous les alias
akoris alias list --json                 # En JSON
akoris alias remove go                   # Supprime un alias
akoris alias resolve go                  # Affiche la commande résolue
```

Les alias sont stockés dans `.akoris/aliases.json`.

### `akoris logs`

Affiche les logs d'exécution du projet.

```bash
akoris logs                       # 20 dernières entrées
akoris logs --lines 50            # 50 entrées
akoris logs --agent CORE-01       # Filtré par agent
akoris logs --since 2026-06-01    # Depuis une date
akoris logs --watch               # Mode temps réel (tail -f)
akoris logs --json                # Sortie JSON
```

### `akoris state`

Gère la machine à états du projet.

```bash
akoris state show                 # État actuel + historique
akoris state history              # Historique complet
akoris state transition --from Draft --to Planned
akoris state info                 # Informations sur la machine
akoris state export               # Rapport d'état (texte par défaut)
akoris state export --format markdown --output rapport.md
akoris state export --format json
akoris state --json
```

Transitions valides : `Draft → Planned → Active → Audit → Released → Archived`.

### `akoris activation`

Gère l'activation des agents par événement.

```bash
akoris activation list                  # Liste tous les événements
akoris activation list --json
akoris activation suggest --event <id>  # Agents suggérés pour un événement
akoris activation agent <id>            # Événements pour un agent
```

### `akoris capability`

Recherche et résout les capacités des agents.

```bash
akoris capability list                  # Liste toutes les capacités
akoris capability search <query>        # Cherche une capacité
akoris capability resolve <id>          # Agents ayant une capacité
akoris capability agent <id>            # Capacités d'un agent
akoris capability --json
```

---

## Récapitulatif des options globales

Toutes les commandes supportent :

```
--json         Sortie JSON structurée
--verbose      Détails supplémentaires
--quiet        Sortie minimale
--no-color     Pas de couleurs
--output <f>   Export fichier
--help         Aide
```

Le mode `--json` est prioritaire : s'il est actif, la sortie texte est supprimée au profit d'un objet JSON complet.
