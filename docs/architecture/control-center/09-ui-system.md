---
title: "AKORIS Control Center — UI System"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "02-technical-architecture.md"
  - "05-api-contract.md"
  - "10-state-management.md"
  - "11-sdk.md"
---
# 09 — UI System

## 1. Objectif

Ce document définit le **système de composants UI** du Dashboard AKORIS Control Center. Basé sur **shadcn/ui** + **Tailwind CSS**, il garantit une expérience utilisateur cohérente, accessible et maintenable.

---

## 2. Stack UI

| Technologie | Usage |
|-------------|-------|
| **shadcn/ui** | Composants de base (Button, Card, Dialog, Table, etc.) |
| **Tailwind CSS 4** | Styles utilitaires, thème, responsive |
| **Recharts** | Graphiques (health score, tendances) |
| **Monaco Editor** | Éditeur de code (Prompt Builder) |
| **Lucide React** | Icônes |
| **TanStack Router** | Routing type-safe |
| **React Hook Form + Zod** | Formulaires validés |

---

## 3. Architecture des composants

```
apps/dashboard/src/
├── components/
│   ├── ui/                    # Composants shadcn (générés)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── shared/                # Composants métier réutilisables
│   │   ├── CommandPalette.tsx
│   │   ├── Notifications.tsx
│   │   ├── Timeline.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── features/              # Composants spécifiques à une page
│       ├── executive/
│       │   ├── HealthScoreCard.tsx
│       │   ├── StateMachineView.tsx
│       │   └── TrendChart.tsx
│       ├── registry/
│       │   ├── AgentCard.tsx
│       │   ├── RuleList.tsx
│       │   └── QualityGateBadge.tsx
│       ├── ai-studio/
│       │   ├── PromptBuilder.tsx
│       │   ├── ContextSelector.tsx
│       │   └── LLMResponseViewer.tsx
│       └── devops/
│           ├── ServiceStatus.tsx
│           └── DeployButton.tsx
├── routes/                    # Pages (TanStack Router)
│   ├── __root.tsx
│   ├── index.tsx              # Executive Dashboard (health, state)
│   ├── project.tsx            # Project Dashboard (timeline, ADRs)
│   ├── registry.tsx           # Registry Explorer
│   ├── ai-studio.tsx          # AI Studio (prompts)
│   └── devops.tsx             # DevOps (services, deploys)
└── styles/
    └── globals.css            # Tailwind directives + custom styles
```

---

## 4. Thème

### 4.1. Palette de couleurs

| Token | Valeur (light) | Valeur (dark) | Usage |
|-------|----------------|----------------|-------|
| `--background` | `#ffffff` | `#09090b` | Fond de page |
| `--foreground` | `#09090b` | `#fafafa` | Texte principal |
| `--primary` | `#18181b` | `#fafafa` | Boutons primaires |
| `--secondary` | `#f4f4f5` | `#27272a` | Éléments secondaires |
| `--muted` | `#f4f4f5` | `#27272a` | Texte secondaire |
| `--accent` | `#f4f4f5` | `#27272a` | Éléments accentués |
| `--destructive` | `#ef4444` | `#ef4444` | Actions destructives |
| `--border` | `#e4e4e7` | `#27272a` | Bordures |
| `--ring` | `#18181b` | `#fafafa` | Focus ring |

### 4.2. Typographie

| Élément | Classe Tailwind | Taille |
|---------|----------------|--------|
| Page title | `text-3xl font-bold` | 30px |
| Section title | `text-2xl font-semibold` | 24px |
| Card title | `text-lg font-medium` | 18px |
| Body | `text-sm` | 14px |
| Small | `text-xs` | 12px |
| Monospace | `font-mono text-sm` | Code, logs |

### 4.3. Espacement

| Token | Valeur |
|-------|--------|
| Page padding | `p-8` (32px) |
| Card padding | `p-6` (24px) |
| Section gap | `gap-6` (24px) |
| Card gap | `gap-4` (16px) |
| Element gap | `gap-2` (8px) |

---

## 5. Layout

```
┌──────────────────────────────────────────────┐
│ Header (app name, search, notifications)      │
├──────────┬───────────────────────────────────┤
│          │                                    │
│ Sidebar  │  Main Content                      │
│          │  ┌─────────────────────────────┐  │
│ - Exec   │  │ Executive Dashboard         │  │
│ - Proj   │  │ Health Score: 82            │  │
│ - Reg    │  │ State: DRAFT                │  │
│ - AI     │  │ Timeline                    │  │
│ - DevOps │  └─────────────────────────────┘  │
│          │                                    │
├──────────┴───────────────────────────────────┤
│ Footer (version, status)                     │
└──────────────────────────────────────────────┘
```

- **Sidebar** : largeur fixe 240px, liens de navigation, indicateurs de statut.
- **Header** : hauteur fixe 56px, barre de recherche globale (CommandPalette), notifications.
- **Main Content** : zone de contenu scrollable, padding 32px.

---

## 6. Composants clés

### 6.1. CommandPalette

- **Déclencheur** : `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux).
- **Comportement** : Overlay modal avec champ de recherche.
- **Sources** : Agents, règles, ADR, pages du Dashboard.
- **Implémentation** : `cmdk` (shadcn/ui).

### 6.2. Notifications

- **Position** : Coin supérieur droit (toast).
- **Types** : success (vert), error (rouge), warning (jaune), info (bleu).
- **Durée** : 5 secondes (configurable).
- **Stack** : TanStack Query + WebSocket.

### 6.3. Timeline

- **Affichage** : Frise chronologique verticale.
- **Événements** : Transitions, déploiements, gates, ADR.
- **Filtres** : Par type, par date, par agent.

### 6.4. StateMachineView

- **Affichage** : Graphe orienté (nœuds = états, flèches = transitions).
- **État courant** : Mis en évidence (couleur primaire).
- **Transitions disponibles** : En surbrillance.

---

## 7. Responsive

En v1.0, le Dashboard est conçu pour **desktop uniquement** (viewport >= 1024px). Un mode responsive pour tablette/mobile pourra être ajouté en v2.0.

| Breakpoint | Comportement |
|------------|-------------|
| >= 1280px | Layout complet (sidebar + header + content) |
| 1024–1279px | Sidebar rétractable (icônes seulement) |
| < 1024px | Non supporté (message "Desktop required") |

---

## 8. Accessibilité

- Tous les composants shadcn/ui sont **accessibles par défaut** (ARIA labels, rôles, focus management).
- **Navigation clavier** : Tab, Enter, Escape, Cmd+K.
- **Contrastes** : Conformes WCAG 2.1 AA.
- **Focus visible** : `focus-visible:ring-2` sur tous les éléments interactifs.

---

## 9. Prochaine étape

Avec ce système UI défini, le document `10-state-management.md` peut spécifier la gestion d'état du Dashboard (TanStack Query + Zustand).
