# Usage Example — Gate de Release V2.3

## Contexte
Projet "Horizon" version 2.3 prête pour release. CORE-01 déclenche le gate de release via GOV-02.

## Déroulement
1. GOV-02 récupère les critères QG de release auprès de CORE-08.
2. Analyse des rapports : GOV-01 (conformité méthodologique OK), CORE-08 (tests passés à 98%, 2 échecs non-bloquants).
3. Vérification des critères obligatoires : conformité RGPD OK, tests de régression OK, documentation OK.
4. Identification d'un écart non-bloquant : documentation API non finalisée pour 2 endpoints mineurs.
5. Décision : NO GO avec conditions — documentation API à finaliser dans les 5 jours, nouveau passage si non résolu.

## Résultats
- **Décision:** NO GO
- **Justification:** Documentation API partielle (2 endpoints)
- **Conditions de retour:** Finalisation documentation, revue par CORE-06
- **Communication:** Rapport transmis à CORE-01, plan de correction établi
