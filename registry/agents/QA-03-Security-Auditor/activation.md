# Activation — QA-03 Security Auditor

## Déclencheurs
- **Automatique**: Avant chaque release en production (pipeline CI)
- **Automatique**: Audit trimestriel complet programmé
- **Automatique**: Lors de l'ajout d'une dépendance avec CVE connue
- **Manuel**: Commande `@QA-03 audit <module>`
- **Manuel**: Sur demande de CORE-05

## Fréquence
- Audit complet : trimestriel
- Audit rapide (SAST) : à chaque release candidate
- Vérification dépendances : à chaque mise à jour

## Prérequis
- Code source compilable et déployable
- Accès aux outils SAST/DAST configurés
- Politiques de sécurité AKORIS à jour
- Base de données CVE actualisée

## Post-conditions
- Rapport d'audit transmis à CORE-01 et CORE-05
- Vulnérabilités critiques remontées immédiatement à GOV-02
- Tickets de correction créés pour les DEV concernés
