# AKORIS CLI

Moteur d'exécution de la méthode AKORIS.

**Ce composant ne contient aucune donnée de gouvernance.** Il lit, génère, valide et diagnostique à partir du Registry local du projet.

## Commandes principales

- `akoris init` — Initialise `.akoris/` + MANIFEST + Constitution
- `akoris doctor` — Diagnostic du projet (`--fix` pour corriger)
- `akoris status` — État de santé du projet
- `akoris install playbook <name>` — Installe un playbook
- `akoris audit sprint <n>` — Lance un audit de sprint
- `akoris quality check` — Vérifie les Quality Gates
- `akoris sync` — Synchronise le Registry local
- `akoris validate architecture` — Valide l'architecture
- `akoris metrics` — Affiche les métriques du projet

## Développement

Stack : Node.js + TypeScript + Commander.js

```bash
npm install
npm run build
npm run dev
```

Ce dossier est un squelette. Le développement du CLI est à venir.
