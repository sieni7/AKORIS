# ADR-001 — Consolidation du Registry AKORIS (R1)

- **ID** : ADR-001
- **Titre** : Consolidation du Registry (Décisions D-001 → D-008) + exécution R2/R3
- **Statut** : approved
- **Date** : 2026-09-07
- **Décideur** : Humain (gouvernance AKORIS)
- **Références** : Decision Record R1 — HUMAN DECISIONS CONFIRMED ; Gate R1 ; missions R2 et R3

## Contexte

L'audit du Registry AKORIS (Sprint R1) a identifié 12 anomalies (A-01 à A-12). Un
Decision Gate R1 a été conduit pour valider l'intégrité du Decision Record R1.1 et
collecter les décisions humaines D-001 → D-008. Le registre observé contient de façon
réelle : 40 agents, 1 policy, 6 quality gates ; les compteurs ARS §3.2 (150 rules,
45 deliverables, 25 events, 12 workflows, 18 policies, 30 QG) ne correspondaient pas à
l'état courant.

## Décision

Les décisions humaines suivantes ont été confirmées le 2026-09-07 :

- **D-001** (APPROUVE, R3) : créer `registry/registry.json` comme **métadonnée descriptive**
  (comptages réels), jamais source de vérité.
- **D-002** (APPROUVE, R3) : créer `registry/schemas/registry.schema.json` (contrat de structure,
  lié à D-001).
- **D-003** (APPROUVE, exécuté en R2) : aligner l'ARS sur l'état réel — distinction
  CURRENT / FUTURE-EXTENSIBLE, `registry.json` = métadonnée descriptive.
- **D-004** (APPROUVE) : policy conservée en `.md` ; `policy.schema.json` = contrat préparatoire ;
  pas de duplication `.md` + `.json`.
- **D-005** (APPROUVE, exécuté en R2) : mapping documentaire des rôles
  VALIDATOR / HUMAN_DECISION / MAINTAINER ; rôles ≠ agents ; aucun agent créé.
- **D-006** (SUPPRIMER après confirmation d'intention) : suppression des dossiers vides
  `registry/contracts/`, `registry/deliverables/`, `registry/templates/` — aucune
  intention architecturale trouvée (EXISTS/EMPTY/UNTRACKED, aucun historique, non référencés).
- **D-007** (APPROUVE évolution future) : grammaire formelle des sélecteurs de profils à
  concevoir en mission dédiée ; aucun profil modifié.
- **D-008** (OUI, conditionné à la consolidation R3) : démarrage du Sprint 2 du Core Engine
  (EventBus + RegistryReader mocké), sous invariant absolu **fixtures ≠ Registry ≠ source de vérité**.

### Invariants confirmés

Registry = état réel ; manifest ≠ source de vérité ; rôles ≠ agents ; fixtures ≠ registry ;
future ≠ current ; G0 Registry ≠ G0 Documentation ≠ G0 Core Engine.

## Conséquences

Positives :
- L'ARS distingue désormais l'état courant (40 agents / 1 policy / 6 QG) des extensions
  futures (150/45/25/12).
- Le manifest `registry.json` fournit une vue d'ensemble descriptive versionnée sans
  devenir une source de vérité ni une liste déclarative faisant autorité.
- Le mapping documentaire des rôles supprime l'ambiguïté validateurs/agents.

Négatives / à surveiller :
- Risque de dérive si `registry.json` était traité comme source de vérité — verbe
  d'action : le traiter comme métadonnée descriptive uniquement.
- Suppression des dossiers vides : effective, non réversible (D-006).
- Sprint 2 lancé avec des mocks : les fixtures restent des données de test, jamais une
  copie normative du Registry.

## Alternatives

- **Option A — Conserver l'état réel sans manifest** : rejeté (D-001/D-002 APPROUVÉ) —
  perte d'une vue descriptive versionnée.
- **Option B — Créer un manifest faisant autorité** : rejeté — violerait l'invariant
  manifest ≠ source de vérité.
- **Option C — Conserver les dossiers vides** : rejetée (D-006 SUPPRIMER) — aucune
  intention architecturale, encombrement non tracé.

---

*Ce document est archivé dans `docs/decisions/` (dépôt méthode) conformément à la décision
humaine. Les champs ci-dessus suivent le schéma `adr.schema.json` (id, title, status, date,
context, decision, consequences).*
