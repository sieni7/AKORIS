# AKORIS

> **Build software with method, not with chance.**

[![Version (méthode)](https://img.shields.io/badge/méthode-v1.0.1-4B32C3)](https://github.com/sieni7/AKORIS)
[![Version (code)](https://img.shields.io/badge/code-v0.1.0--dev-845EF7)](https://github.com/sieni7/AKORIS/tree/impl)
[![Licence](https://img.shields.io/badge/license-MIT-green)](constitution/04_LICENSING.md)
[![Branche impl](https://img.shields.io/badge/branche-impl-informational)](https://github.com/sieni7/AKORIS/tree/impl)

> **⚠️ Branche `impl` — développement de l'écosystème AKORIS**
>
> La méthode AKORIS est gelée en `v1.0.1` sur la branche `main`.
> Cette branche contient l'implémentation de référence (Core, CLI, Dashboard).

---

## 1. Qu'est-ce qu'AKORIS ?

**AKORIS** (Adaptive Knowledge & Orchestrated Review for Intelligent Software) est une **méthode de gouvernance** pour le développement logiciel assisté par intelligence artificielle.

**Définition normative** (source : `constitution/00_AKORIS.md` §1) :

> *Standard de gouvernance pour le développement logiciel assisté par IA.*

AKORIS n'est pas un outil, un framework, un modèle d'IA, un IDE ou un moteur d'exécution. Il se situe **au-dessus** de ces composants et définit le cadre dans lequel ils travaillent.

**Positionnement** (source : `constitution/03_TERMINOLOGY.md` §1) :

| Concept | Définition |
|---|---|
| **AKORIS** | Méthode de gouvernance |
| **Écosystème AKORIS** | Outils, spécifications, implémentations |
| **Instance AKORIS** | Application de la méthode à un projet |
| **`.akoris/`** | Matérialisation de l'instance dans le filesystem |

---

## 2. Le problème résolu

Le développement assisté par IA apporte une vitesse considérable, mais cette vitesse peut provoquer (source : `constitution/00_AKORIS.md` §2) :

- Décisions prises sans contexte
- Architecture incohérente
- Agents intervenant hors de leur rôle
- Duplication de code
- Dette technique invisible
- Documentation qui ne suit plus le logiciel
- Informations inventées ou non vérifiées
- Absence de traçabilité
- Dépendance à un moteur IA particulier

**AKORIS répond à ces problèmes en structurant le développement assisté par IA.**

---

## 3. La solution AKORIS

AKORIS structure le développement autour de trois mécanismes (source : `constitution/00_AKORIS.md` §3) :

| Mécanisme | Rôle |
|---|---|
| **Contrats** | Chaque agent (humain ou IA) a une mission, des responsabilités, des limites et des livrables définis. |
| **Règles** | Des politiques formelles et des Quality Gates contrôlent chaque étape du cycle de vie. |
| **Machine à états** | Le projet suit un cycle de vie rigoureux : Proposition → Draft → Planned → Active → Audit → Validated → Released → Archived. |

**Principe fondamental** (source : `constitution/02_GOVERNANCE.md` §4.1.1) :

> *L'IA produit. Les contrôles vérifient. L'humain décide.*

---

## 4. La promesse

**"Build software with method, not with chance."**

Trois bénéfices fondamentaux (source : `constitution/00_AKORIS.md` §4) :

- **Reproductibilité** : un même processus produit un même résultat.
- **Auditabilité** : toute action est traçable et justifiée.
- **Capitalisation** : la connaissance est conservée et partagée.

---

## 5. Les 4 piliers

| Pilier | Principe (source : `constitution/00_AKORIS.md` §5) |
|---|---|
| **Gouvernance First** | La gouvernance est le premier artefact à définir. |
| **Documentation First** | La documentation précède et accompagne toute implémentation. |
| **Audit First** | L'auditabilité est conçue dès le début de tout processus. |
| **Architecture Before Code** | L'architecture est définie avant toute ligne de code. |

---

## 6. Hiérarchie normative

AKORIS repose sur une hiérarchie claire (source : `README.md` §B10) :

```
CONSTITUTION (01_CONSTITUTION.md)
    ↓
GOUVERNANCE (02_GOVERNANCE.md)
    ↓
TERMINOLOGIE (03_TERMINOLOGY.md)
    ↓
REGISTRY (registry/)
    ↓
POLITIQUES (registry/policies/)
    ↓
CONTRATS (registry/contracts/)
    ↓
IMPLEMENTATION (écosystème)
```

---

## 7. Structure du dépôt

```
AKORIS/
├── constitution/               # Documents normatifs fondamentaux
│   ├── 00_AKORIS.md            # Manifeste de la méthode
│   ├── 01_CONSTITUTION.md      # Mission, vision, 10 principes, amendements
│   ├── 02_GOVERNANCE.md        # Règles, rôles, cycle de vie, Quality Gates
│   ├── 03_TERMINOLOGY.md       # Glossaire normatif
│   └── 04_LICENSING.md         # Licence MIT (exclusivement)
├── registry/                   # Référentiel de gouvernance d'une instance
│   ├── state-machine.json      # Machine à états exécutable (11 états)
│   ├── policies/               # Politiques de gouvernance
│   │   └── POL-SEC-01-PROMPT-DATA.md  # Sécurité des données et prompts
│   ├── profiles/               # Profils de gouvernance (Lite/Standard/Critical)
│   ├── schemas/                # Schémas JSON de validation
│   └── contracts/              # Contrats des agents
├── docs/                       # Documentation utilisateur
│   └── guides/
│       └── 00_GETTING_STARTED.md  # Guide de démarrage complet (12 étapes)
└── CHANGELOG.md               # Historique des versions (v1.0.0 → v1.0.1)
```

**Règle de frontière** (source : `constitution/00_AKORIS.md` §8.1) :

> Une information de gouvernance appartient à `.akoris/`. Une information expliquant le logiciel appartient à `docs/`.

---

## 8. Installation

### Prérequis
- Node.js >= 20

```bash
npm install -g akoris
```

> **Note :** Le CLI est un outil de l'**écosystème AKORIS** (prévu à terme). Il implémente la méthode, il ne la définit pas. Ce dépôt est un dépôt de spécification/méthodologie.

---

## 9. Premier projet

```bash
akoris init mon-projet
cd mon-projet
akoris status
```

---

## 10. Documentation

| Document | Contenu |
|---|---|
| [00_AKORIS.md](constitution/00_AKORIS.md) | Manifeste : définition, problème, solution, promesse |
| [01_CONSTITUTION.md](constitution/01_CONSTITUTION.md) | Mission, vision, 10 principes, amendements |
| [02_GOVERNANCE.md](constitution/02_GOVERNANCE.md) | Règles, rôles, cycle de vie, Quality Gates, Evidence |
| [03_TERMINOLOGY.md](constitution/03_TERMINOLOGY.md) | Glossaire normatif (60+ entrées) |
| [04_LICENSING.md](constitution/04_LICENSING.md) | Licence MIT et conditions de contribution |
| [00_GETTING_STARTED.md](docs/guides/00_GETTING_STARTED.md) | Guide de démarrage complet (12 étapes + exemple) |
| [FAQ.md](docs/FAQ.md) | 20 questions fréquentes sourcées aux documents normatifs |
| [architecture.mmd](docs/architecture.mmd) | Diagrammes officiels (hiérarchie, méthode, états, monorepo) |
| [Exemples](examples/README.md) | 3 instances illustratives (Lite, Standard, Critical) |
| [Présentation exécutive](docs/presentations/executive.md) | Slide deck (14 slides, convertible Marp/Slidev) |
| [CHANGELOG.md](CHANGELOG.md) | Historique des versions et modifications |

---

## 11. Gouvernance proportionnelle

AKORIS adapte sa profondeur de gouvernance au niveau de risque du projet (source : `registry/profiles/`) :

| Profil | Usage | Preuves | Quality Gates | Audit | Decision Gate |
|---|---|---|---|---|---|
| **Lite** | Prototype / Solo | E1 | Essentiels | Différé | Optionnel |
| **Standard** | Projet professionnel | E1 + E2 | Cycle complet | Planifié | Obligatoire |
| **Critical** | Sensible / Finance / Sécurité | E1 + E2 + E3 | Cycle complet + renforcés | Obligatoire + externe | Obligatoire + multiple |

> **Exemples :** [`scripts-prototype`](examples/scripts-prototype/README.md) (Lite), [`todo-api`](examples/todo-api/README.md) (Standard), [`fintech-core`](examples/fintech-core/README.md) (Critical).

---

## 12. Écosystème prévu (futur)

Les commandes suivantes sont documentées comme des **jalons** de l'écosystème AKORIS (source : `constitution/02_GOVERNANCE.md` §11) :

| Commande | Fonction |
|---|---|
| `akoris doctor` | Vérifier l'intégrité de l'instance |
| `akoris registry validate` | Valider la cohérence du Registry |
| `akoris state transition` | Exécuter une transition d'état selon `state-machine.json` |

---

## 13. Licence

AKORIS est distribué sous licence **MIT** exclusivement (source : `constitution/04_LICENSING.md` §1.1).

```text
Copyright (c) 2026 AKORIS Core Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

> **"Build software with method, not with chance."**

---

*AKORIS v1.0.1 (méthode) — v0.1.0-dev (code) — 2026-09-04*
