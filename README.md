# AKORIS

**Standard de gouvernance pour le développement logiciel assisté par intelligence artificielle**

Version 1.3.0 | [Documentation](docs/index.md) | [Constitution](constitution/CONSTITUTION.md) | [Registry](registry)

---

## Qu'est-ce qu'AKORIS ?

AKORIS est un standard de gouvernance et une CLI qui encadrent le développement logiciel assisté par IA. Il fournit un cadre modulaire de 33 agents spécialisés, 12 règles de gouvernance, et 72 capacités — le tout orchestré par une machine à états qui garantit qualité, traçabilité et conformité.

**Principe :** *Build software with method, not with chance.*

## Installation

```bash
npm install -g @akoris/cli          # via npm
npx @akoris/cli init mon-projet     # sans installation
```

Depuis les sources :

```bash
git clone https://github.com/sieni7/AKORIS.git
cd AKORIS
pnpm install && pnpm build
akoris init mon-projet
```

## Démarrage rapide

```bash
akoris init frontend --template fullstack   # Projet + 12 agents pré-activés
akoris state show                            # Voir l'état du projet
akoris search "performance"                  # Chercher dans tout le Registry
akoris alias set review "state transition --from Draft --to Active"
akoris review                                # Exécuter l'alias
akoris logs --watch                          # Suivre les logs en temps réel
```

## Commandes

| Catégorie | Commande | Rôle |
|-----------|----------|------|
| **Core** | `init` `doctor` `status` `info` `about` | Cycle de vie du projet |
| **Registry** | `registry` `manifest` `validate` `sync` | Gouvernance centralisée |
| **Qualité** | `audit` `quality` `install` `upgrade` | Contrôle et conformité |
| **Artéfacts** | `adr` `sprint` `docs` `metrics` `knowledge` | Traçabilité |
| **Productivité** | `search` `alias` `logs` `state` `activation` `capability` | Pilotage quotidien |

23 commandes — voir la [référence complète](docs/user/cli.md).

## Garanties

- **Zero Hallucination** : toute décision s'appuie sur une source vérifiable
- **Zero Code Spaghetti** : architecture contrôlée en continu
- **Zero Dette Technique** : toute dette est documentée et suivie

## Licence

MIT — Copyright (c) 2026 OULAÏ SIÉNI ([sieni7@gmail.com](mailto:sieni7@gmail.com))
