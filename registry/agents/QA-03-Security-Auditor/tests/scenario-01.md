# Scenario 01 — Audit OWASP sur module API

## Objectif
Vérifier que QA-03 exécute un audit OWASP Top 10 complet sur un module API.

## Entrées
- Module: `src/api/auth.ts`
- Code source complet
- Configuration infrastructure associée

## Étapes
1. Déclencher l'audit via CORE-01
2. QA-03 exécute l'analyse SAST
3. QA-03 classe les vulnérabilités par CVSS
4. QA-03 produit le rapport d'audit

## Résultat attendu
- Analyse OWASP réalisée sur tous les endpoints
- Vulnérabilités classées par sévérité
- Recommandations de correction fournies
