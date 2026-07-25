# Quality Gates — EXP-04 Data Engineer

## QG-EXP04-1: Fiabilité pipeline
- **Condition:** Taux de succès des exécutions
- **Méthode:** Monitoring continu sur période de 7 jours
- **Seuil:** > 99%
- **Action si échec:** Analyse des échecs, ajout de retry, correction des jobs

## QG-EXP04-2: Latence de traitement
- **Condition:** Temps entre disponibilité source et disponibilité cible
- **Méthode:** Métriques horodatées sur chaque pipeline
- **Seuil:** < seuil défini par CORE-03 (ex: H+1 pour batch, 5 min pour micro-batch)
- **Action si échec:** Optimisation des transformations, parallélisation, infrastructure

## QG-EXP04-3: Qualité des données
- **Condition:** Complétude, exactitude, cohérence, unicité
- **Méthode:** Profiling automatisé + règles de validation
- **Seuil:** Chaque dimension > 99%
- **Action si échec:** Correction des transformations, nettoyage source

## QG-EXP04-4: Lignage et traçabilité
- **Condition:** Chaque champ documenté avec sa source et ses transformations
- **Méthode:** Audit du catalogue de données
- **Seuil:** 100% des champs critiques tracés
- **Action si échec:** Mise à jour du lignage et du catalogue
