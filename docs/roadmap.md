# Roadmap AKORIS

**Vision** : Faire d'AKORIS le standard de facto pour la gouvernance du développement logiciel assisté par IA — un "lint" pour les processus, pas seulement pour le code.

---

## Court terme (v1.4 — v1.5)

| Priorité | Sujet | Description |
|----------|-------|-------------|
| P0 | **Packaging** | Publication npm (`@akoris/cli`), binaire autonome (pkg/ncc), CI/CD GitHub Actions |
| P0 | **Tests E2E** | Suite de tests d'intégration (Vitest + execa) couvrant les 23 commandes |
| P1 | **Qualité** | Exécution automatique des Quality Gates avant les transitions d'état |
| P1 | **Expérience** | Messages d'erreur contextualisés, suggestions de correction |

## Moyen terme (v1.6 — v2.0)

| Priorité | Sujet | Description |
|----------|-------|-------------|
| P1 | **Shell interactif** | Mode REPL (`akoris shell`) avec historique et autocomplétion |
| P1 | **SDK** | Exposition de l'API du CLI pour intégration dans d'autres outils |
| P2 | **Plugins** | Système de plugins dynamiques (commandes, services, sources de recherche) |
| P2 | **Multi-projets** | Gestion de plusieurs projets AKORIS dans un même workspace |
| P2 | **Dashboard Web** | Interface web de visualisation (état, logs, métriques) |

## Long terme (v2.x)

- Agents auto-adaptatifs (sélection automatique selon le contexte)
- Intégration native avec GitHub/GitLab (issues, PRs, CI)
- Marché de playbooks et templates communautaires
- Export vers des formats standard (OpenAPI, Archimate, C4)

## Hors périmètre

- GUI native (le CLI et le dashboard web sont les interfaces officielles)
- Moteur d'IA embarqué (AKORIS orchestre, il ne génère pas de code)
- Base de données externe (tout est fichier — git-friendly par conception)
- Support des versions de Node.js < 18
