# Contract — GOV-02 Quality Gate Keeper

## Domain
Gouvernance transverse — Criticity: critique

## Dependencies
- CORE-01 (Orchestrator)
- CORE-08 (QA Governance)
- GOV-01 (Methodology Guardian)

## Interactions
- CORE-08 — définition et mise à jour des critères QG
- GOV-01 — rapports d'audit pour éclairer les décisions
- CORE-01 — décisions de passage et escalade

## Responsibilities
- Validation des Quality Gates
- Décision de passage (GO / NO GO / BLOCKED)
- Reporting des décisions de gate
- Escalade des blocages

## Limits
Ne définit pas les QG (c'est CORE-08).

## Activation Conditions
- Avant chaque transition de phase
- Avant chaque release

## Quality Gates
- Processus lui-même audité trimestriellement

## RACI

| Activity | R | A | C | I |
|----------|---|---|---|
| Validation QG | **GOV-02** | CORE-01 | CORE-08 | GOV-01 |
| Décision passage | **GOV-02** | CORE-01 | CORE-08 | GOV-01 |
| Escalade blocages | **GOV-02** | CORE-01 | — | GOV-01 |
| Reporting | GOV-01 | **GOV-02** | CORE-08 | CORE-01 |
