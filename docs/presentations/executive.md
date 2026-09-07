---
marp: true
theme: default
paginate: true
size: 16:9
---

<!-- _class: lead -->

# AKORIS

**Build software with method, not with chance.**

Une méthode de gouvernance pour le développement logiciel assisté par IA

*Présentation exécutive — v1.0.1*

---

## Le problème

L'IA génère du code rapidement, mais souvent sans structure :

- Décisions d'architecture oubliées
- Hallucinations qui s'accumulent
- Dette technique silencieuse
- Absence de traçabilité des choix

> Un prompt différent donne un résultat différent.

---

## La solution : AKORIS

**AKORIS** (Adaptive Knowledge & Orchestrated Review for Intelligent Software) est une **méthode de gouvernance** qui transforme des prompts en processus contrôlés.

Trois mécanismes :

| Mécanisme | Rôle |
|---|---|
| **Contrats** | Chaque agent a mission, limites, livrables définis |
| **Règles** | Politiques formelles + Quality Gates |
| **Machine à états** | Cycle de vie rigoureux |

---

## La promesse

Trois bénéfices fondamentaux :

- **Reproductibilité** — un même processus produit un même résultat
- **Auditabilité** — toute action est traçable et justifiée
- **Capitalisation** — la connaissance est conservée et partagée

> **"Build software with method, not with chance."**

---

## Les 4 piliers

| Pilier | Principe |
|---|---|
| **Gouvernance First** | La gouvernance précède tout |
| **Documentation First** | La doc précède l'implémentation |
| **Audit First** | L'auditabilité est conçue dès le départ |
| **Architecture Before Code** | L'architecture précède le code |

---

## La machine à états (11 états)

Cycle de vie d'un artefact — 8 états nominaux + 3 exceptionnels :

```
PROPOSITION → DRAFT → PLANNED → ACTIVE → AUDIT → VALIDATED → RELEASED → ARCHIVED
                                     │
                          BLOCKED / REJECTED / SUPERSEDED
```

Chaque transition est :
- **Déterministe** (`required: true/false`)
- Protégée par des **Quality Gates**
- La release finale requiert un **Decision Gate humain**

---

## Quality Gate vs Decision Gate

> **L'IA produit. Les contrôles vérifient. L'humain décide.**

| Concept | Nature | Automatisable | Résultat |
|---|---|---|---|
| **Quality Gate** | Contrôle technique | Oui | PASS / FAIL |
| **Decision Gate** | Décision humaine | Non | GO / NO-GO / CONDITIONAL |

La transition `VALIDATED → RELEASED` exige **toujours** une décision humaine.

---

## Gouvernance proportionnelle

AKORIS s'adapte au risque du projet via 3 profils :

| Profil | Usage | Preuves | Audit |
|---|---|---|---|
| **Lite** | Prototype / Solo | E1 | Différé |
| **Standard** | Projet pro | E1 + E2 | Planifié |
| **Critical** | Sensible / Finance | E1+E2+E3 | Obligatoire + externe |

---

## Les 40 agents

5 domaines, 40 rôles gouvernés :

| Domaine | Sigle | Nombre |
|---|---|---|
| Gouvernance | CORE | 8 |
| Architecture & Dev | DEV | 10 |
| Qualité | QA | 8 |
| Expertise | EXP | 10 |
| Gouvernance transverse | GOV | 4 |

Chaque agent a un **contrat formel** (mission, responsabilités, limites).

---

## Écosystème AKORIS

3 interfaces opérationnelles autour d'un **Core Engine** partagé :

| Interface | Rôle | Statut |
|---|---|---|
| **CLI** | `akoris init`, `state show`, `search` | **Prévu** |
| **Control Center** (Dashboard) | Supervision du cycle de vie | **Prévu** |
| **API & SDK** | Intégration et automatisation | **Prévu** |

> La méthode est gelée en v1.0.1. Le code (Core/CLI) suit son propre cycle (v0.1.0-dev sur la branche `impl`).

---

## Structure d'une instance

Toute instance matérialise sa gouvernance dans `.akoris/` :

```
.akoris/
├── manifest.json        (identité, version, profil)
├── state.json           (état courant)
├── state-machine.json   (machine normative)
└── registry/            (contrats, politiques, ADR, profils, schémas)
```

**Règle de frontière** : la gouvernance appartient à `.akoris/`, l'explication du logiciel à `docs/`.

---

## Pour qui ?

| Public | Bénéfice |
|---|---|
| **Vibecodeurs** | Une méthode pour coder vite mais bien |
| **Puristes** | La preuve que l'IA peut être gouvernée |
| **Organisations** | Durabilité, moins de dette, capitalisation |

---

## Ressources & Licence

- Manifeste : `constitution/00_AKORIS.md`
- Gouvernance : `constitution/02_GOVERNANCE.md`
- Guide de démarrage : `docs/guides/00_GETTING_STARTED.md`
- FAQ : `docs/FAQ.md`

**Licence** : MIT exclusivement

<!-- _class: lead -->
## Merci

**Build software with method, not with chance.**

*AKORIS v1.0.1 — 2026-09-04*
