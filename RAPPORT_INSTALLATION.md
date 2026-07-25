# Rapport d'Installation — AKORIS v1.0.0

**Date :** 25/07/2026  
**Machine :** PC MARKET CI  
**Auteur :** OULAÏ SIÉNI

---

## 1. Environnement

| Technologie | Version |
|-------------|---------|
| Node.js | 24.4.1 |
| pnpm | 9.15.0 |
| TypeScript | 5.5+ |
| OS | Windows |

---

## 2. Structure du projet

```
C:\Users\PC MARKET CI\AKORIS\
│
├── package.json              # Monorepo root (pnpm workspaces)
├── pnpm-workspace.yaml       # Configuration workspaces
├── tsconfig.base.json        # Base TypeScript config
├── MANIFEST.json             # Identité AKORIS
├── .gitignore
├── .prettierrc
├── README.md
│
├── registry/                 # ❖ Cœur du système
│   ├── agents/               #   3 agents (architect, developer, tester)
│   ├── contracts/            #   3 contrats (implementation, adr, code-review)
│   ├── policies/             #   5 policies (zero-hallucination, zero-spaghetti,
│   │                         #     documentation-first, audit-first, architecture-first)
│   ├── workflows/            #   2 workflows (saas, mvp)
│   ├── quality-gates/        #   8 quality gates
│   ├── metrics/              #   7 métriques
│   ├── checklists/           #   2 checklists (sprint-review, deployment)
│   ├── glossary/             #   15 termes définis
│   ├── templates/            #   1 template (ADR)
│   └── schemas/              #   2 schémas (manifest, contract)
│
├── packages/
│   ├── cli/                  # ◆ CLI (8 commandes)
│   ├── sdk/                  # ◆ SDK (RegistryReader, ManifestManager, Validator, AuditEngine)
│   ├── adapters/             # ◆ Adapters (OpenCode, Cursor, Claude Code, Codex)
│   └── connectors/           # ◆ Connectors (GitHub, GitLab, Supabase, Netlify)
│
├── playbooks/                # ● Playbooks (react-vite-supabase, nextjs, laravel)
├── docs/                     # ■ Documentation (architecture, guides, user)
├── scripts/                  # Scripts (bootstrap.ps1)
├── .github/workflows/         # CI/CD (test, lint, release)
├── examples/                 # Exemples de projet
└── tests/                    # Tests
```

---

## 3. Packages installés

### Dépendances racine
- `typescript`
- `prettier`

### @akoris/cli
- `commander` — parsing des commandes
- `chalk` — couleurs console
- `fs-extra` — opérations fichiers avancées
- `inquirer` — prompts interactifs
- `ora` — spinners
- `semver` — validation sémantique

### @akoris/sdk
- `semver` — validation sémantique

### @akoris/adapters, @akoris/connectors
- Dépendent de `@akoris/sdk` (workspace)

---

## 4. Commandes CLI disponibles

| Commande | Description | Statut |
|----------|-------------|--------|
| `akoris init [name]` | Initialise un projet AKORIS | ✅ |
| `akoris install <type> <name>` | Installe un playbook ou expert | ✅ |
| `akoris doctor` | Diagnostic complet du projet | ✅ |
| `akoris audit [scope]` | Lance un audit (sprint) | ✅ |
| `akoris quality <action>` | Vérifie les Quality Gates | ✅ |
| `akoris status` | État global du projet | ✅ |
| `akoris sync` | Synchronise le Registry | ✅ |
| `akoris metrics` | Affiche les métriques | ✅ |

---

## 5. Registry — Contenu

### Policies (5)
1. **Zéro Hallucination** — blocker — aucune décision sans source vérifiable
2. **Zéro Code Spaghetti** — critical — architecture SOLID, pas de cycles
3. **Documentation First** — major — doc avant le code
4. **Audit First** — major — audit indépendant avant validation
5. **Architecture First** — critical — ADR avant implémentation

### Agents (3)
1. **Architecte Logiciel** — conception architecture, ADR, revue technique
2. **Développeur** — génération code, refactoring, tests
3. **Testeur** — tests unitaires, intégration, performance

### Contrats (3)
1. **Contrat d'Implémentation** — pour le développeur
2. **Contrat ADR** — pour l'architecte
3. **Contrat de Revue de Code** — pour le reviewer

### Workflows (2)
1. **SaaS** — 6 phases (vision → capitalisation)
2. **MVP** — 4 phases (concept → iterate)

### Quality Gates (8)
- Lint Pass 🔴, Tests Pass 🔴, Couverture 80% 🟡
- Format ADR 🟡, Aucun Bloquant 🔴, Revue Complète 🔴
- Déploiement Réussi 🔴, Pas de dépendances circulaires 🔴

---

## 6. Build & Tests

```
pnpm install     → ✅ 200+ packages installés
pnpm build       → ✅ 4 packages compilés (cli, sdk, adapters, connectors)
CLI status       → ✅ Projet AKORIS v1.0.0, Registry v1.0.0
CLI doctor       → ✅ Diagnostic OK (MANIFEST, Registry)
CLI quality gates → ✅ 8 quality gates listés
```

---

## 7. Prochaines étapes (Roadmap)

- [ ] **v1.0** — Registry, CLI, Playbook React, Adapter OpenCode ✅ *(fait)*
- [ ] **v1.1** — Adapters Cursor et Claude Code, SDK Node.js ✅ *(implémenté)*
- [ ] **v1.2** — Connecteurs GitHub, Supabase, Netlify ✅ *(implémenté)*
- [ ] **v1.3** — Tests unitaires (vitest)
- [ ] **v2.0** — Marketplace de Playbooks, plugins, Registry versionné

---

## 8. Notes

- Le projet est structuré en **monorepo pnpm** avec 4 workspaces
- Le Registry est la **source de vérité unique** — le CLI ne fait que lire et exécuter
- Les adaptateurs IA sont conçus pour être **interchangeables** via une interface commune
- Les connecteurs externes suivent le **même pattern** que les adaptateurs
- La **documentation technique** est dans `docs/`, la **gouvernance** dans `registry/`

---

*Rapport généré automatiquement — AKORIS v1.0.0*
