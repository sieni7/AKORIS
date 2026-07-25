# Rapport de Diagnostic — v1.0.1

**Date :** 25/07/2026
**Version cible :** v1.0.1
**Stratégie :** Stabilisation du socle v1 (pas de v2)

---

## Résumé des exécutions

| Commande | Statut |
|----------|--------|
| `akoris doctor` | ⚠️ Terminé avec avertissements |
| `akoris registry validate` | ⚠️ 3/4 validations passées |
| `akoris state show` | ✅ Fonctionnel (état "Planned") |
| `akoris agent list` | ❌ Affiche 3 agents v1 au lieu de 33 |
| `akoris agent info CORE-01` | ❌ "Agent introuvable" |
| `akoris activation suggest --event RELEASE_PREP` | ⚠️ `[object Object]` dans les capacités |
| `akoris activation list` | ✅ 18 événements, correct |
| `akoris capability find design_architecture` | ✅ 3 agents, correct |
| `akoris registry index` | ✅ Index v2 complet |

---

## 1. Bugs identifiés

### 🔴 Bloquant

#### B1 — `akoris agent list` ignore les 33 agents v2

**Fichier :** `packages/cli/src/commands/agent.ts:12-13`
**Cause :** Utilise `RegistryService` (v1, 3 agents) au lieu de `RegistryReaderV2`.
**Impact :** Les 33 agents contractuels sont invisibles.

```ts
// Actuel (v1) — 3 agents seulement
const registry = new RegistryService();
const agents = registry.getAgents() as Agent[];

// Attendu — 33 agents depuis le Registry v2
const reader = new RegistryReaderV2();
const registry = reader.getCapabilityRegistry();
```

#### B2 — `akoris agent info <id>` échoue pour tout agent v2

**Fichier :** `packages/cli/src/commands/agent.ts:33-39`
**Cause :** Même problème — cherche dans `RegistryService` v1, pas dans `RegistryReaderV2`.
**Impact :** Impossible d'obtenir les infos d'un agent.

---

### 🟡 Majeur

#### B3 — `akoris activation suggest` affiche `[object Object]`

**Fichier :** `packages/cli/src/commands/activation.ts:33`
**Cause :** `getAgentCapabilities()` lit les fichiers `agents/<dir>/capabilities.json` avec un format attendu `{ can: string[], cannot: string[] }`, mais les fichiers réels utilisent un format objet :

```json
// Attendu par le code
{ "can": ["audit_owasp", "run_sast"], "cannot": [...] }

// Réel dans les fichiers
{ "can": [{ "id": "audit_owasp", "description": "..." }, ...], "cannot": [...] }
```

**Impact :** `[object Object], [object Object]` au lieu des noms de capacités.

#### B4 — `getAgentCapabilities()` format incompatible

**Fichier :** `packages/cli/src/services/registry-reader-v2.service.ts:110-118`
**Cause :** L'interface `{ can: string[]; cannot: string[] }` est incorrecte. Les agents v2 utilisent `{ id, description }` dans leurs tableaux.
**Impact :** Toute lecture des capacités par agent retourne des objets non stringifiables.

---

### 🟢 Mineur

#### B5 — `akoris doctor` utilise les compteurs v1

**Fichier :** `packages/cli/src/services/registry.service.ts` + `packages/cli/src/commands/doctor.ts`
**Cause :** Le diagnostic l'ancien `RegistryService` au lieu du `RegistryReaderV2`.
**Impact :** Compteurs erronés (9 policies, 3 agents au lieu de 12, 33).

#### B6 — `akoris registry validate` valide l'ancien format

**Fichier :** `packages/cli/src/commands/registry.ts:validate`
**Cause :** L'ancienne commande `validate` utilise `ValidatorService` qui vérifie `src/`, `policies`, etc. (check v1).
**Solution :** Notre nouvelle commande `registry index` valide déjà le v2. Il faut soit remplacer `validate`, soit le faire pointer vers la validation v2.

#### B7 — `src/ manquant` dans le diagnostic

**Fichier :** `packages/cli/src/services/validator.service.ts`
**Cause :** Le validateur vérifie l'existence d'un dossier `src/`, pertinent pour un projet utilisateur mais pas pour le projet AKORIS lui-même.
**Impact :** Fausse erreur quand on exécute `akoris doctor` depuis la racine AKORIS.

#### B8 — État "Planned" fantôme

**Fichier :** `.akoris/state.json` (artefact de test)
**Cause :** Les tests de la Phase 1 ont persisté l'état "Planned" dans `.akoris/state.json`. Un projet AKORIS frais devrait être en "Draft".
**Impact :** L'état initial n'est pas "Draft" comme attendu.

---

## 2. Améliorations suggérées

### UX

| ID | Suggestion | Fichier | Priorité |
|----|-----------|---------|----------|
| UX1 | Ajouter `--json` à toutes les commandes | commandes/*.ts | Haute |
| UX2 | Ajouter `--verbose`/`--quiet`/`--no-color` | index.ts | Haute |
| UX3 | Afficher les spinners pour les commandes longues | index.ts | Moyenne |
| UX4 | Forcer état "Draft" si `.akoris/state.json` absent | state-machine.service.ts | Haute |

### Robutesse

| ID | Suggestion | Fichier | Priorité |
|----|-----------|---------|----------|
| R1 | Wrap des `JSON.parse` dans try/catch | registry-reader-v2.service.ts | Haute |
| R2 | Message d'erreur si Registry v2 absent | registry-reader-v2.service.ts | Haute |
| R3 | Validation du format `capabilities.json` avant parsing | registry-reader-v2.service.ts | Moyenne |

### Tests

| ID | Suggestion | Priorité |
|----|-----------|----------|
| T1 | Test : `akoris agent list` retourne 33 agents | Haute |
| T2 | Test : `akoris activation suggest` sans `[object Object]` | Haute |
| T3 | Test : `akoris doctor` sans erreur `src/` | Moyenne |

---

## 3. Plan de correction proposé

### Sprint v1.0.1-a (corrections bloquantes)

| Ticket | Fichiers | Estimation |
|--------|----------|------------|
| B1+B2 : Migrer `agent list` et `agent info` vers `RegistryReaderV2` | `commands/agent.ts` | 30 min |
| B3+B4 : Corriger le format `capabilities.json` dans `getAgentCapabilities()` | `registry-reader-v2.service.ts` | 15 min |
| B3 (suite) : Corriger l'affichage dans `activation suggest` | `commands/activation.ts` | 10 min |

### Sprint v1.0.1-b (mineurs)

| Ticket | Fichiers | Estimation |
|--------|----------|------------|
| B5 : Migrer `akoris doctor` vers `RegistryReaderV2` | `commands/doctor.ts` | 20 min |
| B6 : Remplacer l'ancien `registry validate` par la validation v2 | `commands/registry.ts` | 15 min |
| B7 : Supprimer le check `src/` du validateur projet AKORIS | `services/validator.service.ts` | 5 min |
| B8 : Réinitialiser `.akoris/state.json` à Draft | `.akoris/state.json` | 1 min |

### Sprint v1.1.0 (UX)

| Ticket | Fichiers | Estimation |
|--------|----------|------------|
| UX1 : `--json` sur toutes les commandes | commandes/*.ts | 1h |
| UX2 : `--verbose`, `--quiet`, `--no-color` | index.ts + services | 30 min |
| UX3 : Spinners | index.ts + commandes | 20 min |

---

## 4. Captures d'écran des anomalies

```
# B1 — Agent list (3 au lieu de 33)
$ akoris agent list
🤖 Agents disponibles :
   🧠 Architecte Logiciel (agent-architect)
   🧠 Développeur (agent-developer)
   🧠 Testeur (agent-tester)

# B2 — Agent info v2
$ akoris agent info CORE-01
❌ Agent "CORE-01" introuvable

# B3 — [object Object]
$ akoris activation suggest --event RELEASE_PREP
  QA-03
    Capacités : [object Object], [object Object]
  GOV-02

# B5 — Doctor v1
$ akoris doctor
📦 Registry : Policies: 9, Agents: 3, Contrats: 3  ← devrait être 12, 33, 33
```

---

*Document généré le 25/07/2026 — AKORIS v1.0.0 → v1.0.1*
