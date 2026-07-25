# Scenario 02 — Blocage de release pour non-conformité

## Contexte

Une release critique est programmée pour vendredi. Les vérifications de dernière minute révèlent un écart de sécurité.

## Entrées

- Release: `v2.4.1`
- Audit sécurité QA-03: Échec (vulnérabilité critique CVE-2026-1234 non corrigée)
- Pression métier: forte (deadline client)
- Délai avant release: 2 jours

## Déroulement attendu

1. GOV-02 analyse l'impact de la vulnérabilité
2. Vérifie les critères QG de sécurité
3. Prend une décision BLOCKED
4. Escalade à CORE-01 avec justification
5. Propose un plan de résolution accéléré
6. Conditionne le déblocage à la correction validée par QA-03

## Critères de succès

- Décision BLOCKED justifiée (100% blocking accuracy)
- Escalade documentée et tracée
- Plan de résolution proposé
