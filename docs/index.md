# Documentation d'AKORIS CLI

Bienvenue dans la documentation officielle du CLI AKORIS. Ce site regroupe l'ensemble des ressources pour comprendre, utiliser et contribuer à l'outil de gouvernance pour le développement logiciel assisté par IA.

---

## Par où commencer ?

- **Je suis un nouvel utilisateur** → [Guide de démarrage rapide](user/quickstart.md)
- **Je veux connaître toutes les commandes** → [Référence du CLI](user/cli.md)
- **J'ai une question** → [FAQ](user/faq.md)

---

## Pour comprendre le fonctionnement interne

- [Spécification du Registry](architecture/registry-specification.md) — structure des agents, règles, événements.
- [Machine à états](architecture/state-machine.md) — cycle de vie du projet (Draft → Archived).
- [Moteur de recherche](architecture/search.md) — comment la recherche fédérée indexe les données.
- [Système de formatage](architecture/output-system.md) — gestion des sorties (JSON, couleurs, verbosité).

---

## Pour contribuer

- [Guide du développeur](contributing/developer.md) — ajouter une commande ou un service.
- [Conventions de code](contributing/coding-style.md) — normes TypeScript, commits, tests.
- [Processus de release](contributing/release.md) — publier une nouvelle version.
- [Politique de support](contributing/support.md) — versions Node, plateformes, compatibilité.

---

## Décisions d'architecture

Les [Architecture Decision Records (ADR)](adr/) expliquent les choix structurants du projet.

---

*AKORIS est développé selon le principe "Build software with method, not with chance."*
