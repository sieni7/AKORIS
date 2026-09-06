# AKORIS

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![npm version](https://img.shields.io/npm/v/akoris.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-green.svg)
![Status](https://img.shields.io/badge/status-specification-orange.svg)

> **🔵 Statut actuel : Spécification uniquement**
>
> AKORIS est actuellement un dépôt de **méthode, de gouvernance et de schémas de référence**. Il ne fournit pas encore de CLI installable, de moteur d'exécution, de dashboard, d'API ou d'instance `.akoris/` complète.
>
> Les commandes et composants annoncés comme « prévus » appartiennent à la roadmap de l'écosystème.
>
> **Architecture status:** Proposed / Architecture Draft. L'implémentation du Core Engine et les outils associés sont en cours de spécification ; ils ne doivent pas être considérés comme disponibles tant qu'ils ne sont pas présents dans le dépôt et couverts par des tests.
>
> **Dépôt :** [Licence MIT](LICENSE) · [Politique de sécurité](SECURITY.md) · [Contribuer](CONTRIBUTING.md) · [Présentation de la méthode](AKORIS.md)

> **Build software with method, not with chance.**

## 📌 Versioning

| Artefact | Version | Statut |
|---|---|---|
| **Méthode AKORIS** (Constitution, Gouvernance) | v1.0.1 | ✅ Figée |
| **Registry** (schémas, agents, profils) | v1.0.1 | ✅ Figée |
| **Core Engine** (`@akoris/core`) | v0.1.0 (Seed) | 🔄 En développement |
| **CLI** (`@akoris/cli`) | v0.1.0 (prévu) | ⏳ Planifié |
| **Dashboard** | v0.1.0 (prévu) | ⏳ Planifié |

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
├── AKORIS.md                # Présentation de la méthode
├── README.md                # Présentation du dépôt
├── LICENSE                  # Licence MIT
├── SECURITY.md              # Politique de sécurité
├── CONTRIBUTING.md          # Guide de contribution
├── CHANGELOG.md             # Historique des versions
├── .gitignore               # Règles d'ignorance
├── constitution/            # Documents constitutionnels
│   ├── 00_AKORIS.md         # Manifeste constitutionnel
│   ├── 01_CONSTITUTION.md   # Mission, vision, 10 principes
│   ├── 02_GOVERNANCE.md     # Règles, rôles, cycle de vie
│   ├── 03_TERMINOLOGY.md    # Glossaire normatif
│   └── 04_LICENSING.md      # Licence MIT et contribution
├── registry/                # Référentiel de gouvernance
│   ├── state-machine.json   # Machine à états (11 états)
│   ├── policies/            # Politiques de gouvernance
│   ├── profiles/            # Profils Lite/Standard/Critical
│   ├── schemas/             # Schémas JSON de validation
│   └── contracts/           # Contrats des agents (à venir)
├── docs/                    # Documentation utilisateur
│   └── guides/
│       └── 00_GETTING_STARTED.md
├── packages/                # Code source (futur)
│   └── core/                # Core Engine (en spécification)
└── .akoris/                 # Instance de référence (à venir)
```

**Règle de frontière** (source : `constitution/00_AKORIS.md` §8.1) :

> Une information de gouvernance appartient à `.akoris/`. Une information expliquant le logiciel appartient à `docs/`.

---

## 8. Installation (prévue)

Le CLI AKORIS est en développement. La commande d'installation sera :

```bash
npm install -g akoris
```

> ⚠️ **Cette commande n'est pas encore disponible.** Le dépôt est actuellement une spécification de méthode.

---

## 9. Premier projet

```bash
akoris init mon-projet
cd mon-projet
akoris status
```

> **⚠️ Ces commandes sont prévues pour l'écosystème futur.** Elles ne sont pas encore exécutables dans ce dépôt.

---

## 10. Documentation

| Document | Contenu |
|---|---|
| [AKORIS.md](AKORIS.md) | Présentation générale de la méthode |
| [00_AKORIS.md](constitution/00_AKORIS.md) | Manifeste constitutionnel |
| [01_CONSTITUTION.md](constitution/01_CONSTITUTION.md) | Mission, vision, 10 principes, amendements |
| [02_GOVERNANCE.md](constitution/02_GOVERNANCE.md) | Règles, rôles, cycle de vie, Quality Gates |
| [03_TERMINOLOGY.md](constitution/03_TERMINOLOGY.md) | Glossaire normatif (60+ entrées) |
| [04_LICENSING.md](constitution/04_LICENSING.md) | Licence MIT et conditions de contribution |
| [00_GETTING_STARTED.md](docs/guides/00_GETTING_STARTED.md) | Guide de démarrage complet |
| [CHANGELOG.md](CHANGELOG.md) | Historique des versions |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guide de contribution |
| [SECURITY.md](SECURITY.md) | Politique de sécurité |
| [Core Engine Specification](docs/specifications/CORE-ENGINE-SPECIFICATION.md) | Architecture Draft du Core Engine |

---

## 11. Gouvernance proportionnelle

AKORIS adapte sa profondeur de gouvernance au niveau de risque du projet (source : `registry/profiles/`) :

| Profil | Usage | Preuves | Quality Gates | Audit | Decision Gate |
|---|---|---|---|---|---|
| **Lite** | Prototype / Solo | E1 | Essentiels | Différé | Optionnel |
| **Standard** | Projet professionnel | E1 + E2 | Cycle complet | Planifié | Obligatoire |
| **Critical** | Sensible / Finance / Sécurité | E1 + E2 + E3 | Cycle complet + renforcés | Obligatoire + externe | Obligatoire + multiple |

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
Copyright (c) 2026 OULAÏ SIÉNI (sieni7@gmail.com)

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

*AKORIS v1.0.1 — 2026-09-05*