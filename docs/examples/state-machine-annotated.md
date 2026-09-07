# Machine à états AKORIS — Exemple annoté

Le fichier `registry/state-machine.json` définit le cycle de vie des artefacts dans AKORIS.

---

## Structure générale

```json
{
  "version": "1.0.1",
  "initialState": "PROPOSITION",
  "terminalStates": ["ARCHIVED"],
  "states": [...],
  "transitions": [...],
  "exceptionStates": {...}
}
```

---

## États nominaux

Les 8 états du cycle de vie normal :

| État | Phase | Description |
|---|---|---|
| `PROPOSITION` | Initiation | Besoin identifié, proposition soumise |
| `DRAFT` | Spécification | Proposition transformée en ébauche détaillée |
| `PLANNED` | Planification | Planning validé, ressources allouées |
| `ACTIVE` | Exécution | Artefact en cours d'implémentation |
| `AUDIT` | Contrôle | Revue qualité complète |
| `VALIDATED` | Approbation | Audit passé, prêt pour production |
| `RELEASED` | Production | Livré et déployé |
| `ARCHIVED` | Clôture | Artefact retiré et archivé |

---

## États exceptionnels

| État | Description | Peut survenir depuis |
|---|---|---|
| `BLOCKED` | Artefact bloqué | DRAFT, PLANNED, ACTIVE, AUDIT |
| `REJECTED` | Artefact rejeté | DRAFT, PLANNED, ACTIVE, AUDIT, VALIDATED |
| `SUPERSEDED` | Remplacé | ACTIVE, VALIDATED, RELEASED |

---

## Transitions (exemple)

```json
{
  "from": "PROPOSITION",
  "to": "DRAFT",
  "requires": ["QG-PROPOSITION"],
  "authorizedBy": ["VALIDATOR"],
  "required": true
}
```

| Champ | Description |
|---|---|
| `from` | État de départ |
| `to` | État d'arrivée |
| `requires` | Quality Gates requis (PASS obligatoire) |
| `authorizedBy` | Rôles autorisés à valider la transition |
| `required` | La transition est-elle obligatoire ? |

**Règle :** Une transition n'est autorisée que si tous les `requires` sont `PASS`.

---

## Transitions exceptionnelles (exemple)

```json
"BLOCKED": {
  "from": ["DRAFT", "PLANNED", "ACTIVE", "AUDIT"],
  "to": ["ACTIVE", "REJECTED"]
}
```

`BLOCKED` peut survenir depuis 4 états et aboutir soit à `ACTIVE` (déblocage) soit à `REJECTED`.

---

## 📌 À retenir

- `state-machine.json` est la **norme** — elle définit les règles.
- `state.json` est l'**état courant** — il suit les règles de la machine.
- Une transition illégale est **refusée** par le moteur.

**Voir aussi :** [Gouvernance d'AKORIS](../../constitution/02_GOVERNANCE.md)