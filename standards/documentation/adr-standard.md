# Standard ADR (Architecture Decision Record)

## Introduction

Les Architecture Decision Records permettent de documenter les decisions architecturales importantes prises au cours du cycle de vie d'un projet. Chaque ADR est un fichier Markdown immuable qui capture le contexte, la decision et ses consequences.

## Format obligatoire

Chaque ADR DOIT suivre strictement le format ci-dessous :

```markdown
# ADR-NNNN - Titre de la decision

## Statut

[Propose | Accepte | Deprecie | Remplace par ADR-XXXX]

## Contexte

Pourquoi cette decision est necessaire. Decrire le probleme, les contraintes, le contexte technique et metier. Cette section doit etre suffisamment detaillee pour qu'un lecteur futur comprenne la situation sans connaissances prealables.

## Decision

Decrire la decision prise. Utiliser un langage clair et precis. Indiquer clairement ce qui a ete choisi, et eventuellement ce qui a ete rejete.

## Consequences

Lister les consequences positives et negatives de cette decision. Inclure les impacts sur l'architecture, les performances, la securite, la maintenabilite et l'equipe.

### Positives

- Avantage 1
- Avantage 2

### Negatives

- Inconvenient 1
- Inconvenient 2

## Alternatives considerees

### Alternative 1 : Titre

Description succincte de l'alternative.

Raison du rejet : explication.

### Alternative 2 : Titre

Description succincte de l'alternative.

Raison du rejet : explication.

## References

- Lien vers des ressources externes
- Liens vers d'autres ADR
- Tickets ou issues associes
```

## Regles de gestion

### Numerotation

Les ADR sont numerotes sequentiellement : ADR-0001, ADR-0002, etc.

### Emplacement

Les ADR sont stockes dans le repertoire `docs/adr/` du projet concerne.

### Immutabilite

Un ADR ne peut pas etre modifie apres son acceptation. Pour changer une decision, il faut creer un nouvel ADR qui remplace le precedent.

### Processus de creation

1. Creer une branche avec le format `adr/NNNN-titre-court`.
2. Rediger l'ADR en suivant le format obligatoire.
3. Soumettre en Pull Request avec le label `adr`.
4. La PR doit etre approuvee par au moins deux architectes.
5. Fusionner dans la branche principale.
6. Informer l'equipe via le canal dedie.

### Cycle de vie

- **Propose** : en cours de discussion, pas encore accepte.
- **Accepte** : la decision est approuvee et mise en oeuvre.
- **Deprecie** : la decision n'est plus recommandee.
- **Remplace par ADR-XXXX** : un ADR ultérieur a pris le relais.

## Gabarit

Le fichier `docs/adr/ADR-TEMPLATE.md` contient le gabarit officiel a copier pour chaque nouvel ADR.

## Exemple reduit

```markdown
# ADR-0001 - Utilisation de PostgreSQL comme base de donnees principale

## Statut

Accepte

## Contexte

Notre application monolithique existante utilise MySQL 5.7. Nous migrons vers une architecture microservices et avons besoin d'un SGBD offrant un meilleur support des transactions distribuees et des types JSON.

## Decision

Nous adoptons PostgreSQL 16 comme base de donnees principale pour tous les nouveaux microservices. Les services existants sous MySQL seront migres progressivement.

## Consequences

Positives :
- Support natif des types JSON avec indexation GIN
- Meilleure gestion des transactions
- Fonctionnalites de partitionnement avancees

Negatives :
- Courbe d'apprentissage pour l'equipe actuelle
- Migration des donnees non triviale

## Alternatives considerees

Alternative : Conserver MySQL 8.0
Raison du rejet : le support JSON est moins performant et les fonctionnalites de clustering sont insuffisantes pour nos besoins futurs.

## References

- https://www.postgresql.org/docs/16/
- ADR-0003 strategie de migration des donnees
```
