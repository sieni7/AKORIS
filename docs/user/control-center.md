# Control Center — Guide d'utilisation

## Présentation

Le Control Center est une interface web de pilotage et de supervision du projet AKORIS. Il permet de visualiser l'état du système, les agents enregistrés, les logs en temps réel, et d'exécuter des transitions d'état.

## Installation

### Prérequis

- Node.js >= 20
- pnpm >= 11

### Installation locale

```bash
git clone https://github.com/sieni7/AKORIS.git
cd AKORIS
pnpm install
pnpm build
```

### Lancement

```bash
# Terminal 1 — API
pnpm dev:api

# Terminal 2 — Dashboard
pnpm dev:dashboard
```

Ouvrir `http://localhost:5173`.

### Avec Docker

```bash
docker compose up -d
```

Ouvrir `http://localhost:8080`.

## Modules

### Health Dashboard (`/health`)

Affiche les KPI système :
- Statut de l'API
- Version
- Nombre d'agents et domaines
- Tableau des agents enregistrés

### Quality Dashboard (`/quality`)

Diagnostic du système :
- Liste des problèmes (critical, high, medium, low)
- Bouton **Fix All** pour exécuter `doctor --fix`
- Indicateurs par sévérité

### Release Dashboard (`/release`)

Gestion des livraisons :
- État courant
- Version de la machine à états
- Transitions disponibles
- Historique des transitions

### State Machine (`/state-machine`)

Visualisation graphique de la machine à états :
- Graphe SVG circulaire interactif
- États et transitions cliquables
- Liste des transitions

### Registry Explorer (`/registry`)

Navigation dans les agents :
- Recherche par nom, domaine ou tag
- Liste groupée par domaine
- Fiche détaillée (métadonnées, capacités, dépendances)
- Navigation inter-agents (dépendances cliquables)

### Live Logs (`/logs`)

Logs en temps réel via WebSocket :
- Connexion automatique au serveur WS
- Filtrage par niveau (info, warn, error, debug)
- Filtrage par agent
- Auto-scroll avec détection de position

## Command Palette

Ouvrir avec `Ctrl+K` (ou `Cmd+K` sur macOS) :

- Navigation entre les modules
- Exécution de commandes système (`doctor --fix`, transitions)
- Raccourci : `Esc` pour fermer

## API REST

Documentation OpenAPI disponible à `/docs` (API) ou via le reverse proxy du dashboard.
