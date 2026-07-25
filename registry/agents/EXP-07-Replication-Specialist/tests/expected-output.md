# Expected Output — EXP-07 Replication Specialist

## Scenario 01 — Création d'un nouveau projet

| Step | Output |
|------|--------|
| 1 | Template `microservice-nodejs` v1.0 sélectionné |
| 2 | Scaffold CLI exécuté : `akoris init microservice mon-projet` |
| 3 | Structure générée : 12 dossiers, 24 fichiers, CI/CD YAML |
| 4 | `akoris verify` : 100% tests reproductibilité passés |
| 5 | Écarts : aucun |
| 6 | Livraison à CORE-01 via artifact registry |

**Temps:** 22 min (objectif > 50% réduction ✓)  
**Adoption:** Template prêt pour nouveau projet

## Scenario 02 — Mise à jour d'un template

| Step | Output |
|------|--------|
| 1 | RETEX analysé : ajout health check `/health` |
| 2 | Template modifié : `src/health.ts`, `k8s/probe.yaml` |
| 3 | Scaffold CLI mis à jour : nouvelle option `--health` |
| 4 | Test pilote : projet `pilote-health-01` OK |
| 5 | Template publié : `microservice-nodejs` v1.1 |
| 6 | Notifications : GOV-01 (alignement), CORE-01 (disponible) |

**Temps de mise à jour:** 4h (objectif < 1 jour ✓)  
**Reproductibilité:** 100% sur le pilote
