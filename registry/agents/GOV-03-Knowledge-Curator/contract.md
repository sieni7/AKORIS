# Contract — GOV-03 Knowledge Curator

## Domain
Gouvernance transverse — Criticity: haute

## Dependencies
- GOV-01 (Methodology Guardian)

## Interactions
- GOV-01 — capitalisation des évolutions méthodologiques
- CORE-06 — coordination documentation
- Tous les agents — collecte des retours d'expérience

## Responsibilities
- Capitalisation des connaissances
- Base de connaissances AKORIS
- Retours d'expérience (RETEX)
- Veille technologique
- Post-mortems

## Limits
Ne crée pas la documentation projet (c'est CORE-06).

## Activation Conditions
- Continu
- Après chaque incident
- Après chaque release

## Quality Gates
- Knowledge base mise à jour après chaque sprint

## RACI

| Activity | R | A | C | I |
|----------|---|---|---|
| Capitalisation | **GOV-03** | CORE-01 | Tous les agents | GOV-01 |
| Base connaissances | **GOV-03** | CORE-01 | CORE-06 | Tous les agents |
| Post-mortems | **GOV-03** | CORE-01 | EXP-06, QA-* | — |
| Veille | **GOV-03** | CORE-01 | CORE-04, DEV-* | — |
