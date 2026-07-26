# Machine à états AKORIS

La machine à états gouverne le cycle de vie du projet à travers 7 états et 8 transitions validées par des Quality Gates.

---

## États

| État | Description |
|------|-------------|
| **Draft** | Projet en définition. Aucune décision architecturale figée. |
| **Planned** | Architecture et ADRs définis. Backlog priorisé. |
| **Active** | Développement en cours. Agents activés selon les événements. |
| **Audit** | Révision complète des livrables. Quality Gates obligatoires. |
| **Released** | Livraison prête. Déploiement possible. |
| **Archived** | Projet terminé. Accès en lecture seule. |

## Transitions

| From | To | Gates | Autorisation |
|------|----|-------|-------------|
| Draft | Planned | ADR validés, Architecture définie, Backlog priorisé | CORE-02 |
| Planned | Active | Architecture approuvée, Contrats signés, Plan de test validé | CORE-03 |
| Active | Audit | Tests passés, Documentation à jour, Métriques conformes | GOV-02 |
| Active | Released | — | CORE-07 |
| Audit | Released | Audit passé, Dettes documentées, Sécurité vérifiée | CORE-08 |
| Audit | Active | Corrections demandées | CORE-01 |
| Released | Archived | Projet livré, Documentation finalisée, Aucune dette critique | CORE-01 |
| Released | Active | Réouverture des dev | CORE-01 |

## Fichier d'état

L'état courant est persistant dans `.akoris/state.json` :

```json
{
  "current": "Planned",
  "history": [
    { "state": "Draft", "enteredAt": "2026-07-26T03:45:00.000Z", "exitedAt": "2026-07-26T04:05:00.000Z" },
    { "state": "Planned", "enteredAt": "2026-07-26T04:05:00.000Z", "exitedAt": null }
  ]
}
```

## Commande CLI

```bash
akoris state show                    # État courant + transitions possibles
akoris state history                 # Historique complet
akoris state transition --from Draft --to Planned
akoris state export                  # Rapport texte
akoris state export --format markdown --output rapport.md
akoris state export --json           # JSON structuré
```

## Service

```typescript
const engine = new StateMachineEngine(reader);
engine.getCurrentState();     // → "Planned"
engine.canTransition(from, to); // → { allowed: boolean }
engine.transition(from, to);    // → { success, message, gates }
engine.exportReport('markdown'); // → string
```

## Règle de gouvernance

Une transition n'est possible que si :
1. Elle est définie dans la machine à états
2. L'état courant correspond à `from`
3. Les Quality Gates associés sont validés (vérifiés par `quality check`)
