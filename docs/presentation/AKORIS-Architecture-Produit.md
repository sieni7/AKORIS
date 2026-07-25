# AKORIS — Architecture Produit & Guide d'Implémentation

**Conception, architecture logicielle et implémentation de l'écosystème AKORIS**

**Version :** 1.0.0
**Auteur :** OULAÏ SIÉNI

---

## Architecture générale

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

## Composants de la plateforme

| Composant | Description |
|-----------|-------------|
| Registry | Référentiel officiel (agents, policies, workflows, templates, quality gates) |
| CLI | Outil d'orchestration (init, install, doctor, audit, quality, status, sync, metrics) |
| SDK | API pour intégration tierce |
| Adapters | Interface avec les moteurs IA (OpenCode, Cursor, Claude Code, Codex) |
| Connectors | Intégration avec services externes (GitHub, GitLab, Supabase, Netlify) |
| Playbooks | Personnalisation selon la stack technique |

## Structure du projet

```
AKORIS/
├── constitution/     # Documents fondateurs
├── docs/             # Documentation officielle
├── registry/         # Référentiel de gouvernance
├── standards/        # Normes transverses
├── packages/         # Implémentations (CLI, SDK, adapters, connectors)
├── playbooks/        # Configurations par stack
└── examples/         # Exemples de projet
```

## Roadmap

- v1.0 : Registry, CLI, Playbook React, Adapter OpenCode
- v1.1 : Adapters Cursor et Claude Code, SDK Node.js
- v1.2 : Connecteurs GitHub, Supabase, Netlify
- v2.0 : Marketplace de Playbooks, plugins, Registry versionné
