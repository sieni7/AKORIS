# Documentation AKORIS

Bienvenue dans la documentation officielle d'AKORIS — le standard de gouvernance pour le développement logiciel assisté par IA.

---

## Par où commencer ?

Je suis **nouveau** et je veux :
- [Démarrer en 5 minutes](user/quickstart.md) — `init`, `state show`, `search`
- [Installer la CLI](../README.md#installation)
- [Voir toutes les commandes](user/cli.md)

Je suis un **utilisateur quotidien** et je cherche :
- [La référence des 23 commandes](user/cli.md)
- [Les alias pour gagner du temps](user/cli.md#alias)
- [La FAQ](user/faq.md)

Je suis un **mainteneur** et je veux comprendre :
- [Le système de formatage](architecture/output-system.md)
- [Le moteur de recherche fédéré](architecture/search.md)
- [La machine à états](architecture/state-machine.md)
- [La spécification du Registry](architecture/registry-specification.md)

Je suis un **contributeur** et je veux :
- [Ajouter une commande](contributing/developer.md)
- [Respecter les conventions](contributing/coding-style.md)
- [Publier une release](contributing/release.md)

---

## Structure de la documentation

```
docs/
├── index.md                        ← Vous êtes ici
├── roadmap.md                      # Vision et orientations
├── documentation-style.md          # Charte rédactionnelle
├── user/
│   ├── quickstart.md               # 5 minutes pour démarrer
│   ├── cli.md                      # Référence complète des commandes
│   └── faq.md                      # Questions fréquentes
├── architecture/
│   ├── registry-specification.md   # Format du Registry
│   ├── state-machine.md            # Machine à états
│   ├── search.md                   # Moteur de recherche fédéré
│   └── output-system.md            # Système de formatage
├── contributing/
│   ├── developer.md                # Ajouter une commande
│   ├── coding-style.md             # Conventions TypeScript
│   ├── release.md                  # Processus de publication
│   └── support.md                  # Politique de support
└── adr/
    ├── ADR-001-why-commander.md
    ├── ADR-002-why-json-output.md
    ├── ADR-003-why-state-machine.md
    └── ADR-004-why-search-engine.md
```

## Ressources externes

- [Dépôt GitHub](https://github.com/sieni7/AKORIS)
- [Constitution](../constitution/CONSTITUTION.md)
- [Registry](../registry/registry.json)
