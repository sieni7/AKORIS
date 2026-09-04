# Guide de démarrage AKORIS

> **Version** : 1.0.1
> **Statut** : Guide officiel
> **Date** : 2026-09-04
> **Temps estimé** : < 1h pour un projet fonctionnel

---

## Introduction

Ce guide vous accompagne de zéro à un projet AKORIS fonctionnel. Il décrit les **12 étapes** du démarrage, de l'installation à la capitalisation.

---

## Les 12 étapes

### Étape 1 — Installation

```bash
npm install -g akoris
```

Vérifiez l'installation :

```bash
akoris --version
```

---

### Étape 2 — Initialisation de l'instance

```bash
akoris init mon-projet
cd mon-projet
```

Cette commande crée la structure minimale :

```
mon-projet/
├── .akoris/
│   ├── manifest.json      (identité du projet)
│   ├── state.json         (état initial : PROPOSITION)
│   ├── registry/          (contrats, règles, décisions)
│   └── policies/          (règles applicables)
└── .gitignore             (exclusion des secrets)
```

---

### Étape 3 — Lire la Constitution

Le manifeste AKORIS se trouve dans `constitution/00_AKORIS.md`. Il définit la mission, les 4 piliers et les principes fondamentaux.

> **Règle** : La gouvernance est le premier artefact à définir dans tout projet AKORIS.

---

### Étape 4 — Choisir un profil

AKORIS définit 3 profils de gouvernance, proportionnés au niveau de risque :

| Profil | Preuves | Quality Gates | Pour qui |
|---|---|---|---|
| **Lite** | E1 | Essentiels | Prototypes, projets solo |
| **Standard** | E1 + E2 | Cycle complet (8) | Projets professionnels |
| **Critical** | E1 + E2 + E3 | Cycle complet + renforcés | Projets sensibles |

```bash
akoris init mon-projet --profile lite
```

Le profil est documenté dans le `manifest.json`.

---

### Étape 5 — Choisir son playbook

Sélectionnez le playbook correspondant à votre type de projet :
- App web
- API backend
- Mobile
- CLI / outil

---

### Étape 6 — Activer les agents

Chaque projet active les agents nécessaires à son contexte, parmi les **40 agents de référence**.

```bash
akoris agent activate CORE-01
akoris agent activate DEV-01
akoris agent activate QA-01
```

---

### Étape 7 — Créer une proposition (PROPOSITION)

Chaque travail commence par une proposition formelle :

```bash
akoris state set PROPOSITION --context "Besoin : API de gestion de tâches"
```

Contenu requis : **contexte**, **justification**, **ébauche de solution**.

---

### Étape 8 — Passer les Quality Gates

Chaque transition d'état est protégée par un Quality Gate :

| Transition | Gate |
|---|---|
| PROPOSITION → DRAFT | QG-PROPOSITION |
| DRAFT → PLANNED | QG-DRAFT |
| PLANNED → ACTIVE | QG-PLANNED |
| ACTIVE → AUDIT | QG-ACTIVE |
| AUDIT → VALIDATED | QG-AUDIT |
| VALIDATED → RELEASED | QG-VALIDATED + **Decision Gate humain** |

---

### Étape 9 — Développer (ACTIVE)

Pendant l'implémentation :
- Tracez vos modifications.
- Documentez en continu.
- Produisez les rapports d'avancement.

> **Règle** : Une tâche avec des prompts explicites bénéficie du cadre AKORIS.

---

### Étape 10 — Auditer (AUDIT)

L'audit vérifie : sécurité, performances, documentation, conformité.

L'auditeur est **indépendant** du porteur et du validateur.

---

### Étape 11 — Decision Gate (verification humaine)

Contrairement aux Quality Gates (automatisables), la **decision de release est toujours humaine** :

```
Quality Gate (PASS/FAIL)
    ↓
Human Decision Gate (GO / NO-GO / CONDITIONAL GO)
    ↓
Transition autorisée
```

---

### Étape 12 — Release et capitalisation

Après la mise en production :
- Mettez à jour le CHANGELOG.
- Documentez le plan de rollback.
- Réalisez le post-mortem.
- Archivez l'artefact (ARCHIVED) pour capitaliser la connaissance.

---

## Exemple de projet minimal

### "API de gestion de tâches" en 5 jours

| Jour | Étape | Action |
|---|---|---|
| **J1** | 1-6 | Installation, init, profil Lite, agents, proposition |
| **J2** | 7-8 | Draft, spécifications, QG-PROPOSITION |
| **J3** | 9 | Implémentation (ACTIVE) |
| **J4** | 10-11 | Audit + Decision Gate |
| **J5** | 12 | Release + capitalisation |

---

## Commandes utiles

| Commande | Description |
|---|---|
| `akoris status` | État courant de l'instance |
| `akoris state show` | État d'un artefact |
| `akoris search <terme>` | Recherche dans le Registry |
| `akoris agent list` | Liste des agents activés |
| `akoris alias --set <nom> <cmd>` | Créer un alias |

---

*Guide de démarrage AKORIS v1.0.1*
