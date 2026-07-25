# Usage Example 1 – Orchestrator : Transition de phase avec conflit

## Contexte
Le projet AKORIS Platform est en fin de phase de **Conception**. CORE-02 (Solution Architect) et DEV-01 (Frontend Architect) sont en désaccord sur le choix du framework frontend (React vs Vue). CORE-01 est activé pour arbitrer.

## Entrées reçues

### Positions des agents
**CORE-02** préconise React pour sa maturité et son écosystème.
**DEV-01** préfère Vue pour sa courbe d'apprentissage rapide et sa flexibilité.

### Statuts des agents
| Agent | Statut |
|-------|--------|
| CORE-02 | En attente |
| DEV-01 | Bloqué |
| DEV-02 | Terminé |
| CORE-04 | Terminé |

## Traitement par l'Orchestrator

1. **Analyse du conflit** : L'Orchestrator consulte les ADR existants, le contexte technique et les contraintes de délai.
2. **Consultation** : Il demande un avis technique à DEV-02 (Backend) et QA-01 (Code Reviewer) pour éclairer la décision.
3. **Arbitrage** : Après analyse, il tranche en faveur de React, motivé par la compatibilité avec l'architecture existante et la disponibilité des compétences dans l'équipe.
4. **Notification** : La décision est notifiée à CORE-02, DEV-01 et DEV-02.
5. **Vérification des critères de sortie** : Tous les critères de la phase Conception sont vérifiés :
   - ADR validés ✅
   - Schéma de données approuvé ✅
   - Architecture documentée ✅
   - Conflit résolu ✅
6. **Validation de phase** : L'Orchestrator émet le feu vert pour la transition vers la phase **Développement**.

## Livrable produit
```markdown
## Décision d'arbitrage – CORE-01

**Conflit :** Choix du framework frontend
**Agents concernés :** CORE-02, DEV-01
**Décision :** Adoption de React 18+
**Justification :** Compatibilité avec l'architecture existante,
écosystème mature, compétences disponibles dans l'équipe,
meilleure intégration avec les outils de test QA-01.
**Date :** 2026-07-25
**Diffusé à :** CORE-02, DEV-01, DEV-02, QA-01

## Validation de phase – Conception → Développement

**Critères de sortie :**
- [x] ADR validés
- [x] Architecture documentée
- [x] Schéma de données approuvé
- [x] Conflits résolus
**Décision :** ✅ Transition approuvée
```
