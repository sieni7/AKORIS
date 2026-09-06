# AKORIS s'applique à lui-même — état courant (dogfooding)

> *Ce document n'est pas une étude de cas terminée. Il documente l'état réel de l'instance `.akoris/` de ce dépôt, au jour de rédaction. Il sera mis à jour à mesure que le cycle de vie progresse.*

---

## 1. Objet

Le dépôt AKORIS porte sa propre instance `.akoris/`, conformément au principe de self-hosting exposé dans [le README](../README.md) et la FAQ Q18. Ce document est le cahier de suivi de cette instance : il décrit l'état courant réel, sans extrapoler un historique qui n'existe pas encore.

---

## 2. Manifest (état réel vérifié)

Fichier : `.akoris/manifest.json`

| Champ | Valeur | Signification |
|---|---|---|
| `projectName` | `AKORIS` | Le projet gouverné est AKORIS lui-même |
| `projectId` | `akoris-self` | Identifiant d'instance |
| `akorisVersion` | `1.0.1` | Version de la méthode appliquée |
| `registryPath` | `./registry/` | Référentiel de gouvernance local |
| `agents` | `CORE-01, DEV-01, QA-01, EXP-01, GOV-01` | Les 5 domaines, un agent représentatif chacun |
| `domain` | `methodology` | Domaine de l'instance |
| `createdAt` / `updatedAt` | `2026-09-04` / `2026-09-04` | Création (aucune mise à jour à ce jour) |

---

## 3. État courant (état réel vérifié)

Fichier : `.akoris/state.json`

```json
{
  "currentState": "PROPOSITION",
  "history": [],
  "lastTransition": null
}
```

- **État courant** : `PROPOSITION` — l'état initial de la machine à états (`registry/state-machine.json`).
- **Historique des transitions** : **vide**. Aucune transition n'a encore été enregistrée.
- **Dernière transition** : `null`.

> **Lecture honnête** : l'instance est à son tout premier état. Ce document capture un **instantané en cours**, pas un cycle de vie abouti. La section « Résultats » d'une étude de cas conclue n'a donc pas de sens à ce stade.

---

## 4. Pourquoi `PROPOSITION` et pas plus ?

L'instance porte une **proposition** (la méthode elle-même, sa gouvernance et sa spécification), mais le passage `PROPOSITION → DRAFT` exige un `QG-PROPOSITION` `PASS` (voir `registry/state-machine.json`). Le dépôt est en état de spécification ; les transitions futures seront enregistrées ici et dans `state.json` quand elles surviendront par le moteur.

---

## 5. Ce qui est vérifiable dès maintenant

| Élément | Vérifiable | Source |
|---|---|---|
| Machine à états normée | Oui (11 états) | `registry/state-machine.json` |
| Validation du Registry | Oui (139 fichiers JSON valides, exit 0) | `pnpm validate:registry` |
| Glossaire normatif | Oui (60+ entrées) | `constitution/03_TERMINOLOGY.md` |
| Maquette d'instance | Oui | `.akoris/manifest.json`, `.akoris/state.json` |

---

## 6. Suivi

Ce document, `state.json` et `manifest.json` seront mis à jour lors de la première transition d'état réelle (première exécution du moteur de validation du cycle de vie). Jusque-là, cet instantané reflète fidèlement l'état observé au jour de rédaction.

---

**Voir aussi** : [Machine à états — exemple annoté](state-machine-annotated.md) · [État réel de la machine à états](../../registry/state-machine.json)