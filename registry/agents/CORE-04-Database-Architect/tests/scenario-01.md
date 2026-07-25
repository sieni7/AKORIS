# Test Scenario: Validation du contrat

## Objectif
Vérifier que le contrat de l'agent CORE-04 contient toutes les sections requises et que leur contenu est cohérent.

## Entrées
- Fichier `contract.md` complet
- Fichier `contract.json` structuré
- Spécifications du domaine Données

## Étapes
1. Vérifier que l'ID, le nom et la version correspondent dans tous les documents
2. Valider que la mission couvre la conception de données et les performances SQL
3. Vérifier que chaque responsabilité a au moins une limite correspondante
4. Valider que les entrées incluent besoins de données et architecture globale
5. Vérifier que les sorties incluent schéma, migrations et plan d'indexation
6. Vérifier que les dépendances listées sont réciproques

## Résultat attendu
- Tous les documents sont cohérents entre eux
- Aucune responsabilité sans limite associée
- Toutes les dépendances sont réciproques
- Les quality gates sont tous mesurables
