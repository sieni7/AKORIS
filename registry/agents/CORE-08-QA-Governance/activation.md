# Activation — CORE-08 QA Governance

## Triggers
- Début de projet (définition initiale des Quality Gates).
- Début d'une phase projet ou d'un sprint.
- Réception d'un rapport d'audit qualité (de tout agent QA).
- Dégradation des métriques qualité en dessous des seuils.
- Phase de préparation de release (revue qualité finale).
- Demande explicite de CORE-01 Orchestrator ou GOV-02.
- Non-conformité critique identifiée.

## Fréquence
- **Continue** : surveillance du tableau de bord qualité et des alertes.
- **Par sprint** : collecte des métriques et suivi des actions correctives.
- **Par release** : revue qualité complète, bilan et rapport de conformité.

## Prérequis
- Registre des Quality Gates initialisé.
- Liste des agents QA et de leur périmètre d'audit.
- Accès aux rapports d'audit et aux métriques qualité.
- Standards AKORIS disponibles et à jour.
- Tableau de bord qualité configuré.

## Conditions de désactivation
- Tous les QG sont verts pour la phase/release en cours.
- Rapport de conformité produit et approuvé.
- Plan d'actions correctives en place (si applicable).
- Bilan qualité de release validé par CORE-01.
- GOV-02 confirme la conformité qualité.
- CORE-01 Orchestrator valide la clôture.
