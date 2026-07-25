# Usage Example: Mise en place documentaire pour nouveau projet

## Contexte
Lancement d'un nouveau projet AKORIS de plateforme e-commerce. CORE-01 demande la mise en place de la structure documentaire.

## Entrées
- Nom du projet : "AKORIS E-Commerce Platform"
- Équipe : 12 agents répartis sur CORE, DEV, QA, GOV, EXP.
- Objectif : documentation complète pour le release v1.0.

## Actions CORE-06
1. Création de la structure documentaire :
   - `/docs/` — racine documentaire
   - `/docs/adr/` — Architectural Decision Records
   - `/docs/architecture/` — documentation architecturale
   - `/docs/guides/` — guides d'utilisation
   - `/docs/knowledge-base/` — base de connaissances
   - `/docs/changelog/` — notes de version
2. Rédaction et diffusion du template ADR.
3. Collecte des premiers ADR auprès de CORE-02, DEV-01, DEV-02.
4. Initialisation de la base de connaissances avec le contexte projet.
5. Coordination avec chaque agent pour la production de leur documentation.
6. Revue de couverture documentaire avant la release.

## Livrables
- `docs/README.md` — structure et navigation
- `docs/adr/ADR-001-init-architecture.md`
- `docs/adr/ADR-002-choix-framework-frontend.md`
- `docs/adr/ADR-003-choix-base-donnees.md`
- `docs/adr/ADR-INDEX.md` — registre des ADR
- `docs/knowledge-base/contexte-projet.md`
- `docs/changelog/CHANGELOG-v1.0.md`
