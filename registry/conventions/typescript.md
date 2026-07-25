# Conventions TypeScript

## Version et configuration

- Utiliser TypeScript en strict mode (`strict: true`).
- Cibler ES2022 ou superieur.
- Utiliser `esModuleInterop` et `moduleResolution: "bundler"`.
- Activer `noUnusedLocals` et `noUnusedParameters`.
- Desactiver `any` implicite ; preferer `unknown` quand le type est inconnu.

## Typage

- Toujours typer explicitement les fonctions publiques.
- Utiliser l'inference de type pour les variables locales simples.
- Preferer `interface` pour les objets publics, `type` pour les unions et utilitaires.
- Utiliser `Readonly<T>` et `Partial<T>` pour exprimer les intentions.
- Eviter les `as` casts ; preferer les guards de type et assertions.

## Syntaxe

- Utiliser `const` et `let`, jamais `var`.
- Utiliser les fonctions flechees (`=>`) pour les callbacks.
- Utiliser les template literals pour la concaténation.
- Desctructurer les objets et tableaux de maniere explicite.
- Utiliser les options chains (`?.`) et coalescence (`??`).

## Imports

- Utiliser des imports nommes preferables aux imports par defaut.
- Ordonner les imports : externes, internes, relatifs.
- Ne pas utiliser `import * as` sauf pour les cas necessaires (namespaces).
- Utiliser des alias de chemin (`@/`) configures dans tsconfig.

## Structure des fichiers

- Un fichier par classe ou composant majeur.
- Les types partages dans un fichier `types.ts`.
- Exporter uniquement ce qui est necessaire.
- Utiliser des index files pour les re-exports.
