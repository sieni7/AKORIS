# CHANGELOG — AKORIS

Toutes les modifications notables du projet AKORIS sont documentées dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et ce projet respecte [Semantic Versioning](https://semver.org/).

---

## [0.1.0-dev] — 2026-09-04

### Statut
🚧 **v0.1.0-dev — Branche `impl` initialisée**

Ouverture de la branche de développement pour l'écosystème AKORIS (Core, CLI, Dashboard).

### Ajouté
- Branche `impl` pour le développement de l'écosystème AKORIS.
- Monorepo pnpm : `packages/core/`, `packages/cli/`, `apps/dashboard/`.
- Self-hosting `.akoris/` appliqué au dépôt (`manifest.json`, `state.json`).
- `tsconfig.base.json` partagé, `package.json` racine avec scripts build/test/dev.
- Placeholder `scripts/validate-registry.js`.

### Enrichissement des agents (N2.3.1)
- `enrich-agents.js` : ajoute `dependencies`, `capabilities` (achevé, réels par agent) et `raci` — écrit dans `agent.json` et `contract.json`, sans écraser les champs existants ni toucher à `capabilities.json`/`prompt.md`.
- `enrich-prompts.js` : seul écrivain de `prompt.md`, template enrichi (variables `{{agent}}`/`{{domain}}`/`{{criticity}}`, consignes par domaine).
- `generate-agent-files.js` : ajout du mode `--overwrite` ; retrait de `prompt.md` et `contract.json` de son périmètre (propriétés respectives enrich-agents/enrich-prompts).
- `agent.schema.json` : ajout du champ `description` dans `capabilities`.
- Vidage exploitable : 40 agents enrichis, 120 capacités, RACI sur 40 `contract.json`, validation verte (exit 0).

### Note
- La méthode AKORIS reste en `v1.0.1` (gelée sur `main`).
- Le code suit son propre versionnement (`v0.1.0-dev`).
- Versionning séparé : `@akoris/core@0.1.0`, `@akoris/cli@0.1.0`.

---

## [1.0.1] — 2026-09-04

### Statut
✅ **v1.0.1 — Consistency Patch**

Ce patch ne **n'ajoute aucun concept** et **n'augmente pas le périmètre**. Il nettoie, aligne, rend la spécification déterministe et gèle la v1.0.0. Aucun changement rétrocompatible rompu.

### Corrigé (Phase P0 — corrections critiques)

- **P0.1** — Nombre d'états clarifié : "8 états" remplacé par "11 états (8 nominaux + 3 exceptionnels)" dans `CHANGELOG.md`. Les 3 états exceptionnels (BLOCKED, REJECTED, SUPERSEDED) sont désormais explicites.
- **P0.2** — Positionnement : AKORIS est présenté comme une **méthode de gouvernance**, plus comme un "référentiel et un CLI" (`00_AKORIS.md` §1).
- **P0.3** — Licence verrouillée : ajout d'une clause explicite "MIT exclusivement" dans `04_LICENSING.md` (préambule). Aucune autre licence (notamment Creative Commons) ne s'applique.

### Modifié (Phase P1 — cohérence machine)

- **P1.1** — Structure canonique `.akoris/` définie et référencée (`00_AKORIS.md` §6.1, `02_GOVERNANCE.md` §10).
- **P1.2** — Distinction explicite `state-machine.json` (norme statique) vs `state.json` (état courant dynamique) (`02_GOVERNANCE.md` §3.0, `03_TERMINOLOGY.md` §Machine à états).
- **P1.3** — Chaque transition de `state-machine.json` comporte désormais `required: true/false` (déterministe). Schéma `state-machine.schema.json` mis à jour.
- **P1.4** — Règle normative QG/DG renforcée : "L'IA produit. Les contrôles vérifient. L'humain décide." (`02_GOVERNANCE.md` §4).
- **P1.5** — Le CLI est marqué **"prévu"** dans `README.md` et `00_AKORIS.md` §6 (aucune implémentation dans ce dépôt).

### Amélioré (Phase P2 — qualité documentaire)

- **P2.1** — Terminologie normalisée : "référentiel" réservé au Registry (`03_TERMINOLOGY.md`).
- **P2.2** — Note ajoutée : le nombre d'agents est calculé depuis `registry/agents/` (`00_AKORIS.md` §7).
- **P2.3** — Objet `Evidence` formel défini (id, level, type, artifactRef, author, timestamp, source, hash) (`02_GOVERNANCE.md` §8.2).
- **P2.4** — Placeholders supprimés/renseignés dans `04_LICENSING.md` §9 (dépôt officiel référencé).

---

## [1.0.0] — 2026-09-04

### Statut
✅ **v1.0.0 — Version stable gelée**

Ce gel marque l'aboutissement du réaménagement structurel de la méthode AKORIS en **12 chantiers** répartis en 3 phases : stabilisation normative, opérationnalisation, renforcement architectural.

---

### Ajouté

#### Phase A — Stabilisation normative

- **A2** — Machine à états exécutable : création de `registry/state-machine.json` décrivant les 11 états (8 nominaux + 3 exceptionnels), les transitions, leurs exigences (Quality Gates) et autorités. Schéma de validation `registry/schemas/state-machine.schema.json`.
- **A3** — Système de preuves formalisé : ajout des 3 niveaux d'évidence (**E1 — Trace**, **E2 — Intégrité**, **E3 — Preuve forte**) dans `02_GOVERNANCE.md` (§8.2).
- **A4** — Nouvelle politique de sécurité des données : `registry/policies/POL-SEC-01-PROMPT-DATA.md` (interdictions de transmission, obligations de classification/minimisation/filtrage/anonymisation, règle fondamentale).
- **A6** — Schéma ADR enrichi : champ `supersedes` ajouté dans `registry/schemas/adr.schema.json` pour tracer les liens entre décisions.

#### Phase B — Opérationnalisation

- **B7** — Gouvernance proportionnelle au risque : ajout de 3 profils dans `registry/profiles/` (`lite.json`, `standard.json`, `critical.json`) adaptant la profondeur de gouvernance (preuves, Quality Gates, audit, agents, ADR, Decision Gate).
- **B8** — Guide de démarrage officiel : création de `docs/guides/00_GETTING_STARTED.md` (12 étapes + exemple "API de gestion de tâches" en 5 jours).
- **B9** — Règle de frontière `.akoris/` vs `docs/` : ajout de la §8.1 dans `00_AKORIS.md` (une information de gouvernance n'appartient pas à `docs/`).
- **B10** — Source of Truth : README enrichi avec la hiérarchie normative Constitution → Gouvernance → Terminologie → Registry → Politiques → Contrats → Implémentation. Section 11 "Écosystème prévu" ajoutée dans `02_GOVERNANCE.md`.

#### Phase C — Renforcement architectural

- **C11** — Distinction Agent / Adapter / Execution Engine : ajout des entrées dans `03_TERMINOLOGY.md` (un agent AKORIS est un rôle gouverné ; un moteur IA est un exécutant remplaçable).
- **C12** — Cadre métriques, sunset et audit automatisé : section 11 enrichie dans `02_GOVERNANCE.md` (KPIs, cycle de vie des agents, principe d'audit non-modifiant). Schémas `registry/schemas/metric.schema.json` et `registry/schemas/sunset.schema.json`.

---

### Modifié

- **A1** — Unification terminologique : remplacement systématique de `Registre` par `Registry` dans `02_GOVERNANCE.md` (3 occurrences). La terminologie est désormais uniforme dans toute la constitution.
- **A5** — Distinction **Quality Gate vs Decision Gate** : ajout de la §4.1.1 dans `02_GOVERNANCE.md`. Un Quality Gate est un contrôle technique (PASS/FAIL, automatisable) ; un Decision Gate est une décision humaine (GO/NO-GO/CONDITIONAL). La décision de release est toujours humaine.
- **A6** — Reformulation de la transition `REJECTED` dans `02_GOVERNANCE.md` (§3.10) : `REJECTED → ARCHIVED` est définitif pour l'artefact, mais une nouvelle proposition (`PROPOSITION-002`) peut supersede ou reprendre l'ancienne, l'historique restant intact.
- **00_AKORIS.md** — Ajout de la §8.1 sur la frontière `.akoris/` vs `docs/`.
- **README.md** — Ajout de la hiérarchie normative et de la section "Écosystème prévu".

---

### Fixé / Clarifié

- **A1** — Suppression de l'ambiguïté sémantique entre `Registry` et `Registre` dans les documents normatifs.

---

### Noté

> Les chantiers B10 et C12 documentent des commandes CLI et des schémas **prévus dans l'écosystème** (`akoris doctor`, `akoris registry validate`, `akoris state transition`, les répertoires `registry/metrics/` et `registry/sunset/`). Ces éléments sont des jalons, non des engagements fermes. Aucune implémentation CLI ne figure dans ce dépôt (dépôt de spécification/méthodologie).

---

## [0.0.1] — 2026-09-04

### Ajouté
- Création initiale de la structure du dépôt AKORIS.
- Documents constitutionnels : `00_AKORIS.md`, `01_CONSTITUTION.md`, `02_GOVERNANCE.md`, `03_TERMINOLOGY.md`, `04_LICENSING.md`.
- `README.md` et `.gitignore` initiaux.

---

### Comparaison entre versions

[1.0.1]: https://github.com/sieni7/AKORIS/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/sieni7/AKORIS/compare/v0.0.1...v1.0.0

---

*CHANGELOG AKORIS — v1.0.1*
