# Architecture d'AKORIS

## Vue d'ensemble

```
                    AKORIS
            ┌────────────────────┐
            │    Registry Core   │
            └────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
     CLI Engine   Adapters   Connectors
        │            │            │
        └────────────┼────────────┘
                     │
               Projet utilisateur
                 (.akoris/)
```

## Principes

1. **Gouvernance avant implémentation** : les règles sont définies avant leur mise en œuvre
2. **Séparation des responsabilités** : chaque composant a une fonction unique
3. **Référentiel unique** : le Registry est la source de vérité
4. **Indépendance technologique** : la méthode est neutre
5. **Traçabilité** : toute décision est reliée à son contexte

## Composants

### Registry
Référentiel officiel contenant agents, policies, workflows, templates, quality gates, checklists.

### CLI
Outil d'orchestration qui lit le Registry et exécute les commandes (init, install, doctor, audit, quality, status, sync, metrics).

### Adapters
Interface avec les moteurs IA (OpenCode, Cursor, Claude Code, Codex). Chaque adaptateur traduit les contrats AKORIS dans le format attendu par le moteur.

### Connectors
Intégration avec les services externes (GitHub, GitLab, Supabase, Netlify).

### Playbooks
Personnalisation d'AKORIS selon la stack technique (React, Next.js, Laravel).
