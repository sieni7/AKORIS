# Utilisation du Control Center

## Modules

### Executive

- **Health** (`/health`) : KPIs système — statut API, version, agents, domaines.
- **Quality** (`/quality`) : Diagnostic système — liste des problèmes, bouton Fix All (`doctor --fix`).
- **Release** (`/release`) : Gestion des livraisons — état courant, transitions disponibles, historique.

### Project

- **State Machine** (`/state-machine`) : Visualisation graphique de la machine à états (graphe SVG circulaire). États et transitions cliquables, historique.

### Registry

- **Registry Explorer** (`/registry`) : Navigation dans les agents par domaine. Recherche par nom, domaine ou tag. Fiche détaillée avec capacités et dépendances cliquables.

### Monitor

- **Live Logs** (`/logs`) : Logs en temps réel via WebSocket. Filtrage par niveau et par agent, auto-scroll.

## Command Palette (Ctrl+K)

Accès rapide à toutes les vues et commandes système :

| Raccourci | Action |
|-----------|--------|
| `Ctrl+K` | Ouvrir la Command Palette |
| `Esc` | Fermer la Command Palette |
| Flèches + `Enter` | Naviguer et exécuter une commande |
