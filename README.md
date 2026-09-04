# AKORIS

> **Build software with method, not with chance.**

**AKORIS** (Adaptive Knowledge & Orchestrated Review for Intelligent Software) est un standard de gouvernance pour le développement logiciel assisté par IA.

---

## Hiérarchie normative

AKORIS repose sur une hiérarchie claire :

```
CONSTITUTION
    ↓
GOUVERNANCE
    ↓
TERMINOLOGIE
    ↓
REGISTRY
    ↓
POLITIQUES
    ↓
CONTRATS
    ↓
IMPLEMENTATION
```

---

## Installation

```bash
npm install -g akoris
```

## Premier projet

Le CLI (`akoris`) est **prévu** dans l'écosystème AKORIS. Son implémentation n'est pas encore disponible dans ce dépôt de spécification.

```bash
# (CLI prévu) — exemplaire
akoris init mon-projet
cd mon-projet
akoris status
```

## Documentation

- [Manifeste AKORIS](constitution/00_AKORIS.md)
- [Constitution](constitution/01_CONSTITUTION.md)
- [Gouvernance](constitution/02_GOVERNANCE.md)
- [Terminologie](constitution/03_TERMINOLOGY.md)
- [Licence et contribution](constitution/04_LICENSING.md)
- [Guide de démarrage](docs/guides/00_GETTING_STARTED.md)

## Écosystème prévu

- `akoris doctor` : vérifier l'intégrité de l'instance
- `akoris registry validate` : valider la cohérence du Registry

## Licence

MIT © AKORIS Core Team
