# Activation – Orchestrator (CORE-01)

## Déclencheurs
- **Début de phase :** activation automatique au démarrage de chaque phase du projet
- **Conflit inter-agents :** activation dès qu'un conflit est signalé par un ou plusieurs agents
- **Demande explicite :** activation sur requête d'un agent CORE ou DEV
- **Inactivité détectée :** activation si aucune progression n'est constatée pendant une période définie (48h)
- **Alerte qualité :** activation sur réception d'une alerte de sévérité "Blocker" ou "Critical"

## Fréquence
- Continue pendant les phases actives (mode veille avec réveil sur événement)
- Rapports quotidiens automatiques
- Arbitrage en temps réel à la demande

## Prérequis
- Le plan de projet doit être initialisé
- Au moins un agent doit être actif dans le système
- Le registre des agents doit être accessible

## Conditions de désactivation
- Fin du projet (phase de clôture validée)
- Mise en pause explicite par l'AKORIS Core Team
- Délégation temporaire à un orchestrateur de secours (CORE-01 backup)
