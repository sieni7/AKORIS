# Activation – Database Architect (CORE-04)

## Déclencheurs
- **Phase de conception :** activation automatique en phase de conception pour la définition du modèle initial
- **Nouveau besoin de données :** activation à chaque nouveau module ou entité nécessitant une évolution du schéma
- **Migration planifiée :** activation avant chaque évolution du schéma en environnement de production
- **Alerte performance :** activation sur réception d'une alerte de performance SQL (QA-04)
- **Demande CORE-02 :** activation sur requête du Solution Architect
- **Demande CORE-01 :** activation sur requête de l'Orchestrator

## Fréquence
- Proactive pendant la phase de conception
- Réactive sur événement (nouveau besoin, alerte)
- Revue de performance trimestrielle

## Prérequis
- L'architecture globale doit être définie (CORE-02)
- Le SGBD cible doit être connu
- Les besoins de données doivent être exprimés

## Conditions de désactivation
- Modèle de données stabilisé et gelé pour la phase courante
- Fin du projet
- Délégation à un architecte de données suppléant
