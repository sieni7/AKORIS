# Test Scenario: Validation du contrat

## Objectif
Vérifier que le contrat de l'agent CORE-02 contient toutes les sections requises et que leur contenu est cohérent.

## Entrées
- Fichier `contract.md` complet
- Fichier `contract.json` structuré
- Spécifications du domaine Architecture

## Étapes
1. Vérifier que l'ID, le nom et la version correspondent dans tous les documents
2. Valider que la mission couvre la définition architecturale et la production d'ADR
3. Vérifier que chaque responsabilité a au moins une limite correspondante
4. Valider que les entrées incluent les specs fonctionnelles et les contraintes techniques
5. Vérifier que les sorties incluent ADR, diagrammes et spécifications
6. Vérifier que les dépendances listées sont réciproques

## Résultat attendu
- Tous les documents sont cohérents entre eux
- Aucune responsabilité sans limite associée
- Toutes les dépendances sont réciproques
- Les quality gates sont tous mesurables
