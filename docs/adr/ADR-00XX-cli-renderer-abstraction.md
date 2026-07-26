# ADR-00XX — Abstraction du rendu CLI (IRenderer)

**Statut** : Approuvé
**Date** : 2026-07-26
**Décideurs** : AKORIS Core Team
**Déclencheur** : Refonte CLI post-Milestone 2
**Source** : `docs/roadmap/cli-refactor.md` (v2.0)

---

## Contexte

Le CLI AKORIS a grandi de manière organique. Chaque commande écrit sa sortie directement via `console.log`, `console.table` ou `process.stdout.write`. Cette approche pose plusieurs problèmes :

1. **Incohérence visuelle** : chaque commande formate sa sortie indépendamment (couleurs, alignement, symboles).
2. **Couplage logique / présentation** : une commande qui veut changer son affichage doit modifier son code métier.
3. **Pas de mode JSON stable** : le format `--json` est implémenté manuellement par chaque commande, avec des risques de divergence.
4. **Pas de mode documentation** : impossible de générer un rapport Markdown sans réécrire la commande.
5. **Comportement CI non unifié** : chaque commande gère (ou ne gère pas) la détection `NO_COLOR` / non-TTY.
6. **Difficulté d'extension** : ajouter un nouveau format de sortie (HTML, PDF, TUI) nécessite de modifier toutes les commandes.

Le Control Center (Milestone 2) a prouvé les concepts partagés (Health, Registry, State, Logs, Doctor). Le CLI doit désormais les exposer dans le terminal avec la même cohérence que le Dashboard. Une couche de présentation commune est nécessaire.

---

## Décision

Introduire une interface `IRenderer` qui sert de **contrat unique** entre les commandes et la sortie.

```typescript
interface IRenderer {
  info(message: string): void;
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
  table<T>(rows: T[], options?): void;
  tree(root: TreeNode): void;
  card(card: Card): void;
  timeline(events: TimelineEvent[]): void;
  progress(current: number, total: number, label?: string): void;
  write(data: unknown): void;
}
```

### Principes

1. **Les commandes ne connaissent que l'interface** — pas le format concret.
2. **Le renderer est injecté** (constructeur ou paramètre) — pas de singleton global.
3. **La détection TTY/NO_COLOR/**`--json` est exclusivement dans le renderer.
4. **Aucun `console.log`** n'est autorisé dans les commandes après migration.

### Trois implémentations initiales

| Implémentation | Mode | Déclencheur |
|---------------|------|-------------|
| `TerminalRenderer` | Humain (couleurs, spinners, tableaux) | `stdout.isTTY && !NO_COLOR` |
| `JSONRenderer` | Automation (JSON structuré) | Flag `--json` ou non-TTY |
| `MarkdownRenderer` | Documentation (fichier .md) | Flag `--output report.md` |

---

## Conséquences

### Positives

- **Séparation des responsabilités** : les commandes produisent des données structurées, le renderer s'occupe de la présentation.
- **Extensibilité** : un nouveau format (HTML, PDF, TUI) s'ajoute par une nouvelle classe, sans toucher aux commandes.
- **Testabilité** : les commandes sont testables avec un `MockRenderer` qui capture les appels en mémoire.
- **CI native** : le mode JSON est actif automatiquement dans les environnements non-TTY.
- **Cohérence UX** : toutes les commandes utilisent les mêmes composants (table, card, tree, timeline).

### Négatives

- **Coût de migration** : chaque commande existante doit être refactorée pour utiliser l'interface.
- **Surcharge d'indirection** : une couche supplémentaire entre la logique et la sortie.
- **Standardisation contraignante** : une commande qui a besoin d'un affichage très spécifique peut être limitée par l'interface.

### Risques

- **Sur-ingénierie** : risque de vouloir généraliser trop tôt des composants qui n'ont qu'un seul usage.
  - *Atténuation* : les composants `ui/` sont créés au fil des besoins réels des commandes, pas par anticipation.

- **Performance** : l'indirection peut ajouter un overhead sur le temps de rendu.
  - *Atténuation* : les budgets perf sont vérifiés en CI (cold start < 500ms, warm < 300ms, json < 200ms).

---

## Alternatives étudiées

### Alternative 1 : Statu quo (pas d'abstraction)

Chaque commande continue d'écrire sa sortie directement.

- **Avantage** : rien à changer, zéro risque.
- **Inconvénient** : les 6 problèmes du contexte persistent.

### Alternative 2 : Helpers dispersés

On crée des fonctions utilitaires (`printTable`, `printCard`) mais sans interface commune.

- **Avantage** : moins d'indirection qu'un renderer complet.
- **Inconvénient** : chaque commande doit choisir manuellement le format (terminal/JSON). Pas de dispatch automatique. Impossible d'ajouter un mode sans modifier chaque commande.

### Alternative 3 : Template engine (Handlebars, EJS)

Les commandes produisent des données et les passent à des templates.

- **Avantage** : séparation logique/présentation totale.
- **Inconvénient** : surcharge excessive pour un CLI. Les templates sont plus adaptés à des pages HTML qu'à du texte terminal. Complexité de gestion des templates embarqués.

### Alternative 4 : Architecture orientée composants (React Ink)

Utiliser un framework TUI comme Ink pour des composables React-like.

- **Avantage** : composants réutilisables, état géré.
- **Inconvénient** : dépendance lourde, bundle size important, courbe d'apprentissage. Inadapté pour un CLI orienté automation (`--json`).

### Verdict

L'interface `IRenderer` avec 3 implémentations est le meilleur compromis entre **séparation des responsabilités**, **simplicité** et **extensibilité**.

---

## Implémentation

1. Créer le fichier `packages/cli/src/output/renderer.ts` avec l'interface et le dispatch.
2. Créer les 3 implémentations (terminal, json, markdown).
3. Créer les composants `ui/` (table, tree, card, timeline, spinner, progress).
4. Migrer les commandes une par une (Phase 3 de la roadmap).
5. Supprimer les `console.log` résiduels dans les commandes migrées.

Détails dans `docs/architecture/cli-renderer-contract.md`.

---

## Références

- `docs/roadmap/cli-refactor.md` — plan d'exécution
- `docs/architecture/cli-renderer-contract.md` — contrat détaillé
- Lien : https://github.com/sieni7/AKORIS/issues/XX
