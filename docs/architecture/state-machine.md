# Machine à états du projet AKORIS

La machine à états modélise le cycle de vie d'un projet AKORIS, de sa création à son archivage. Elle garantit que les transitions entre états sont soumises à des Quality Gates et à des autorisations.

---

## États (7)

| État | Phase | Description |
|------|-------|-------------|
| **DRAFT** | Initialisation | Projet en conception. Architecture, ADR et backlog non finalisés. |
| **PLANNED** | Planification | Architecture validée, ADR approuvés, backlog priorisé. |
| **ACTIVE** | Exécution | Développement en cours, sprints actifs, code produit. |
| **AUDIT** | Validation | Revue qualité complète (sécurité, performances, documentation). |
| **VALIDATED** | Validation | Audit passé, prêt pour la mise en production. |
| **RELEASED** | Livraison | Version livrée en production. |
| **ARCHIVED** | Archivage | Projet clôturé, connaissances capitalisées. |

---

## Transitions (8)

| De | Vers | Gates requis | Autorisation |
|----|------|--------------|--------------|
| DRAFT | PLANNED | ADR validés, Architecture définie, Backlog priorisé | GOV-01 (Project Manager) |
| PLANNED | ACTIVE | Ressources allouées, Environnements prêts, CI/CD configuré | GOV-01, CORE-01 |
| ACTIVE | AUDIT | Feature freeze, Tests rédigés, Documentation préliminaire | CORE-01 |
| AUDIT | VALIDATED | Security OK, Performance OK, Accessibility OK, Documentation OK | GOV-04 (Auditor) |
| VALIDATED | RELEASED | Release approuvée, CI/CD green, CHANGELOG mis à jour | GOV-01, GOV-03 (Compliance) |
| RELEASED | ARCHIVED | Post-mortem réalisé, Connaissances capitalisées, Documentation finalisée | CORE-01 |
| ACTIVE | PLANNED | Repriorisation nécessaire (retour en arrière) | CORE-01 |
| AUDIT | ACTIVE | Correctifs appliqués, Nouvel audit planifié | CORE-01 |

---

## Fichier de persistance : `.akoris/state.json`

```json
{
  "currentState": "ACTIVE",
  "history": [
    {
      "from": "DRAFT",
      "to": "PLANNED",
      "at": "2026-07-26T10:00:00Z",
      "authorizedBy": "GOV-01"
    },
    {
      "from": "PLANNED",
      "to": "ACTIVE",
      "at": "2026-07-27T14:30:00Z",
      "authorizedBy": "GOV-01,CORE-01"
    }
  ],
  "lastTransition": "2026-07-27T14:30:00Z"
}
```

---

## Commandes associées

- `akoris state show` — affiche l'état courant et les transitions possibles.
- `akoris state history` — liste l'historique.
- `akoris state transition --from <état> --to <état>` — exécute une transition (vérifie les gates et les autorisations).
- `akoris state export` — exporte l'état en Markdown/JSON/texte.

---

## Qualité Gates (non encore exécutés automatiquement en v1.3.0)

Les Quality Gates sont définis dans `registry/quality-gates/`. Chaque gate est composé de critères évaluables. La transition n'est autorisée que si tous les gates requis sont `PASS`. Dans les versions futures, l'exécution sera automatisée.

---

**Voir aussi** : [Spécification du Registry](registry-specification.md), [ADR-003](../adr/ADR-003-why-state-machine.md)
