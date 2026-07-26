# CLI Renderer Contract

**version** : 1.0
**status** : Approuvé
**date** : 2026-07-26
**owner** : AKORIS Core Team
**source** : docs/roadmap/cli-refactor.md (v2.0, §3)

---

## 1. Objectif

Définir le contrat d'interface `IRenderer` que toutes les commandes CLI utilisent pour produire leur sortie. Ce contrat garantit :

- Une séparation stricte entre logique métier et présentation
- Une UX homogène sur toutes les commandes
- La possibilité d'ajouter de nouveaux formats de sortie sans modifier les commandes
- Un comportement prévisible en environnement CI (non-TTY, `NO_COLOR`, `--json`)

---

## 2. Interface

```typescript
// output/renderer.ts

/**
 * Contrat de rendu pour toutes les commandes CLI.
 *
 * Chaque méthode produit une sortie dans le format actif (terminal, JSON,
 * markdown) sans que la commande appelante ait besoin de connaître le mode.
 */
interface IRenderer {
  // ── Messages textuels ──────────────────────────────────────────

  /** Message d'information standard */
  info(message: string): void;

  /** Message de succès (opération terminée) */
  success(message: string): void;

  /** Message d'avertissement (non-bloquant) */
  warning(message: string): void;

  /** Message d'erreur (bloquant) */
  error(message: string): void;

  // ── Composants structurés ──────────────────────────────────────

  /**
   * Tableau de données avec colonnes alignées.
   * Les en-têtes sont déduits des clés du premier objet si non spécifiés.
   */
  table<T extends Record<string, unknown>>(
    rows: T[],
    options?: { headers?: string[]; caption?: string },
  ): void;

  /**
   * Affichage hiérarchique (domaines → agents, arborescences).
   */
  tree(root: TreeNode): void;

  /**
   * Fiche synthétique d'une entité (agent, issue, template).
   */
  card(card: Card): void;

  /**
   * Chronologie d'événements (historique transitions, logs).
   */
  timeline(events: TimelineEvent[]): void;

  /**
   * Barre de progression pour une opération longue.
   * En mode non-TTY, affiche un texte statique "[3/5] Label".
   */
  progress(current: number, total: number, label?: string): void;

  // ── Primitives génériques ──────────────────────────────────────

  /**
   * Écrit une valeur JSON-serializable directement dans la sortie.
   * Utile pour les cas où le modèle de donnée ne correspond à aucun
   * composant structuré existant.
   */
  write(data: unknown): void;
}

// ── Types support ─────────────────────────────────────────────────

interface TreeNode {
  label: string;
  icon?: string;
  children?: TreeNode[];
  meta?: Record<string, string>;
}

interface Card {
  title: string;
  subtitle?: string;
  fields: CardField[];
  footer?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'muted';
}

interface CardField {
  label: string;
  value: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'muted';
}

interface TimelineEvent {
  timestamp: string;
  label: string;
  icon?: string;
  color?: 'success' | 'warning' | 'error' | 'muted';
}
```

---

## 3. Modes de rendu

### 3.1 TerminalRenderer

| Méthode | Rendu |
|---------|-------|
| `info()` | `chalk` couleur primaire, préfixe `ℹ ` |
| `success()` | `chalk` vert, préfixe `✓ ` |
| `warning()` | `chalk` jaune, préfixe `⚠ ` |
| `error()` | `chalk` rouge, préfixe `✗ ` |
| `table()` | `cli-table3` avec en-tête stylisé, couleurs alternées |
| `tree()` | Caractères `├── └── │` avec `chalk` |
| `card()` | Encadré + champs alignés (`label: valeur`) |
| `timeline()` | Lignes avec `│` et `●` aux dates |
| `progress()` | Barre `██████░░░░ 60%` (ora spinner en async) |
| `write()` | `util.inspect(data, { colors: true, depth: 3 })` |

### 3.2 JSONRenderer

| Méthode | Rendu |
|---------|-------|
| `info()` | `{ "type": "info", "message": "..." }` vers stderr |
| `success()` | `{ "type": "success", "message": "..." }` vers stderr |
| `warning()` | `{ "type": "warning", "message": "..." }` vers stderr |
| `error()` | `{ "type": "error", "message": "..." }` vers stderr |
| `table()` | `JSON.stringify(rows)` vers stdout |
| `tree()` | `JSON.stringify(root)` vers stdout |
| `card()` | `JSON.stringify(card)` vers stdout |
| `timeline()` | `JSON.stringify(events)` vers stdout |
| `progress()` | Silencieux (pas de sortie) |
| `write()` | `JSON.stringify(data)` vers stdout |

### 3.3 MarkdownRenderer

| Méthode | Rendu |
|---------|-------|
| `info()` | `> ℹ message` |
| `success()` | `> ✓ message` |
| `warning()` | `> ⚠ message` |
| `error()` | `> ✗ **error**` |
| `table()` | Tableau Markdown (`\| header \| header \|`) |
| `tree()` | Liste Markdown imbriquée |
| `card()` | `### title` + champs en liste |
| `timeline()` | Liste chronologique |
| `progress()` | Silencieux |
| `write()` | ````json ... ```` |

---

## 4. Détection du mode

```typescript
function createRenderer(options?: {
  format?: 'terminal' | 'json' | 'markdown';
  outputPath?: string;
}): IRenderer {
  // 1. --output report.md → MarkdownRenderer
  if (options?.outputPath) return new MarkdownRenderer(options.outputPath);

  // 2. --json flag → JSONRenderer
  if (options?.format === 'json') return new JSONRenderer();

  // 3. stdout non-TTY ou NO_COLOR → JSONRenderer (automation)
  if (!process.stdout.isTTY || process.env.NO_COLOR) return new JSONRenderer();

  // 4. Défaut → TerminalRenderer
  return new TerminalRenderer();
}
```

---

## 5. Règles d'utilisation

1. **Aucune commande** n'appelle `console.log`, `process.stdout.write` ou `util.inspect` directement.
2. Toute commande reçoit un `IRenderer` par injection (constructeur ou paramètre).
3. Si plusieurs sorties sont nécessaires (ex: progression + résultat final), la commande utilise `progress()` puis `table()` sur le même renderer.
4. En mode JSON, les messages textuels (`info`, `success`, `warning`, `error`) vont sur **stderr** pour ne pas polluer le flux JSON parsing.
5. En mode terminal, les messages textuels vont sur **stdout** pour rester visibles.
6. Les commandes ne font **aucune détection TTY** — cette responsabilité est exclusivement dans le renderer.

---

## 6. Extension

Pour ajouter un nouveau format de sortie :

```typescript
class HTMLRenderer implements IRenderer {
  // implémente les 10 méthodes
}
```

Aucune commande n'est modifiée. Seul le `createRenderer()` est enrichi.

---

## 7. Migration

Les commandes existantes qui utilisent `console.log` sont migrées une par une (Phase 3 de la roadmap). Pendant la transition, les anciennes et nouvelles commandes coexistent : les nouvelles reçoivent un `IRenderer`, les anciennes continuent avec leurs `console.log`. Aucun wrapper de compatibilité n'est nécessaire puisque les noms publics des commandes ne changent pas.

---

**Document lié** : `docs/roadmap/cli-refactor.md` — plan d'exécution de la refonte.
**Décision architecturale** : `docs/adr/ADR-00XX-cli-renderer-abstraction.md`
