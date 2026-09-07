# Politique de versioning — AKORIS

## 1. Objet

Ce document **consolide** les règles de versioning d'AKORIS éparses dans les documents source. Il ne crée aucune clause nouvelle. Les documents normatifs font autorité en cas de divergence (voir la hiérarchie normative dans `00_AKORIS.md` §6).

Les sources consolidées :

- `README.md` — section « Versioning ».
- `constitution/04_LICENSING.md` — §8 Compatibilité, §10 Historique des versions.
- `docs/FAQ.md` — Q20 (deux cycles distincts).

## 2. Deux cycles de versionning distincts

AKORIS versionne séparément la **méthode** et le **code** de l'écosystème :

| Artefact | Version | Statut |
|---|---|---|
| **Méthode AKORIS** (Constitution, Gouvernance) | `v1.0.1` | Figée |
| **Registry** (schémas, agents, profils) | `v1.0.1` | Figée |
| **Core Engine** (`@akoris/core`) | `v0.1.0` (Seed) | En développement |
| **CLI** (`@akoris/cli`) | `v0.1.0` | Prévu |
| **Dashboard** | `v0.1.0` | Prévu |

Source : `README.md` (tableau Versioning). Les évolutions de la méthode font l'objet d'une entrée dans le [CHANGELOG](../CHANGELOG.md).

## 3. Versioning de la méthode

La méthode et le Registry suivent un **versioning sémantique** distinct du code.

- Les enrichissements compatibles (glossaire, exemples) → incrément **mineur**.
- Les corrections de cohérence → incrément **patch**.
- Toute modification normative (Constitution, Gouvernance, Licencing) suit la procédure d'amendement `constitution/02_GOVERNANCE.md` et est enregistrée à `constitution/04_LICENSING.md` §10.

## 4. Compatibilité

Source : `constitution/04_LICENSING.md` §8.

### 4.1. Compatibilité ascendante

AKORIS s'efforce de maintenir une compatibilité ascendante pour les instances `.akoris/` créées avec des versions antérieures.

### 4.2. Breaking changes

Les modifications incompatibles sont :

- documentées dans le CHANGELOG ;
- annoncées à l'avance ;
- accompagnées d'un guide de migration.

### 4.3. Période de grâce

Les versions obsolètes sont supportées pendant une **période minimale de 12 mois** après la sortie d'une nouvelle version majeure.

## 5. Références croisées

| Thème | Source |
|---|---|
| Tableau de versioning (README) | `README.md` §Versioning |
| Compatibilité, breaking changes, grâce | `constitution/04_LICENSING.md` §8 |
| Historique des versions de la méthode | `constitution/04_LICENSING.md` §10 |
| Deux cycles distincts (méthode vs code) | `docs/FAQ.md` Q20 |
| Historique du dépôt | `CHANGELOG.md` |
| Procédure d'amendement | `constitution/02_GOVERNANCE.md` |
| Hiérarchie normative | `constitution/00_AKORIS.md` §6 |