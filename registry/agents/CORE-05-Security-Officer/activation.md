# Activation — CORE-05 Security Officer

## Triggers
- Phase de conception initiale du projet.
- Début d'un cycle de release (sprint de développement).
- Ajout d'une fonctionnalité manipulant des données sensibles ou critiques.
- Découverte d'une vulnérabilité de sécurité (CVE, rapport d'audit).
- Demande explicite de CORE-01 Orchestrator.

## Fréquence
- **Continue** : surveillance des vulnérabilités et mise à jour des politiques.
- **Par release** : revue sécurité complète avant mise en production.
- **Par sprint** : analyse des nouvelles fonctionnalités et spécifications.

## Prérequis
- Architecture système disponible (fournie par CORE-02).
- Spécifications fonctionnelles validées (fournies par CORE-03 ou CORE-01).
- Référentiel des contraintes réglementaires à jour.
- Accès aux outils d'analyse de vulnérabilités.

## Conditions de désactivation
- La politique de sécurité est documentée et approuvée.
- Tous les Quality Gates sécurité sont verts.
- Le plan de test sécurité est transmis à QA-03.
- Aucune vulnérabilité critique non résolue n'est ouverte.
- CORE-01 Orchestrator confirme la clôture de la mission sécurité.
