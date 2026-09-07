# Guide de démarrage AKORIS

> **⚠️ Statut du document**
>
> Ce guide décrit la **méthode AKORIS** (Adaptive Knowledge & Orchestrated Review for Intelligent Software) — son architecture, ses principes et son cycle de gouvernance.
>
> **État actuel de l'implémentation :**
> - La méthode est spécifiée et documentée.
> - Le CLI `akoris` est en cours de développement (Sprint 1 — Core Engine v0.1.0 Seed).
> - Les commandes présentées dans ce guide sont **illustratives** — elles décrivent le comportement final prévu, mais ne sont pas encore implémentées.
> - La version publiée sur npm (`akoris@0.0.1`) est un placeholder (logo ASCII + menu interactif).
>
> Pour l'état réel, consultez le [README](../../README.md) et le [CHANGELOG](../../CHANGELOG.md).

---

## Introduction

Ce guide vous accompagne dans la découverte d'AKORIS. Il décrit les **12 étapes** du démarrage, de l'installation à la capitalisation.

> **Temps estimé** : moins d'une heure pour initialiser et comprendre une instance AKORIS. La durée du développement dépend ensuite de votre projet.

---

## Étape 1 — Structure du dépôt AKORIS

Avant de commencer, distinguez trois espaces :

| Espace | Rôle | Exemple |
|---|---|---|
| **Dépôt méthode** | Contient la spécification (constitution, gouvernance, terminologie, registry). | `sieni7/AKORIS` (ce dépôt) |
| **Instance projet** | Contient la configuration et les artefacts propres à votre projet. | `mon-projet/.akoris/` |
| **Documentation projet** | Explique l'application concrète dans votre projet. | `mon-projet/docs/` |

> **Règle** : la Constitution appartient au dépôt méthode. Une fois votre instance créée, la gouvernance appliquée à votre projet vit dans `.akoris/`.

---

## Étape 2 — Installation

```bash
npm install -g akoris
```

> **Statut : planifié.** Le CLI est en cours de développement (Sprint 1). Cette commande sera fonctionnelle une fois la v0.1.0 du CLI publiée.

---

## Étape 3 — Initialisation de l'instance (avec choix du profil)

```bash
akoris init mon-projet --profile lite
cd mon-projet
```

> **Statut : planifié.**

Cette commande créera la structure minimale :

```
mon-projet/
├── .akoris/
│   ├── manifest.json # identité du projet, profil choisi
│   ├── state.json # état initial : PROPOSITION
│   ├── registry/ # contrats, règles, décisions
│   └── policies/ # règles applicables
└── .gitignore # exclusion des secrets
```

AKORIS définit 3 profils de gouvernance, proportionnés au niveau de risque :

| Profil | Preuves | Quality Gates | Pour qui |
|---|---|---|---|
| **Lite** | E1 | Essentiels | Prototypes, projets solo |
| **Standard** | E1 + E2 | Cycle complet (8) | Projets professionnels |
| **Critical** | E1 + E2 + E3 | Cycle complet + renforcés | Projets sensibles |

---

## Étape 4 — Le Registry d'agents (40 agents, 5 domaines)

AKORIS définit **40 agents de référence**, répartis en 5 domaines :

| Domaine | Nombre | Rôle général |
|---|---|---|
| **CORE** | 8 | Gouvernance et coordination du cycle de vie |
| **DEV** | 10 | Implémentation |
| **QA** | 8 | Qualité, tests, vérification |
| **EXP** | 10 | Expertise spécialisée |
| **GOV** | 4 | Gouvernance normative (constitution, politiques) |

Chaque agent est défini dans `registry/agents/{DOMAINE}-{NN}/` avec un contrat (`agent.json`, `contract.json`, `mission.md`, `prompt.md`).

```bash
akoris agent list
akoris agent activate CORE-01
akoris agent activate DEV-01
akoris agent activate QA-01
```

> **Statut : planifié.**

---

## Étape 5 — Créer une proposition (PROPOSITION)

Chaque travail commence par une proposition formelle, contenant **contexte**, **justification** et **ébauche de solution** :

```bash
akoris proposal create --title "API de gestion de tâches" \
  --context "..." --justification "..." --solution "..."
```

> **Statut : planifié.** Notez que l'instance démarre déjà dans l'état `PROPOSITION` (créée à l'étape 3) — cette commande crée l'artefact de proposition, pas une transition d'état.

---

## Étape 6 — Passer les Quality Gates

Chaque transition d'état est protégée par un Quality Gate :

| Transition | Gate |
|---|---|
| PROPOSITION → DRAFT | QG-PROPOSITION |
| DRAFT → PLANNED | QG-DRAFT |
| PLANNED → ACTIVE | QG-PLANNED |
| ACTIVE → AUDIT | QG-ACTIVE |
| AUDIT → VALIDATED | QG-AUDIT |
| VALIDATED → RELEASED | QG-VALIDATED + **Decision Gate humain** |

```bash
akoris gate run QG-PROPOSITION
akoris gate show QG-PROPOSITION
akoris state transition DRAFT
```

> **Statut : planifié.**

Trois états exceptionnels existent en dehors de ce parcours nominal : `BLOCKED`, `REJECTED`, `SUPERSEDED` — voir [state-machine.json](../../registry/state-machine.json).

---

## Étape 7 — Développer (ACTIVE)

Pendant l'implémentation : tracez vos modifications, documentez en continu, produisez les rapports d'avancement.

---

## Étape 8 — Auditer (AUDIT)

L'audit vérifie sécurité, performances, documentation et conformité. L'auditeur est **indépendant** du porteur et du validateur.

---

## Étape 9 — Decision Gate (vérification humaine)

Contrairement aux Quality Gates (automatisables), la **décision de release est toujours humaine** :

```
Quality Gate (PASS/FAIL)
↓
Decision Gate humain (GO / NO-GO / CONDITIONAL GO)
↓
Transition autorisée
```

---

## Étape 10 — Release et capitalisation

Après la mise en production :
- Mettez à jour le CHANGELOG.
- Documentez le plan de rollback.
- Réalisez le post-mortem.
- Archivez l'artefact (`ARCHIVED`) pour capitaliser la connaissance.

---

## Exemple illustratif — "API de gestion de tâches" en 5 jours

> *Scénario type, non issu d'un projet réel documenté — à des fins pédagogiques.*

| Jour | Étapes | Action |
|---|---|---|
| **J1** | 1-4 | Installation, init, profil Lite, agents |
| **J2** | 5-6 | Proposition, Draft, QG-PROPOSITION |
| **J3** | 7 | Implémentation (ACTIVE) |
| **J4** | 8-9 | Audit + Decision Gate |
| **J5** | 10 | Release + capitalisation |

---

## Commandes utiles (planifiées)

| Commande | Description |
|---|---|
| `akoris status` | État courant de l'instance |
| `akoris state show` | État d'un artefact |
| `akoris search <terme>` | Recherche dans le Registry |
| `akoris agent list` | Liste des 40 agents disponibles |
| `akoris alias --set <nom> <cmd>` | Créer un alias |

---

## Prochaines étapes

- Consultez la [Roadmap](../ROADMAP.md) pour l'état d'avancement réel.
- Explorez le [Registry des agents](../../registry/agents/) (40 agents, 5 domaines).
- Lisez la [FAQ](../FAQ.md) et le [Glossaire](../../constitution/03_TERMINOLOGY.md).
- Suivez l'avancement du Core Engine : le Sprint 1 (v0.1.0 Seed) est en cours.

---

*Guide de démarrage AKORIS v1.0.2*