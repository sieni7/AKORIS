# ADR-001 : Pourquoi Commander.js ?

## Contexte

AKORIS CLI a besoin d'un framework de parsing d'arguments robuste, capable de gérer :
- des sous-commandes imbriquées ;
- des options globales et locales ;
- une aide automatique (`--help`) ;
- l'intégration avec TypeScript (typage) ;
- des hooks (ex: `preAction` pour les alias).

## Décision

Nous utilisons [Commander.js](https://github.com/tj/commander.js) version 12.

## Alternatives considérées

| Framework | Raison du rejet |
|-----------|-----------------|
| yargs | Bon, mais syntaxe plus lourde et moins déclarative. |
| oclif | Très complet, mais lourd pour un CLI mono-package (hérite d'un framework de plugins). |
| minimist | Trop bas niveau ; nécessite d'implémenter manuellement les sous-commandes et l'aide. |

## Justification

- Commander est léger (pas de dépendances lourdes).
- La syntaxe est déclarative : `new Command().option().action()`.
- Il supporte les hooks (`preAction`, `postAction`) qui nous sont nécessaires pour les alias et les options globales.
- Il génère automatiquement l'aide et la gestion des erreurs.
- Il est largement utilisé et bien maintenu.

## Conséquences

- Le CLI dépend d'une bibliothèque externe (mais celle-ci est stable et mature).
- Les commandes sont définies en code, ce qui offre une grande flexibilité (contrairement à une configuration JSON).

## Statut

Accepté.
