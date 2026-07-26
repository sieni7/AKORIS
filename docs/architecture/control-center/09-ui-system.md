---
title: "AKORIS Control Center — UI System"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "02-technical-architecture.md"
  - "10-state-management.md"
---
# 09 — UI System

## 1. Objectif

Ce document définit le système d'interface utilisateur (UI) pour le Dashboard AKORIS Control Center : design tokens, composants, règles d'accessibilité et de cohérence visuelle.

---

## 2. Principes UX (rappel)

1. Action fréquente ≤ 2 clics.
2. Aucun écran surchargé.
3. Command Palette accessible partout (Ctrl+K).
4. Recherche omniprésente.
5. Retour utilisateur immédiat.
6. Cohérence visuelle.

---

## 3. Design Tokens (shadcn/ui + Tailwind)

### 3.1. Couleurs

| Rôle | Valeur (Tailwind) |
|------|-------------------|
| Primary | `blue-600` |
| Secondary | `slate-100` |
| Success | `green-500` |
| Warning | `yellow-500` |
| Error | `red-500` |
| Info | `blue-400` |
| Background | `slate-50` |
| Foreground | `slate-900` |

### 3.2. Typographie

| Élément | Taille | Poids |
|---------|--------|-------|
| Titre principal | 2rem | 700 |
| Titre secondaire | 1.25rem | 600 |
| Corps de texte | 0.875rem | 400 |
| Légende | 0.75rem | 400 |

**Police** : Inter (importée automatiquement par shadcn/ui).

### 3.3. Espacements

| Niveau | Valeur |
|--------|--------|
| 1 | 4px (0.25rem) |
| 2 | 8px (0.5rem) |
| 3 | 12px (0.75rem) |
| 4 | 16px (1rem) |
| 5 | 24px (1.5rem) |
| 6 | 32px (2rem) |

### 3.4. Radius

| Élément | Valeur |
|---------|--------|
| Bouton | 8px |
| Carte | 12px |
| Modale | 16px |
| Input | 6px |

---

## 4. Composants (shadcn/ui personnalisés)

### 4.1. Layout

- `AppLayout` : Sidebar + Header + Content.
- `Sidebar` : Navigation entre les 5 modules.
- `Header` : Titre + Command Palette + Notifications + Profil.

### 4.2. Widgets

- `Card` : utilisé pour tous les KPIs.
- `Badge` : pour les statuts (PASS, FAIL, etc.).
- `StatCard` : pour un KPI (titre, valeur, tendance).
- `Table` : pour les listes (agents, logs, etc.).
- `Timeline` : frise chronologique.

### 4.3. Feedback

- `Toast` : notifications (success/error/warning/info).
- `Spinner` : indicateur de chargement.
- `Modal` : pour les confirmations (transition, déploiement).

### 4.4. Inputs

- `SearchBar` : barre de recherche.
- `CommandPalette` : modale avec autocomplétion.
- `FilterBar` : filtres (agent, date, domaine).
- `Editor` : Monaco Editor pour l'AI Studio.

---

## 5. Règles d'accessibilité (WCAG 2.1 AA)

- **Contraste** : 4.5:1 minimum pour le texte.
- **Taille** : texte ≥ 14px (0.875rem).
- **Navigation** : toutes les actions sont accessibles au clavier (Tab, Enter, Escape).
- **Labels** : tous les champs ont des labels explicites.
- **ARIA** : utilisé pour les composants complexes (Command Palette, Modal, Timeline).
- **Testing** : tests d'accessibilité automatisés avec `axe-core` dans la CI.

---

## 6. Structure des pages

### 6.1. Executive

- En-tête : Titre + indicateur de santé global.
- 5 cartes KPIs (Health, Velocity, Technical Debt, Quality Coverage, Release Readiness).
- Graphique de tendance (Recharts).

### 6.2. Project

- Machine à états (visualisation).
- Gantt des jalons.
- Sprint Board (Kanban).
- ADR Explorer.

### 6.3. AI Studio

- Agent Selector (dropdown).
- Context Builder (checkboxes).
- Prompt Builder (Monaco Editor).
- LLM Playground (côte à côte prompt/réponse).
- Prompt Library (grid).

### 6.4. DevOps

- Secret Vault (tableau avec masquage).
- Connected Services (status cards).
- Deploy Center (boutons + logs).
- GitHub Actions Viewer (tableau des workflows).

### 6.5. Registry Explorer

- Arborescence (gauche) → Contrat (centre) → Relations (droite).
- Recherche rapide.

---

## 7. Animation et transitions

- **Transition des pages** : fade-in (durée 300ms).
- **Ouverture de modale** : scale + fade (200ms).
- **Mise à jour des données** : skeleton loading puis apparition douce.
- **Notifications** : slide-in depuis la droite.

---

## 8. Prochaine étape

Après l'UI, le document `10-state-management.md` définit comment l'état du Dashboard est géré (TanStack Query, Zustand).
