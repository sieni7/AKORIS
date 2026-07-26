# AKORIS — Standard de gouvernance pour le développement logiciel assisté par IA

**AKORIS** est un référentiel normatif et un CLI qui structure la production de code assistée par IA autour de contrats, de règles et d'une machine à états. Il transforme les prompts en processus gouvernés.

- **🔒 Architecture First** : chaque décision technique est formalisée (ADR).
- **📋 Audit First** : tout livrable est vérifié par des Quality Gates.
- **📝 Documentation First** : la documentation est un livrable prioritaire.
- **✅ Human Validation** : les transitions critiques sont validées par des humains.
- **🎯 Zero Hallucination** : les agents produisent des résultats reproductibles.

---

## Installation

```bash
npm install -g @akoris/cli
```

Ou téléchargez le binaire autonome depuis les [Releases GitHub](https://github.com/sieni7/AKORIS/releases) et placez-le dans votre `PATH`.

---

## Quick Start (2 minutes)

```bash
# 1. Initialiser un projet
akoris init mon-projet
cd mon-projet

# 2. Voir l'état du projet
akoris state show

# 3. Créer un alias (raccourci)
akoris alias set go "state transition --from Draft --to Planned"
akoris go

# 4. Rechercher une capacité
akoris search "database"
```

---

## Documentation complète

- [Guide de démarrage rapide](docs/user/quickstart.md) — 5 minutes pour prendre en main AKORIS.
- [Référence du CLI](docs/user/cli.md) — toutes les commandes, options et exemples.
- [FAQ](docs/user/faq.md) — réponses aux questions fréquentes.
- [Architecture](docs/architecture/registry-specification.md) — pour comprendre le fonctionnement interne.
- [Contribution](docs/contributing/developer.md) — pour ajouter une commande ou un service.

---

## Licence

MIT © OULAÏ SIÉNI — [sieni7@gmail.com](mailto:sieni7@gmail.com)

> *"Build software with method, not with chance."*
