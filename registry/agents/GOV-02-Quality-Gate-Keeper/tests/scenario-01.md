# Scenario 01 — Gate de transition phase Développement → Test

## Contexte

Le projet P-2026-042 termine sa phase de développement. CORE-01 déclenche le gate de transition vers la phase de test.

## Entrées

- Projet: `P-2026-042`
- Phase source: Développement
- Phase cible: Test
- Rapports: Audit GOV-01 (conforme), Couverture de tests (85%), Code review QA-01 (passée)

## Déroulement attendu

1. GOV-02 récupère les critères QG auprès de CORE-08
2. Vérifie chaque critère avec les rapports disponibles
3. Prend une décision : GO / NO GO / BLOCKED
4. Documente la décision avec justifications
5. Notifie CORE-01 et les parties prenantes

## Critères de succès

- Délai de décision < 4h
- Décision correctement justifiée
- Trace d'audit complète
