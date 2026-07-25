# Politique : Zéro dette technique non maîtrisée

**ID** : `policy-zero-debt`
**Version** : 1.0.0

## Règle

Toute dette technique est identifiée, documentée, évaluée et traitée avant qu'elle ne compromette la maintenabilité du projet.

## Application

- Chaque élément de dette est enregistré dans le backlog avec une estimation d'impact
- Un seuil maximal de dette est défini par projet
- Chaque sprint doit réduire la dette existante ou au minimum ne pas l'augmenter
- La dette est revue à chaque Quality Gate

## Sanction

Une dette non documentée ou dépassant le seuil bloque le Quality Gate **Dette technique**.
