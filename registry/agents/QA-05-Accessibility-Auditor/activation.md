# Activation — QA-05 Accessibility Auditor

## Déclencheurs
- **Automatique**: Avant chaque release en production
- **Automatique**: À chaque sprint review (validation continue)
- **Manuel**: Commande `@QA-05 a11y <url>`
- **Manuel**: Sur demande de DEV-05 ou CORE-01

## Fréquence
- Audit complet : avant chaque release
- Vérification rapide automatisée : à chaque déploiement sur staging
- Revue manuelle : mensuelle

## Prérequis
- Application déployée en environnement de test/staging
- Outils d'audit automatisé configurés (axe-core, Lighthouse CI)
- Critères WCAG cibles définis par projet
- Lecteurs d'écran disponibles (NVDA, VoiceOver)

## Post-conditions
- Rapport d'accessibilité transmis à CORE-01 et DEV-05
- Anomalies bloquantes remontées à GOV-02
- Checklist WCAG mise à jour
