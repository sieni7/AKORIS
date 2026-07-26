# ADR-004 : Pourquoi un moteur de recherche fédéré ?

## Contexte

Le Registry est volumineux : 33 agents, 12 règles, 15 livrables, 18 événements, 69 capacités, etc. Pour trouver une information, l'utilisateur devait connaître la bonne commande (`capability find`, `agent list`, `logs`, etc.). Il n'existait aucun point d'entrée unique.

## Décision

Nous implémentons un moteur de recherche fédéré, accessible via la commande `akoris search`, qui interroge 7 sources en une seule requête.

## Alternatives considérées

- **Recherche par commande existante** (état antérieur) : l'utilisateur doit savoir où chercher.
- **Index ElasticSearch** : très complet, mais nécessite un service externe, une installation, une maintenance.
- **`grep` sur les fichiers** : peu structuré, ne permet pas de regrouper les résultats par type.

## Justification

- La recherche fédérée est légère : l'indexation est faite en mémoire au moment de l'exécution.
- Elle est immédiate : pas de service externe à déployer.
- Elle est extensible : on peut ajouter de nouvelles sources (ex: commentaires Git, issues GitHub) sans modifier l'API.
- Elle est simple à utiliser : une seule commande pour tout trouver.

## Conséquences

- Le service `SearchEngine` est responsable de l'indexation et de la recherche.
- Les résultats sont groupés par type pour une meilleure lisibilité.
- La recherche est insensible à la casse et supporte la correspondance partielle.
- Pour des volumes très importants (>500 agents), une évolution vers une indexation persistante sera nécessaire.

## Statut

Accepté.
