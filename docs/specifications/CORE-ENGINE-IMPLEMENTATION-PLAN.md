# CORE ENGINE IMPLEMENTATION PLAN v0.1

> **Version** : 0.1
> **Statut** : Proposed / Architecture Draft
> **Date** : 2026-09-05
> **Auteur** : AKORIS Core Team
> **Dépend de** : CORE ENGINE SPECIFICATION v0.1 (Proposed / Architecture Draft)
>
> **GO pour Sprint 1** — **Sprint 3 verrouillé** tant que les tests d'invariants (I-1 à I-6) ne passent pas.

---

## 1. Objectif

Transformer la spécification en **plan d'implémentation exécutable**, découpé en sprints coordonnés par Manus et exécutés par OpenCode.

---

## 2. Structure du monorepo

```
packages/core/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── .gitignore
├── CHANGELOG.md
├── README.md
├── src/
│   ├── index.ts              # Barrel exports + createCore()
│   ├── types.ts              # Tous les types (Agents, State, Logs, etc.) — modèle unique
│   ├── errors.ts             # NotFound, Transition, Validation, VersionConflict, Persistence
│   ├── event-bus.ts          # EventBus (sans node:events)
│   ├── engines/
│   │   ├── registry-reader.ts
│   │   ├── state-machine.ts
│   │   ├── quality-gate.ts
│   │   ├── search.ts
│   │   ├── log-reader.ts
│   │   ├── doctor.ts
│   │   └── prompt.ts
│   ├── llm/
│   │   ├── provider.ts       # Contrat LLMProvider (borné)
│   │   └── mock-provider.ts  # Mock déterministe (tests)
│   ├── managers/
│   │   ├── secret-manager.ts    # node:crypto (AES-GCM + scrypt, enveloppe versionnée)
│   │   └── alias-manager.ts
│   └── utils/
│       └── crypto.ts            # Helpers purs : SHA-256, canonicalisation E1, dérivation de clé
└── tests/                       # Miroir exact de src/ avec .test.ts
    ├── engines/
    ├── managers/
    ├── invariants.test.ts       # Tests d'invariants I-1 à I-8 (Sprint 3)
    ├── e1-canonic.test.ts       # Vecteurs de canonicalisation/hash E1 (dès Sprint 1)
    └── integration.test.ts
```

---

## 3. Golden Rules

| # | Règle | Description |
|---|---|---|
| 1 | **Zéro Dépendance Runtime** | **0 dépendance runtime** dans `@akoris/core` (natif `node:crypto` seulement). Les dépendances **dev** (TypeScript, tsup, vitest, eslint, @vitest/coverage-v8) sont autorisées et **auditées**. |
| 2 | **Async ProjectStore** | Toutes les méthodes de `ProjectStore` sont `Promise<T>`. Le Core ne les appelle pas directement (exception : `SnapshotPersister` injecté dans `StateMachineEngine`), mais l'interface doit être prête. |
| 3 | **Pas de Fonctions dans les Données** | `DoctorIssue.fixActionId` et `GateEvaluator` référencent des identifiants/implémentations runtime, **jamais** de fonctions dans une définition sérialisable (`GateDefinition`, `CriterionDefinition`). |
| 4 | **Immutabilité & Atomicité** | L'historique est **append-only**, jamais muté après création. Une transition est committée **après** persistance réussie ; échec = aucune mutation (invariant I-1). Aucun merge automatique en cas de conflit (I-6). |
| 5 | **TDD & Invariants Obligatoires** | Pour v0.3.0 et au-delà, tests écrits *avant* ou *en même temps* que l'implémentation. Les **tests d'invariants** (I-1 à I-8) sont la **condition de déblocage du Sprint 3**. La couverture est un **indicateur secondaire**, pas une preuve d'invariants. |
| 6 | **Frontière des Secrets** | `FullSnapshot` ne contient que des `EncryptedSecret`. Aucun secret en clair dans logs/snapshots/événements/diagnostics (invariant I-7). |
| 7 | **Bornes et Escape** | Toute résolution de prompt échappe les valeurs, refuse les variables inconnues (`[unresolved]`), borne le contexte (`logs:15`) et limite la taille (invariant de sécurité §4.8). |

---

## 4. Découpage en 7 sprints

| Sprint | Version | Nom | Focus | Critère de blocage |
|---|---|---|---|---|
| **1** | v0.1.0 | Seed | Setup, `types.ts` + contrats (Contract-First), errors, vecteurs E1 | `pnpm build` / `typecheck` / `test` (vecteurs E1) passent |
| **2** | v0.2.0 | Foundation | `EventBus`, `RegistryReader` + seeds mockés | 10+ tests passants, couverture >80% (indicateur) |
| **3** | v0.3.0 | **Governance Runtime** | `StateMachineEngine` (persister injecté, atomique), `QualityGateEngine`, E1 chaîné | **Tests d'invariants I-1 à I-6 passent** — sinon bloqué |
| **4** | v0.4.0 | Runtime Services | `LogReader` (append-only), `SecretManager` (AES-GCM + enveloppe), `AliasManager` | Chiffrement/déchiffrement + **frontière des secrets** validés, filtres logs OK |
| **5** | v0.5.0 | Intelligence | `SearchEngine`, `DoctorEngine` (planFixes/applyFixes audités) | Diagnostic + `fix()` async via `fixActionId` fonctionnent, audit créé |
| **6** | v0.6.0 | AI Runtime | `PromptEngine`, `LLMProvider` (Mock + Interface, borné) | Résolution `{{source:key}}`, `[unresolved]`, escape et bornes OK |
| **7** | v1.0.0 | Stable | Assemblage `createCore()`, intégration, JSDoc, audit, compat ESM/CJS | Couverture >90% (indicateur), invariants + API publique stabilisée, tag sous audit |

---

## 5. Fichiers par sprint

### Sprint 1 — v0.1.0 (Seed)

| # | Fichier | Action | Durée |
|---|---|---|---|
| 1.1 | `packages/core/package.json` | Créer (version 0.1.0, scripts incl. `clean` Windows) | 5 min |
| 1.2 | `packages/core/tsconfig.json` | Créer (`extends: ../../tsconfig.base.json`) | 5 min |
| 1.3 | `packages/core/tsup.config.ts` | Créer | 5 min |
| 1.4 | `packages/core/vitest.config.ts` | Créer (+ coverage) | 5 min |
| 1.5 | `packages/core/.gitignore` | Créer | 2 min |
| 1.6 | `packages/core/CHANGELOG.md` | Créer | 10 min |
| 1.7 | `packages/core/README.md` | Créer | 15 min |
| 1.8 | `packages/core/src/types.ts` | Créer (tous les types §4 spec, **Contract-First**) | 45 min |
| 1.9 | `packages/core/src/errors.ts` | Créer (5 classes) | 15 min |
| 1.10 | `packages/core/src/index.ts` | Créer (barrel exports) | 10 min |
| 1.11 | `packages/core/tests/e1-canonic.test.ts` | Créer (**vecteurs de canonicalisation/hash E1 fixes**) | 45 min |
| 1.12 | `packages/core/src/utils/crypto.ts` | Créer (canonicalisation E1 : tri alphabétique, UTF-8, SHA-256) | 45 min |

> **Vecteurs E1 (fichiers)** — exiger au Sprint 1 : au moins 2 vecteurs fixes (entrée → JSON canonique → SHA-256 attendu), dont un avec `previousHash`.

### Sprint 2 — v0.2.0 (Foundation)

| # | Fichier | Action | Durée |
|---|---|---|---|
| 2.1 | `packages/core/src/event-bus.ts` | Créer (isolation des listeners, erreurs journalisées) | 30 min |
| 2.2 | `packages/core/src/engines/registry-reader.ts` | Créer (agentCount dérivé, validateDependencies) | 1h30 |
| 2.3 | `packages/core/tests/event-bus.test.ts` | Créer | 30 min |
| 2.4 | `packages/core/tests/registry-reader.test.ts` | Créer (40 agents mockés) | 1h |

### Sprint 3 — v0.3.0 (Governance Runtime) — VERROUILLÉ

| # | Fichier | Action | Durée |
|---|---|---|---|
| 3.1 | `packages/core/src/engines/quality-gate.ts` | Créer (GateDefinition/GateEvaluation, règle v1) | 1h30 |
| 3.2 | `packages/core/src/engines/state-machine.ts` | Créer (persister injecté, transition atomique, guard réentrance) | 3h |
| 3.3 | `packages/core/src/utils/crypto.ts` | Compléter (hash chaîné E1) | 30 min |
| 3.4 | `packages/core/tests/quality-gate.test.ts` | Créer | 1h |
| 3.5 | `packages/core/tests/state-machine.test.ts` | Créer | 2h |
| 3.6 | `packages/core/tests/invariants.test.ts` | Créer (**I-1 à I-6 : atomicité, réentrance, idempotence, conflit, autorisation, gate**) | 2h |

> **Sprint 3 NON débloquable** tant que `invariants.test.ts` (I-1 à I-6) ne passe pas. Les tests critiques listés en §9.1 de la spec sont tous exigés.

### Sprint 4 — v0.4.0 (Runtime Services)

| # | Fichier | Action | Durée |
|---|---|---|---|
| 4.1 | `packages/core/src/engines/log-reader.ts` | Créer (append-only, cap, pagination) | 1h |
| 4.2 | `packages/core/src/managers/secret-manager.ts` | Créer (AES-GCM, enveloppe versionnée, salt aléatoire) | 1h15 |
| 4.3 | `packages/core/src/managers/alias-manager.ts` | Créer | 30 min |
| 4.4 | `packages/core/tests/log-reader.test.ts` | Créer | 45 min |
| 4.5 | `packages/core/tests/secret-manager.test.ts` | Créer (**frontière des secrets** : pas de clair dans snapshots/événements/erreurs) | 1h |
| 4.6 | `packages/core/tests/alias-manager.test.ts` | Créer | 30 min |

### Sprint 5 — v0.5.0 (Intelligence)

| # | Fichier | Action | Durée |
|---|---|---|---|
| 5.1 | `packages/core/src/engines/search.ts` | Créer | 1h |
| 5.2 | `packages/core/src/engines/doctor.ts` | Créer (diagnose/planFixes/applyFixes async + audit) | 2h |
| 5.3 | `packages/core/tests/search.test.ts` | Créer | 45 min |
| 5.4 | `packages/core/tests/doctor.test.ts` | Créer (fix jamais exécuté sur simple ID) | 1h30 |

### Sprint 6 — v0.6.0 (AI Runtime)

| # | Fichier | Action | Durée |
|---|---|---|---|
| 6.1 | `packages/core/src/engines/prompt.ts` | Créer (résolution bornée, escape) | 2h |
| 6.2 | `packages/core/src/llm/provider.ts` | Créer (contrat LLMProvider) | 30 min |
| 6.3 | `packages/core/src/llm/mock-provider.ts` | Créer (mock déterministe) | 45 min |
| 6.4 | `packages/core/tests/prompt.test.ts` | Créer (injection, `[unresolved]`, bornes) | 1h30 |

### Sprint 7 — v1.0.0 (Stable)

| # | Fichier | Action | Durée |
|---|---|---|---|
| 7.1 | `packages/core/src/index.ts` | Mettre à jour (createCore) | 30 min |
| 7.2 | `packages/core/tests/integration.test.ts` | Créer (vertical slice complet) | 2h |
| 7.3 | `packages/core/README.md` | Mettre à jour | 30 min |
| 7.4 | `packages/core/CHANGELOG.md` | Mettre à jour | 15 min |
| 7.5 | Vérifier couverture + invariants | `pnpm test --coverage` | 30 min |
| 7.6 | Tag v1.0.0 | `git tag v1.0.0` (sous audit) | 5 min |

---

## 6. Scripts `package.json`

```json
{
  "name": "@akoris/core",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts",
    "clean": "node -e \"require('node:fs').rmSync('dist',{recursive:true,force:true})\""
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.5.0",
    "tsup": "^8.0.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "eslint": "^8.57.0"
  }
}
```

> **Clean** : compatible Windows/Unix (import explicite `node:fs` via `require`).

---

## 7. `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
  },
});
```

---

## 8. `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## 9. `.gitignore`

```gitignore
dist/
node_modules/
coverage/
*.tsbuildinfo
.DS_Store
Thumbs.db
```

---

## 10. `CHANGELOG.md`

```markdown
# Changelog — @akoris/core

## [0.1.0] — 2026-09-05
### Ajouté
- Structure du package (`package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`)
- Types + contrats Contract-First (EvidenceE1, AuthorizationContext, FullSnapshot, TransitionOutcome, GateDefinition/GateEvaluation)
- Erreurs (NotFound, Transition, Validation, VersionConflict, Persistence)
- Vecteurs de canonicalisation/hash E1 (tests fixes)
- Barrel exports (`index.ts`)

## [0.2.0] — Planifié
- EventBus (isolé, sans node:events)
- RegistryReader (40 agents, validateDependencies)
- Tests (10+)

## [0.3.0] — Planifié (verrouillé par les invariants)
- StateMachineEngine (persister injecté, transition atomique)
- QualityGateEngine (règle v1)
- E1 (SHA-256 chaîné) pour chaque transition
- Tests d'invariants I-1 à I-6

## [0.4.0] — Planifié
- LogReader (append-only, cap)
- SecretManager (AES-256-GCM, enveloppe, encouragement)
- AliasManager (CRUD)
- Tests (30+)

## [0.5.0] — Planifié
- SearchEngine (full-text)
- DoctorEngine (diagnose/planFixes/applyFixes async + audit)
- Tests (40+)

## [0.6.0] — Planifié
- PromptEngine (templates, résolution bornée, escape)
- LLMProvider (Mock + Interface bornée)
- Tests (50+)

## [1.0.0] — Planifié
- createCore() unifiée
- Intégration complète (vertical slice)
- Couverture >90% + invariants
- API publique stabilisée, compat ESM/CJS
```

---

## 11. `README.md`

```markdown
# @akoris/core

AKORIS Core Engine — logique de gouvernance pure, 0 dépendance runtime.

## Principes

- **Pure Logic, Zero I/O** — Aucune I/O directe ; ports injectés contrôlés par la couche runtime
- **No Hidden Global State** — Aucun état global ou singleton implicite
- **Extensible via Composition** — Injection de dépendances
- **Testabilité Totale** — 100% unit testable
- **Invariants de gouvernance** — Atomicité, snapshot = source de vérité, frontière des secrets

## Installation

```bash
pnpm add @akoris/core
```

## Usage

```typescript
import { createCore } from '@akoris/core';
import { FileSystemStore } from '@akoris/io';

const core = createCore({
  store: new FileSystemStore('/mon-projet'),
  masterKey: process.env.AKORIS_MASTER_KEY
});

// Lire les agents
const agents = core.registry.listAgents();

// Exécuter une transition (atomique, persistée par snapshot)
const outcome = await core.stateMachine.transition({
  from: 'PROPOSITION',
  to: 'DRAFT',
  authorizedBy: { actorId: 'EXP-01', actorType: 'artificial', roles: ['VALIDATOR'] },
  comment: 'Démarrage du projet'
});

if (outcome.status === 'committed') { /* transition réussie */ }

// Persister l'état
await core.persist();
```

## Documentation

- [CORE ENGINE SPECIFICATION](../../docs/specifications/CORE-ENGINE-SPECIFICATION.md)
- [IMPLEMENTATION PLAN](../../docs/specifications/CORE-ENGINE-IMPLEMENTATION-PLAN.md)

## Licence

MIT © AKORIS Core Team
```

---

## 12. Prompt système pour le Sprint 1

```text
# Rôle
Tu es un Architecte Logiciel Senior et Expert TypeScript, spécialisé dans les systèmes distribués, la gouvernance logicielle et les principes de "Pure Logic, Zero I/O". Tu travailles sur le projet AKORIS.

# Contexte
Tu dois implémenter le Sprint 1 (v0.1.0 — Seed) du package `@akoris/core`.
Tu dois respecter strictement la "CORE ENGINE SPECIFICATION v0.1" fournie en contexte. Toute déviation par rapport aux types, aux principes ou à la structure de fichiers sera rejetée.

# Tâche du Sprint 1 (v0.1.0 — Seed)
Initialiser la structure du package `packages/core/` et implémenter les fondations statiques, y compris les contrats Contract-First finalisés (relecture intégrée).

## Livrables attendus :
1. `packages/core/package.json` :
   - Nom: `@akoris/core`
   - Version: `0.1.0`
   - Type: "module"
   - DevDependencies uniquement : `typescript`, `tsup`, `vitest`, `@vitest/coverage-v8`, `@types/node`, `eslint`.
   - Scripts : `build`, `test`, `typecheck`, `coverage`, `lint`, `clean` (compatible Windows).
2. `packages/core/tsconfig.json` : `"extends": "../../tsconfig.base.json"`, `"outDir": "./dist"`, `"rootDir": "./src"`.
3. `packages/core/tsup.config.ts` : Configuration pour produire ESM, CJS et les fichiers `.d.ts`.
4. `packages/core/vitest.config.ts` : Configuration Vitest avec coverage (provider v8).
5. `packages/core/.gitignore` : Exclure dist/, node_modules/, coverage/.
6. `packages/core/CHANGELOG.md` : Section v0.1.0.
7. `packages/core/README.md` : Présentation du package.
8. `packages/core/src/types.ts` : Contient TOUTES les interfaces de la Section 4 de la spécification, Y COMPRIS les contrats corrigés : `EvidenceE1`, `AuthorizationContext`, `FullSnapshot`, `TransitionOutcome`, `TransitionContext`, `GateDefinition`, `GateEvaluation`, `EncryptedSecret`, `VersionConflictError`, `PersistenceError`.
9. `packages/core/src/errors.ts` : Classes `NotFoundError`, `TransitionError`, `ValidationError`, `VersionConflictError`, `PersistenceError` étendant `Error`.
10. `packages/core/src/index.ts` : Exporte tous les types et toutes les erreurs.
11. `packages/core/src/utils/crypto.ts` : Canonicalisation E1 (ordre alphabétique des clés, UTF-8 sans BOM, champs inclus/exclus du contrat §4.3).
12. `packages/core/tests/e1-canonic.test.ts` : Vecteurs de test fixes (entrée → JSON canonique → SHA-256 attendu), au moins 2, dont un avec `previousHash`.

# Contraintes Strictes (Non négociables)
- ❌ AUCUNE dépendance runtime (pas de `uuid`, pas de `lodash`, pas de `zod`) — `node:crypto` seul.
- ❌ AUCUNE logique d'I/O directe (pas de `fs`, pas de `fetch`, pas de `process.env` dans le code source).
- ✅ Utiliser uniquement des types TypeScript purs. Pas d'implémentation de classe pour l'instant, sauf les 5 classes d'erreur.
- ✅ Le fichier `types.ts` doit être exhaustif et correspondre exactement à la spécification v0.1.
- ✅ `ProjectStore` doit avoir toutes ses méthodes en `Promise<T>` (snapshot atomique, version optimiste).

# Definition of Done pour ce Sprint
1. La structure de dossiers est créée.
2. `pnpm install` fonctionne.
3. `pnpm typecheck` passe avec 0 erreur.
4. `pnpm build` génère les dossiers `dist/` avec les fichiers `.js` et `.d.ts`.
5. `pnpm test` passe (vecteurs E1 au minimum).

Commence par générer la structure de fichiers, puis le contenu de chaque fichier un par un.
```

---

## 13. Calendrier estimé

| Sprint | Version | Durée | Cumulative |
|---|---|---|---|
| Sprint 1 | v0.1.0 | 2h10 | 2h10 |
| Sprint 2 | v0.2.0 | 3h30 | 5h40 |
| Sprint 3 | v0.3.0 | 8h | 13h40 |
| Sprint 4 | v0.4.0 | 4h30 | 18h10 |
| Sprint 5 | v0.5.0 | 5h15 | 23h25 |
| Sprint 6 | v0.6.0 | 4h45 | 28h10 |
| Sprint 7 | v1.0.0 | 4h | 32h10 |

**Total estimé : ~32 heures (4 jours de travail)**

> **Mise en garde** : cette durée est une **estimation de réalisateur rapide** (squelette → prototype → MVP → release). Elle ne constitue **pas** un engagement de qualité pour une release stable. La qualité est garantie par les **tests d'invariants** et le DoD (§11 spec), pas par le calendrier.

---

## 14. Niveaux de maturité

Chaque sprint produit une étape de maturité distincte — éviter de confondre ces niveaux :

| Niveau | Type | Signification |
|---|---|---|
| **Squelette compilable** | Sprint 1-2 | Types, exports, configuration compilent |
| **Prototype fonctionnel** | Sprint 3-4 | Cas nominaux en mémoire, contrats testés |
| **MVP utilisable** | Sprint 5-6 | Erreurs, persistance, sécurité et tests négatifs |
| **Release stable** | Sprint 7 | Compatibilité, migration, CI, documentation et audit |

---

> **Fin du document — CORE ENGINE IMPLEMENTATION PLAN v0.1 (Proposed / Architecture Draft)**