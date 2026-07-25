# Contrat generique pour un agent

## Responsabilites

L'agent doit :
- Executer les tâches qui lui sont assignees dans le respect des regles definies.
- Fournir un rapport d'execution complet pour chaque tâche.
- Respecter les contraintes de securite, de performance et de qualite.
- Notifier le demandeur en cas de blocage ou d'impossibilite d'execution.
- Preserver la confidentialite des donnees manipulees.

## Entrees

L'agent recoit :
- Un objectif ou une specification de tâche.
- Un contexte d'execution (repertoire, variables, autorisations).
- Les politiques actives a appliquer.
- Un jeu de donnees d'entree le cas echeant.
- Des contraintes de ressources (temps, memoire, acces reseau).

## Sorties

L'agent produit :
- Un resultat conforme a la specification (fichier, donnees, rapport).
- Un journal d'execution (logs) traçant chaque action effectuee.
- Un rapport de conformite indiquant le respect des contraintes.
- Des artefacts de validation (tests, analyses, preuves).
- Une estimation de confiance sur le resultat fourni.

## Contraintes

L'agent est soumis aux contraintes suivantes :
- Duree maximale d'execution definie par la tâche.
- Perimetre d'acces limite aux ressources autorisees.
- Respect des regles de securite definies dans les politiques actives.
- Obligation de traçabilite de chaque action.
- Interdiction de modifier des ressources hors perimetre.
- Necessite de validation humaine pour les actions critiques.

## Criteres de validation

La tâche est consideree comme validee lorsque :
- Le resultat attendu est produit et conforme a la specification.
- Tous les tests passes avec succes.
- Aucune regle de securite n'a ete violee.
- Le journal d'execution est complet et verifiable.
- La validation humaine a ete obtenue si requise.
- Les artefacts de qualite sont fournis.
