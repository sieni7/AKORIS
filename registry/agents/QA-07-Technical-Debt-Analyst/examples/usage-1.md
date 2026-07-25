# Usage 1 — Analyse dette technique du Frontend

## Contexte
Le module Frontend (DEV-01) a accumulé de la dette technique sur les 6 derniers mois. Une analyse complète est demandée par CORE-08 avant la release majeure.

## Déclenchement
```bash
@QA-07 debt frontend-monolith
```

## Actions réalisées
1. Analyse des métriques SonarQube (45 code smells, 12 duplications)
2. Analyse des métriques ESLint (87 warnings, 18 erreurs)
3. Étude de l'historique GIT (342 commits, 6 mois)
4. Classification et priorisation des 67 items identifiés
5. Calcul de la tendance sur 3 mois
6. Élaboration du plan de remboursement sur 4 sprints

## Résultats

### Rapport de dette technique
- **Dette totale**: 45 homme-jours
- **Évolution**: +12% vs sprint précédent ⚠️
- **Tendance**: ↗️ Hausse (3ème sprint consécutif)
- **Nombre d'items**: 67 (8 critiques, 22 majeurs, 37 mineurs)

### Top prioritaire
| ID | Type | Sévérité | Description | Effort | Localisation |
|----|------|----------|-------------|--------|-------------|
| TD-001 | Code | Critique | 3 modules avec dépendance circulaire | 8 hj | modules/shared/ |
| TD-002 | Test | Critique | Couverture de test < 50% sur 5 composants | 6 hj | components/table* |
| TD-003 | Code | Majeure | Complexité cyclomatique > 20 dans 12 fonctions | 5 hj | utils/helpers.ts |
| TD-004 | Doc | Majeure | 4 composants majeurs sans documentation | 4 hj | components/ui/ |

### Plan de remboursement
| Sprint | Effort | Focus | Objectif |
|--------|--------|-------|----------|
| Sprint 13 | 12 hj | TD-001 (dép. circulaires) + TD-003 (complexité) | -12 hj dette |
| Sprint 14 | 10 hj | TD-002 (couverture tests) | -22 hj dette |
| Sprint 15 | 10 hj | Dette majeure restante + audit | -32 hj dette |
| Sprint 16 | 13 hj | Dette mineure + documentation | -45 hj dette |

## Décision
**Plan de remboursement validé par CORE-08** — 4 sprints alloués. Une alerte est émise car la tendance est à la hausse pour le 3ème sprint consécutif.
