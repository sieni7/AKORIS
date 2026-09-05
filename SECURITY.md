# Politique de sécurité AKORIS

## Périmètre

Cette politique couvre le contenu, les schémas, les exemples et les futures implémentations publiés dans le dépôt officiel [sieni7/AKORIS](https://github.com/sieni7/AKORIS).

AKORIS est actuellement principalement un dépôt de spécification et de gouvernance. Les mécanismes techniques de détection, de filtrage et de protection décrits dans les politiques AKORIS ne doivent pas être considérés comme automatiquement appliqués par ce dépôt.

## Signaler une vulnérabilité

Ne publiez pas de vulnérabilité non corrigée dans une issue publique, une discussion publique ou une pull request ouverte.

Utilisez en priorité le mécanisme privé de signalement de vulnérabilité de GitHub sur le dépôt officiel, lorsqu’il est disponible :

1. Ouvrez l’onglet **Security** du dépôt [sieni7/AKORIS](https://github.com/sieni7/AKORIS).
2. Sélectionnez le mécanisme privé de signalement de vulnérabilité.
3. Décrivez le problème de manière suffisamment précise pour permettre sa reproduction et son évaluation.

Si le mécanisme privé GitHub n’est pas disponible, ouvrez une issue publique uniquement pour demander un canal privé de contact, sans divulguer de détails exploitables. L’adresse email de sécurité du projet n’est pas publiée à ce jour.

## Informations à fournir

Le signalement devrait contenir, lorsque cela est possible :

- une description claire de la vulnérabilité et de son impact potentiel ;
- le composant, le fichier ou la version concernée ;
- les étapes de reproduction minimales ;
- un exemple ou une preuve de concept non destructive ;
- les prérequis d’exploitation ;
- une proposition de correction ou de mesure de réduction du risque ;
- toute information indiquant si la vulnérabilité est déjà exploitée.

Merci de ne pas inclure de secrets réels, de données personnelles ou de données métier confidentielles dans le signalement.

## Traitement des signalements

Les mainteneurs évaluent la validité, la portée et la criticité du signalement. Le traitement peut comprendre une reproduction contrôlée, une correction, une mise à jour documentaire, une note de mitigation et une publication coordonnée.

Aucun délai de réponse ou de correction n’est garanti tant qu’un canal opérationnel et une équipe de sécurité dédiés ne sont pas établis. Les délais applicables seront documentés dans les communications liées au signalement.

## Versions et mises à jour

Les utilisateurs doivent consulter le [CHANGELOG](CHANGELOG.md), les tags et les avis publiés avant d’adopter une version. Les modifications incompatibles et les guides de migration suivent les règles de gouvernance et de licence du projet.

## Pratiques de sécurité attendues

Les contributions ne doivent pas ajouter de secrets, de tokens, de données personnelles non anonymisées ou de code source confidentiel. Les changements touchant les prompts, les données, les politiques ou les mécanismes de gouvernance doivent être relus selon les exigences applicables d’AKORIS.

Cette politique est un document initial. Elle devra être révisée lorsque le dépôt disposera d’un composant exécutable, d’un canal de sécurité maintenu et d’une procédure de réponse aux incidents formalisée.
