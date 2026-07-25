# AKORIS

**Standard de gouvernance pour le développement logiciel assisté par intelligence artificielle**

Version 1.0.0 | [Documentation](docs/presentation) | [Constitution](constitution/CONSTITUTION.md) | [Registry](registry)

---

## Vue d'ensemble

AKORIS est un standard de gouvernance conçu pour encadrer le développement logiciel assisté par IA. Il fournit un cadre modulaire, extensible et technologiquement neutre pour garantir la qualité, la traçabilité et la conformité des projets.

## Structure

```
AKORIS/
├── constitution/     # Documents fondateurs (CONSTITUTION, PHILOSOPHY, VALUES, PRINCIPLES, GOVERNANCE, LICENSING, CODE_OF_ETHICS, TERMINOLOGY)
├── docs/             # Documentation officielle (presentation, specifications, roadmap, decisions, releases)
├── registry/         # Référentiel de gouvernance (agents, contracts, policies, workflows, quality-gates, templates, conventions, schemas)
├── standards/        # Normes transverses (coding, documentation, architecture, security, quality)
├── packages/         # Implémentations techniques
│   ├── cli/          # CLI d'orchestration
│   ├── sdk/          # API pour intégration tierce
│   ├── adapters/     # Interfaces avec les moteurs IA
│   └── connectors/   # Intégrations avec services externes
├── playbooks/        # Configurations par stack technique
└── examples/         # Exemples de projet
```

## Installation

```bash
git clone <url-du-repo>
cd AKORIS
pnpm install
pnpm build
```

## Commandes CLI

```bash
akoris init <name>         # Initialiser un projet AKORIS
akoris install playbook    # Installer un playbook
akoris doctor              # Diagnostiquer le projet
akoris audit sprint        # Lancer un audit
akoris quality check       # Vérifier les Quality Gates
akoris status              # État global du projet
akoris sync                # Synchroniser le Registry
akoris metrics             # Afficher les métriques
```

## Garanties

- **Zero Hallucination** : aucune decision sans element verifiable
- **Zero Code Spaghetti** : architecture controlee en continu
- **Zero Dette Technique** : toute dette est documentee et suivie

## Licence

MIT - Copyright (c) 2026 OULAI SIENI
