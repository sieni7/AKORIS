# Référence du CLI AKORIS

AKORIS CLI expose **23 commandes racines**, réparties en 5 catégories :

- **Core** : `init`, `about`, `status`, `info`, `doctor`
- **Registry** : `registry`, `agent`, `capability`, `activation`, `state`
- **Qualité** : `quality`, `audit`, `validate`
- **Artéfacts** : `adr`, `sprint`, `playbook`, `docs`, `metrics`, `knowledge`, `manifest`
- **Productivité** : `alias`, `search`, `logs`, `export`, `install`, `upgrade`

---

## Options globales

Toutes les commandes acceptent ces options :

| Option | Description |
|--------|-------------|
| `--json` | Sortie en JSON (pour intégration) |
| `--verbose` | Affiche les logs d'exécution |
| `--quiet` | Réduit la sortie au minimum |
| `--no-color` | Désactive les couleurs |
| `--output <file>` | Écrit la sortie dans un fichier |

---

## 1. Commandes Core

### `akoris init [name]`
Initialise un nouveau projet AKORIS.

```bash
akoris init mon-projet
akoris init mon-projet --template fullstack   # avec preset d'agents
```

**Options :**
- `--template <type>` : `fullstack`, `microservice`, `data-pipeline`

---

### `akoris about`
Affiche la vision, les 10 principes d'AKORIS.

---

### `akoris status`
Résumé de l'état de santé du projet.

---

### `akoris info`
Informations détaillées (manifest, version, agents actifs).

---

### `akoris doctor`
Diagnostique l'environnement et le projet.

```bash
akoris doctor
akoris doctor --fix       # répare automatiquement les problèmes
```

---

## 2. Registry & Agents

### `akoris registry`
Gère le Registry.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste tous les composants (agents, règles, etc.) |
| `index` | Affiche l'index complet |
| `info` | Détails d'un domaine |
| `validate` | Valide les schémas JSON |
| `watch` | Surveille les modifications |

---

### `akoris agent`
Gère les 33 agents AKORIS.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste les agents |
| `info <id>` | Affiche le contrat d'un agent |
| `activate <id>` | Active un agent |
| `deactivate <id>` | Désactive un agent |
| `contract <id>` | Affiche le contrat complet |
| `audit <id>` | Audit de conformité |

---

### `akoris capability`
Recherche et résolution de capacités.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste les 69 capacités |
| `find <id>` | Trouve un agent pour une capacité |
| `search <keyword>` | Recherche par mot-clé |
| `team <task1> <task2>` | Compose une équipe |

---

### `akoris activation`
Matrice d'activation des agents.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste les 18 événements |
| `suggest --event <id>` | Suggère des agents pour un événement |
| `events` | Liste les événements disponibles |

---

### `akoris state`
Machine à états du projet (Draft → Archived).

| Sous-commande | Description |
|---------------|-------------|
| `show` | État courant + transitions possibles |
| `history` | Historique des transitions |
| `transition` | Exécute une transition (ex: `--from Draft --to Planned`) |
| `info` | Détails de la machine à 7 états |
| `export` | Exporte l'état en Markdown/JSON/texte |

```bash
akoris state export --format markdown --output rapport.md
akoris state export --json
```

---

## 3. Qualité

### `akoris quality`
Quality Gates et métriques.

| Sous-commande | Description |
|---------------|-------------|
| `check` | Vérifie les Quality Gates |
| `gates` | Liste les gates |
| `validate` | Validation complète |
| `metrics` | Affiche les métriques qualité |

---

### `akoris audit`
Audits contextualisés.

| Sous-commande | Description |
|---------------|-------------|
| `sprint` | Audit de sprint |
| `project` | Audit global du projet |
| `release` | Audit de release |
| `architecture` | Audit d'architecture |
| `documentation` | Audit de documentation |

---

### `akoris validate`
Validations transverses.

| Sous-commande | Description |
|---------------|-------------|
| `architecture` | Valide les décisions d'architecture |
| `documentation` | Valide la documentation |
| `security` | Valide la sécurité |
| `registry` | Valide le Registry |

---

## 4. Artéfacts

### `akoris adr`
Architecture Decision Records.

| Sous-commande | Description |
|---------------|-------------|
| `new` | Crée un ADR |
| `list` | Liste les ADRs |
| `show <id>` | Affiche un ADR |
| `export` | Exporte les ADRs |

---

### `akoris sprint`
Gestion des sprints.

| Sous-commande | Description |
|---------------|-------------|
| `start` | Démarre un sprint |
| `report` | Rapport de sprint |
| `close` | Clôture un sprint |
| `history` | Historique des sprints |

---

### `akoris playbook`
Playbooks par pile technologique.

| Sous-commande | Description |
|---------------|-------------|
| `list` | Liste les playbooks |
| `install` | Installe un playbook |
| `remove` | Supprime un playbook |
| `current` | Playbook actif |

---

### `akoris docs`
Documentation du projet.

| Sous-commande | Description |
|---------------|-------------|
| `generate` | Génère la documentation |
| `validate` | Valide la documentation |
| `export` | Exporte en PDF, HTML, Markdown |

---

### `akoris metrics`
Métriques du projet.

| Sous-commande | Description |
|---------------|-------------|
| `run` | Affiche les métriques |
| `history` | Historique des métriques |
| `export` | Exporte en JSON |

---

### `akoris knowledge`
Base de connaissances.

| Sous-commande | Description |
|---------------|-------------|
| `search` | Recherche dans la base |
| `export` | Exporte la base |
| `import` | Importe une base |

---

### `akoris manifest`
Gestion du fichier `manifest.json`.

| Sous-commande | Description |
|---------------|-------------|
| `show` | Affiche le manifest |
| `update` | Met à jour le manifest |
| `validate` | Valide le manifest |

---

## 5. Productivité

### `akoris alias`
Gère les alias de commandes.

| Sous-commande | Description |
|---------------|-------------|
| `set <nom> <commande>` | Crée un alias |
| `list` | Liste les alias |
| `remove <nom>` | Supprime un alias |
| `resolve <nom>` | Résout un alias (debug) |

```bash
akoris alias set go "state transition --from Draft --to Active"
akoris go
```

---

### `akoris search`
Recherche fédérée dans 7 sources (agents, règles, ADRs, logs...).

```bash
akoris search "database"              # recherche générale
akoris search "security" --type agent # filtre par type
akoris search "release" --json        # sortie JSON
```

---

### `akoris logs`
Affiche les logs d'exécution.

```bash
akoris logs
akoris logs --lines 50
akoris logs --agent CORE-01
akoris logs --since 2026-06-01
akoris logs --watch                   # mode suivi (tail -f)
```

---

### `akoris export`
Exporte des données.

| Sous-commande | Description |
|---------------|-------------|
| `registry` | Exporte le Registry |
| `audit` | Exporte un rapport d'audit |
| `project` | Exporte le résumé du projet |

---

### `akoris install`
Installe des composants.

| Sous-commande | Description |
|---------------|-------------|
| `playbook` | Installe un playbook |
| `expert` | Installe un expert IA |
| `connector` | Installe un connecteur |
| `adapter` | Installe un adaptateur IA |

---

### `akoris upgrade`
Met à jour le CLI (via npm ou binaire).

---

**Aide en ligne :** chaque commande dispose d'un `--help` détaillé avec des exemples.
