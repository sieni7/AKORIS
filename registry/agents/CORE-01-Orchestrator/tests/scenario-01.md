# Test Scenario: Validation du contrat

## Objectif
Vérifier que le contrat de l'agent CORE-01 contient toutes les sections requises et que leur contenu est cohérent.

## Entrées
- Fichier `contract.md` complet
- Fichier `contract.json` structuré
- Spécifications du domaine Gouvernance

## Étapes
1. Vérifier que l'ID, le nom et la version correspondent dans tous les documents
2. Valider que la mission est non ambiguë et alignée avec le domaine
3. Vérifier que chaque responsabilité a au moins une limite correspondante
4. Valider que chaque entrée a une sortie correspondante
5. Vérifier que les quality gates sont mesurables et testables
6. Vérifier que les dépendances listées sont réciproques

## Résultat attendu
- Tous les documents sont cohérents entre eux
- Aucune responsabilité sans limite associée
- Toutes les dépendances sont réciproques
- Les quality gates sont tous mesurables
