# Système de formatage des sorties

Le module `format.ts` centralise toutes les sorties du CLI. Aucune commande n'utilise `console.log` directement.

---

## Principe

Toute sortie passe par un des helpers du module. Cela garantit :
- une apparence cohérente (couleurs, symboles)
- le support natif de `--json` (désactive la sortie texte)
- le support de `--quiet` (réduit le bruit)
- une seule cible à modifier pour changer le style global

## Helpers de base

```typescript
success("Projet initialisé");      // ✅  Projet initialisé (vert)
error("Échec de la transition");   // ❌  Échec de la transition (rouge)
warn("Aucun alias défini");        // ⚠️  Aucun alias défini (jaune)
info("Template appliqué");         // ℹ️  Template appliqué (bleu)
title("Résultats");                // 📋 Résultats (gras, souligné)
```

## Sortie JSON

```typescript
shouldOutputJSON()  // → bool (lecture de l'état global)
printJSON(data)     // → JSON.stringify(data, null, 2)
```

Quand `--json` est actif, `success()`, `error()`, `warn()`, `info()` et `title()` ne produisent aucune sortie texte.

## Options globales

Définies une seule fois sur le programme Commander, propagées via un hook `preAction` :

```typescript
program
  .option('--json', 'Sortie au format JSON')
  .option('--verbose', 'Affiche les logs détaillés')
  .option('--quiet', 'Réduit la sortie au minimum')
  .option('--no-color', 'Désactive les couleurs')
  .option('--output <file>', 'Exporte le résultat dans un fichier')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    setGlobalOptions({
      json: !!opts.json,
      verbose: !!opts.verbose,
      quiet: !!opts.quiet,
      noColor: !!opts.noColor,
      output: opts.output,
    });
    if (opts.noColor) chalk.level = 0;
  });
```

## Export fichier

Quand `--output <file>` est utilisé, la sortie est dupliquée dans le fichier sans modification du comportement d'affichage.

## Implémentation

Source : `src/output/format.ts`

```typescript
export function setGlobalOptions(opts: GlobalOptions): void;
export function shouldOutputJSON(): boolean;
export function isVerbose(): boolean;
export function printJSON(data: unknown): void;
export function success(msg: string): void;
export function error(msg: string): void;
export function warn(msg: string): void;
export function info(msg: string): void;
export function title(msg: string): void;
export function spinner(label: string): Ora;
export function getOpts(): GlobalOptions;
```
