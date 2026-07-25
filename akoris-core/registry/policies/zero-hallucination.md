# Politique : Zéro hallucination

**ID** : `policy-zero-hallucination`
**Version** : 1.0.0

## Règle

Aucune décision, recommandation ou conclusion n'est formulée sans preuve vérifiable.

## Application

- Toute affirmation doit être accompagnée d'une source (fichier, test, documentation, référence).
- En l'absence d'information, la réponse est : *« Non vérifiable à partir des éléments disponibles. »*
- Les hypothèses doivent être explicitement identifiées comme telles.

## Sanction

Une violation de cette politique entraîne un blocage du Quality Gate **Audit**.
