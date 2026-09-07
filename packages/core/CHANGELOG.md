# Changelog — @akoris/core

## [0.1.0] - 2026-09-05

### Ajouté
- Configuration du seed : `package.json` (0 dépendance runtime), `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`, `.gitignore`
- `src/types.ts` : tous les types du modèle de données (§4 de la SPEC), `AkorisEvent`, `SnapshotPersister` (forme inférée, D1)
- `src/errors.ts` : 5 classes d'erreur (§7) avec `name` et prototype chaînés
- `src/utils/crypto.ts` : canonicalisation E1 (clés triées alphabétiquement, UTF-8, JSON compact) + SHA-256
- `src/index.ts` : barrel exports
- Tests : vecteurs fixes de canonicalisation E1 (avec et sans `previousHash`)