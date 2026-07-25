# Scenario 02 — Audit de dépendances

## Objectif
Vérifier que QA-03 analyse les vulnérabilités des dépendances d'un projet.

## Entrées
- `package.json` et `package-lock.json`
- Liste des dépendances directes et transitives
- Base CVE à jour

## Étapes
1. Soumettre les fichiers de dépendances à QA-03
2. QA-03 analyse les vulnérabilités connues
3. QA-03 produit un rapport de dépendances

## Résultat attendu
- Liste des dépendances vulnérables avec CVSS
- Recommandations de mise à jour
- Aucune vulnérabilité critique (0)
- < 5 vulnérabilités hautes
