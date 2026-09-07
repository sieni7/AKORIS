# FAQ — AKORIS

> **Version** : 1.0.1
> **Statut** : FAQ officielle
> **Date** : 2026-09-04

Questions fréquentes sur AKORIS, classées par thème. Chaque réponse s'appuie sur les documents normatifs (sources citées).

---

## Général

### Q1. Qu'est-ce qu'AKORIS ?

**AKORIS** (Adaptive Knowledge & Orchestrated Review for Intelligent Software) est une **méthode de gouvernance** pour le développement logiciel assisté par IA.

> *"Un standard de gouvernance pour le développement logiciel assisté par IA. C'est une méthode de gouvernance qui transforme des prompts en processus contrôlés : contrats, règles, machine à états."*
> — `constitution/00_AKORIS.md` §1

**AKORIS n'est pas** un outil, un framework, un IDE ou un modèle d'IA. C'est le cadre dans lequel ces composants travaillent.

### Q2. Quel problème AKORIS résout-il ?

L'IA génère du code rapidement mais souvent sans structure, sans sécurité et sans vision d'ensemble. Résultats observés : décisions d'architecture oubliées, hallucinations qui s'accumulent, dette technique silencieuse, absence de traçabilité (`00_AKORIS.md` §2).

AKORIS structure le développement autour de trois mécanismes (`00_AKORIS.md` §3) :

- **Contrats** : chaque agent a une mission, des responsabilités, des limites et des livrables définis.
- **Règles** : des politiques formelles et des Quality Gates contrôlent chaque étape.
- **Machine à états** : le projet suit un cycle de vie rigoureux.

### Q3. Pour qui est AKORIS ?

| Public | Bénéfice |
|---|---|
| **Vibecodeurs** | Une méthode qui évite les déconvenues et donne de la crédibilité face aux puristes. |
| **Puristes** | Une raison d'accepter l'IA et la preuve qu'elle peut être gouvernée. |
| **Organisations** | Durabilité, réduction de la dette technique, capitalisation de la connaissance. |

— `00_AKORIS.md` §4

### Q4. Que promet AKORIS ?

Trois bénéfices fondamentaux (`00_AKORIS.md` §4) :

- **Reproductibilité** : un même processus produit un même résultat.
- **Auditabilité** : toute action est traçable et justifiée.
- **Capitalisation** : la connaissance est conservée et partagée.

---

## Installation et démarrage

### Q5. Comment installer AKORIS ?

```bash
npm install -g akoris
```

> **Note** : Le CLI (`akoris`) est un outil de l'**écosystème AKORIS**, marqué **"prévu"**. Ce dépôt est un dépôt de spécification/méthodologie. L'implémentation de référence est développée sur la branche `impl` (`@akoris/core`, `@akoris/cli`).

### Q6. Comment démarrer un projet AKORIS ?

Suivez le **guide de démarrage officiel** : `docs/guides/00_GETTING_STARTED.md` (12 étapes). En résumé :

1. Installer `akoris`
2. Créer l'instance : `akoris init mon-projet`
3. Lire la Constitution
4. Choisir un profil (Lite/Standard/Critical)
5. Déclarer les agents
6. Rédiger une proposition (état initial : `PROPOSITION`)
7. … et suivre le cycle de vie jusqu'à `ARCHIVED`

### Q7. Qu'est-ce qu'une instance AKORIS ?

Une instance AKORIS est l'application de la méthode à un projet, matérialisée dans le répertoire **`.akoris/`** selon une structure canonique unique (`00_AKORIS.md` §6.1) :

```
.akoris/
├── manifest.json            (identité, version, profil)
├── state.json               (état courant, dynamique)
├── state-machine.json       (machine normative, statique)
├── registry/                (contrats, politiques, ADR, profils, schémas)
└── .gitignore               (exclusion des secrets)
```

---

## Cycle de vie

### Q8. Qu'est-ce que la machine à états ?

Le projet suit un cycle de vie rigoureux de **11 états** = **8 nominaux** + **3 exceptionnels** :

- **Nominaux** : `PROPOSITION → DRAFT → PLANNED → ACTIVE → AUDIT → VALIDATED → RELEASED → ARCHIVED`
- **Exceptionnels** : `BLOCKED` (bloqué), `REJECTED` (rejeté), `SUPERSEDED` (remplacé)

Le fichier exécutable est `registry/state-machine.json`. L'état initial est `PROPOSITION` ; l'état terminal est `ARCHIVED`.

### Q9. Qui autorise les transitions ?

Chaque transition est associée à une autorité (`registry/state-machine.json`) :

- Transitions techniques : autorisées par un **VALIDATOR**.
- Transition `VALIDATED → RELEASED` : requiert une **décision humaine** (`HUMAN_DECISION`).
- Transition `RELEASED → ARCHIVED` : autorisée par un **MAINTAINER**, et non obligatoire (`required: false`).

Toutes les autres transitions sont **obligatoires** (`required: true`) et exigent le passage d'un Quality Gate.

### Q10. Quelle différence entre Quality Gate et Decision Gate ?

| Concept | Nature | Automatisable | Résultat |
|---|---|---|---|
| **Quality Gate** | Contrôle technique | Oui | PASS / FAIL |
| **Decision Gate** | Décision humaine | Non | GO / NO-GO / CONDITIONAL GO |

**Règle normative** (`02_GOVERNANCE.md` §4.1.1) :

> *L'IA produit. Les contrôles vérifient. L'humain décide.*

Un Quality Gate (PASS/FAIL) ne constitue **jamais**, à lui seul, une autorisation de mise en production. Toute transition vers un état de production (`VALIDATED → RELEASED`) requiert un **Decision Gate humain**.

### Q11. Que se passe-t-il si un Quality Gate échoue ?

(`02_GOVERNANCE.md` §4.5) :

- La transition est bloquée.
- Les raisons de l'échec sont documentées.
- Un plan de correction est défini.

**Recours** : le porteur peut demander une dérogation (section 6 de la Gouvernance) ou soumettre une version corrigée.

---

## Gouvernance et profils

### Q12. Qu'est-ce que la gouvernance proportionnelle ?

AKORIS adapte sa profondeur de gouvernance au niveau de risque du projet via **3 profils** (`registry/profiles/`) :

| Profil | Usage | Preuves | Audit | ADR | Decision Gate |
|---|---|---|---|---|---|
| **Lite** | Prototype / Solo | E1 | Différé | Non requis | Optionnel |
| **Standard** | Projet professionnel | E1 + E2 | Planifié | Requis | Requis |
| **Critical** | Sensible / Financier / Sécurité | E1 + E2 + E3 | Obligatoire + externe | Requis + revue externe | Requis + multiple |

### Q13. Que sont les preuves (Evidence) ?

Chaque affirmation vérifiée, décision ou validation doit être accompagnée des preuves applicables, sur **3 niveaux** (`02_GOVERNANCE.md` §8.2) :

- **E1 — Trace** : fichier + auteur + timestamp + contexte (métadonnées).
- **E2 — Intégrité** : preuve que le contenu n'a pas été altéré (SHA-256).
- **E3 — Preuve forte** : engagement formel (commit signé GPG ou signature cryptographique).

Chaque preuve est un objet structuré : `id`, `level`, `type`, `artifactRef`, `author`, `timestamp`, `source`, `hash`.

### Q14. Comment choisir un profil ?

- **Lite** → prototypes, preuves de concept, projets solo.
- **Standard** → projets professionnels avec livraison.
- **Critical** → domaines sensibles (finance, santé, sécurité) où la traçabilité forte est exigée.

Le profil est déclaré dans `.akoris/manifest.json` et peut évoluer au fil du projet.

---

## Agents

### Q15. Qu'est-ce qu'un agent AKORIS ?

Un agent AKORIS est un **rôle gouverné** avec un contrat formel : mission, responsabilités, limites, interdépendances. Ce n'est pas nécessairement une IA — un humain peut occuper un rôle d'agent.

AKORIS définit **40 agents** répartis en **5 domaines** (`00_AKORIS.md` §7) :

| Domaine | Sigle | Agents |
|---|---|---|
| Gouvernance | CORE | 8 |
| Architecture & Développement | DEV | 10 |
| Qualité | QA | 8 |
| Expertise | EXP | 10 |
| Gouvernance transverse | GOV | 4 |

> Le nombre exact d'agents est calculé depuis `registry/agents/`, le catalogue de référence.

### Q16. Quelle différence entre un agent et un moteur d'IA ?

(`03_TERMINOLOGY.md` §C11)

- Un **agent AKORIS** est un **rôle gouverné** — une mission dans le cadre d'un contrat.
- Un **moteur d'IA** (Execution Engine / Adapter) est un **exécutant remplaçable**.

Un agent peut utiliser un moteur d'IA pour exécuter sa mission, mais le contrat de l'agent est indépendant de l'outil.

---

## Écosystème

### Q17. Quels composants composent l'écosystème AKORIS ?

Les **3 interfaces opérationnelles** (`00_AKORIS.md` §6) :

| Interface | Usage | Statut |
|---|---|---|
| **CLI** | `akoris init`, `state show`, `search`, `alias` | Prévu |
| **Control Center (Dashboard)** | Supervision, historique, transitions d'état | Prévu |
| **API & SDK** | Intégration programmatique et automatisation | Prévu |

L'architecture de référence : un **Core Engine** partagé (logique métier) consommé par le CLI, l'API et le Dashboard.

### Q18. Qu'est-ce que le self-hosting `.akoris/` ?

Puisque AKORIS est une méthode de gouvernance, **rien n'empêche de l'appliquer à son propre dépôt**. Le dépôt AKORIS lui-même possède son instance `.akoris/` (`manifest.json`, `state.json`), comme démonstration de crédibilité. La règle de frontière s'applique partout :

> **Règle** (`00_AKORIS.md` §8.1) : Une information de gouvernance n'appartient pas à `docs/`. Une information expliquant le logiciel n'appartient pas à `.akoris/`.

---

## Licence et versioning

### Q19. Sous quelle licence est distribué AKORIS ?

**MIT exclusivement** (`04_LICENSING.md` §1.1). Aucune autre licence (notamment pas de Creative Commons) ne s'applique.

### Q20. Comment sont versionnées la méthode et le code ?

Ils suivent **deux cycles de versionning distincts** :

| Artefact | Version | Statut |
|---|---|---|
| Méthode (Constitution, Registry, normes) | `v1.0.1` | Gelée sur `main` |
| Code (Core, CLI) | `v0.1.0-dev` | Développement sur `impl` |

Le code suit son propre chemin Semantic Versioning : `v0.1.0` (pré-release) → `v1.0.0` (stable).

---

## Références rapides

| Thème | Source |
|---|---|
| Manifeste | `constitution/00_AKORIS.md` |
| Constitution | `constitution/01_CONSTITUTION.md` |
| Gouvernance (QG/DG, Evidence, profils) | `constitution/02_GOVERNANCE.md` |
| Terminologie | `constitution/03_TERMINOLOGY.md` |
| Licence | `constitution/04_LICENSING.md` |
| Machine à états | `registry/state-machine.json` |
| Profils | `registry/profiles/` |
| Guide de démarrage | `docs/guides/00_GETTING_STARTED.md` |

---

*AKORIS v1.0.1 — FAQ*
