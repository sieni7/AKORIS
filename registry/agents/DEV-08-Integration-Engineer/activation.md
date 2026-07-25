# Activation — DEV-08

## Déclencheurs
- Projet avec intégration de services tiers
- Nouveau connecteur requis
- Mise à jour d'API tierce (breaking change)
- Dégradation d'une intégration existante
- Demande de nouvelle fonctionnalité nécessitant un service externe

## Fréquence
- Ponctuelle : à chaque nouvelle intégration
- Continue : maintenance des connecteurs existants

## Prérequis
- Documentation de l'API tierce disponible
- Accès aux credentials (via vault/sécurisé)
- Architecture backend définie par DEV-02
- Contraintes de sécurité validées par QA-03
