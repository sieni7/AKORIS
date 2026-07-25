# Quality Gates – Orchestrator (CORE-01)

| ID | Nom | Description | Critères | Sévérité |
|----|-----|-------------|----------|----------|
| QG-ORCH-001 | Alignement des agents | Vérifier que tous les agents requis sont alignés avant une transition de phase | 100 % des agents requis en statut "actif" ou "terminé" | Blocker |
| QG-ORCH-002 | Résolution de conflit | Tout conflit doit être résolu avant de poursuivre | Décision d'arbitrage produite et notifiée | Blocker |
| QG-ORCH-003 | Traçabilité des décisions | Toute décision d'arbitrage doit être documentée | Justification écrite, date, agents concernés | Critical |
| QG-ORCH-004 | Délai de réponse aux blocages | Un blocage signalé doit recevoir une réponse dans les délais | < 2h ouvrées pour les blocages critiques | Critical |
| QG-ORCH-005 | Complétude du rapport | Le rapport de coordination doit couvrir tous les agents actifs | Chaque agent cité avec son statut et ses éventuels problèmes | Major |
| QG-ORCH-006 | Cohérence des transitions | Ne pas valider une phase si les dépendances amont ne sont pas remplies | Tous les prérequis de phase cochés | Blocker |
