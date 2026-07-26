# ADR-001 : Choix de Commander.js comme framework CLI

**Statut :** Approuvé  
**Date :** 2026-07-26  
**Décideur :** AKORIS Core Team  

## Contexte

Le CLI AKORIS devait exposer 20+ commandes avec sous-commandes, options, validation d'arguments, et aide automatique. Plusieurs frameworks Node.js existent.

## Options envisagées

| Option | Points forts | Points faibles |
|--------|-------------|----------------|
| **Commander.js** | Mature, standard de facto, hooks preAction, aide automatique | Pas de génération dynamique d'aide |
| **Yargs** | Auto-generate help, typage fort | Syntaxe moins expressive, maintenance communautaire |
| **oclif** | CLI Heroku, tests intégrés | Lourd, opinionated, courbe d'apprentissage |
| **DIY (argparse natif)** | Zéro dépendance | Tout à réinventer : aide, validation, sous-commandes |

## Décision

**Commander.js v12** a été retenu. La raison principale est le système de **hooks** (`preAction`) qui permet d'injecter `setGlobalOptions()` avant chaque commande sans modifier chaque action handler individuellement.

## Conséquences

- Toutes les commandes héritent des options globales sans duplication
- L'aide (`--help`) est générée automatiquement
- Les sous-commandes sont définies par `.command()` chaîné
- La validation des arguments est intégrée (`.argument()`, `.requiredOption()`)
- La résolution des alias (`akoris go`) est effectuée avant `program.parse()` par modification de `process.argv`

## Références

- [Commander.js](https://github.com/tj/commander.js)
