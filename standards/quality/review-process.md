# Processus de revue de code

## Introduction

Ce document definit le processus de revue de code applicable a tous les projets de l'organisation. L'objectif est d'assurer la qualite du code, le partage de connaissances et la coherence technique au sein des equipes.

## Principes

- Chaque modification de code est revue avant d'etre integree.
- La revue est un processus collaboratif, pas un jugement.
- L'auteur et le relecteur partagent la responsabilite de la qualite.
- Les revues sont basees sur des criteres objectifs.

## Critères de revue

### Structure et architecture

- Respect des regles de layering (domaine, application, infrastructure, presentation).
- Absence de dependances circulaires.
- Separation des responsabilites (SRP).
- Injection de dependances correcte.

### Fonctionnalite

- Le code implemente-t-il correctement le besoin exprime ?
- Les cas limites sont-ils traites ?
- La gestion d'erreurs est-elle adequate ?

### Tests

- Des tests unitaires couvrent-ils les nouveaux comportements ?
- Les tests d'integration sont-ils presents pour les acces aux donnees ?
- La couverture de code est-elle suffisante ?

### Performance et securite

- Pas de N+1 queries.
- Les requetes sont-elles indexees correctement ?
- Les entrees utilisateur sont-elles validees et assainies ?
- Les secrets ne sont-ils pas exposes ?

### Style et conventions

- Respect des conventions de nommage.
- Code propre et lisible.
- Absence de code commente.
- Documentation minimale.

## Deroule d'une revue

### Pour l'auteur

1. Creer une Pull Request avec un titre et une description clairs.
2. Decouper les PR en modifications petites et coherentes (< 400 lignes).
3. Assigner des relecteurs explicites.
4. Relire sa propre PR avant de l'assigner.
5. Repondre aux commentaires de maniere constructive.

Template de description de PR :

```markdown
## Description
[Description concise des modifications]

## Type de changement
- [ ] Correction de bug
- [ ] Nouvelle fonctionnalite
- [ ] Refactoring
- [ ] Mise a jour de dependances
- [ ] Documentation

## Tests effectuês
- [ ] Tests unitaires ajoutés/mis a jour
- [ ] Tests d'integration ajoutés/mis a jour
- [ ] Tests manuels effectués

## Breaking changes
[Oui/Non] - [Description si oui]

## Checklist
- [ ] Le code compile sans erreur
- [ ] Les tests passent
- [ ] La couverture de code est maintenue ou amelioree
- [ ] La documentation est mise a jour
- [ ] Les regles de securite sont respectees
```

### Pour le relecteur

1. Verifier que la PR a une description complete.
2. Lire le code dans son ensemble avant de commenter.
3. Faire des commentaires specifiques et constructifs.
4. Distinguer les blocus des suggestions.
5. Approuver uniquement quand tous les criteres sont satisfaits.

### Apres la revue

1. L'auteur applique les modifications demandees.
2. Le relecteur verifie les changements.
3. La PR est mergée apres approbation.
4. La branche est supprimee apres le merge.

## Types de commentaires

### Bloquants (Require Changes)

Violation des regles fondamentales :
- Bug potentiel ou avéré.
- Faille de securite.
- Violation des principes architecturaux.
- Absence de tests pour des fonctionnalites critiques.

### Recommandations (Suggestion)

Ameliorations possibles :
- Refactoring optionnel.
- Alternative plus idiomatique.
- Ajout de tests supplementaires.

### Questions (Question)

Demande de clarification :
- Intention du code non comprise.
- Comportement attendu dans un cas specifique.

## Regles de temps

- Premiere revue dans les 4 heures ouvrées suivant la creation de la PR.
- Revue complete dans les 24 heures.
- Temps maximal de revision par PR : 30 minutes par session.
- Une PR ne doit pas rester ouverte plus de 48 heures sans mise a jour.

## Echecs de revue

Si une PR est bloquee :

1. Discuter en personne ou en visio si les echanges ecrits sont bloques.
2. Faire appel a un troisieme relecteur si necessaire.
3. Escaler a l'architecte technique si desaccord persistant.

## Metriques

Les metriques suivantes sont suivies pour le processus de revue :

- Temps moyen avant premiere revue.
- Temps moyen de resolution d'une PR.
- Nombre moyen de commentaires par PR.
- Taux de PR approuvees du premier coup.
- Taux de bugs echappant a la revue.

## Outils

- GitHub Pull Requests ou GitLab Merge Requests pour les revues.
- Label `review:required` pour les PR en attente.
- Integration avec Slack pour les notifications de revue.
- Plugin SonarLint dans les IDE pour la pre-revue automatique.
