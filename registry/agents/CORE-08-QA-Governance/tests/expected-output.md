# Expected Deliverables — CORE-08 QA Governance

## Format des livrables

| Livrable | Format | Contenu minimal | Destinataire |
|----------|--------|-----------------|--------------|
| Définition des Quality Gates | Markdown (`.md`) | Critères, seuils, phases, responsabilités, procédure de validation | CORE-01, GOV-02 |
| Rapports de conformité globaux | Markdown (`.md`) | Synthèse, indicateurs clés, non-conformités, plan d'action | CORE-01 |
| Tableau de bord qualité | Dashboard / JSON | Métriques, tendances, alertes, filtres par domaine | Tous |
| Plan d'actions correctives | Markdown (`.md`) | Actions, responsable, échéance, statut, priorité | CORE-01, agent concerné |
| Bilan qualité par release | Markdown (`.md`) | Résumé, QG passés/échoués, recommandations, décisions | CORE-01, GOV-02 |

## Règles de qualité
- Chaque Quality Gate doit être testé et validé avant la release.
- Le tableau de bord doit être mis à jour en temps réel.
- Les rapports de conformité doivent inclure une synthèse exécutive.
- Les actions correctives doivent avoir un responsable et une échéance clairement identifiés.
