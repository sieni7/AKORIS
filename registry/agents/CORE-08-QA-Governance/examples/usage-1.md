# Usage Example: Revue qualité pré-release v1.0

## Contexte
Release v1.0 d'une plateforme SaaS e-commerce. 15 agents impliqués (CORE, DEV, QA). La release comprend 8 fonctionnalités, 12 correctifs et 3 évolutions techniques.

## Entrées
- Rapports d'audit de QA-01 (Code Reviewer), QA-02 (Test Automation), QA-03 (Security), QA-04 (Performance), QA-05 (Accessibility), QA-06 (Documentation), QA-07 (Technical Debt).
- Métriques qualité consolidées : couverture de tests 78%, dette technique 5%, vulnérabilités : 1 critique, 3 majeures.
- Plan de release v1.0 fourni par CORE-01.

## Actions CORE-08
1. Vérification de l'état des Quality Gates :
   - QG-01 (Code Review) : vert — 100% des PR revues.
   - QG-02 (Tests) : orange — couverture à 78% (seuil 80%).
   - QG-03 (Sécurité) : rouge — 1 vulnérabilité critique non corrigée.
   - QG-04 (Performance) : vert — tests de charge OK.
   - QG-05 (Accessibilité) : vert — niveau AA atteint.
   - QG-06 (Documentation) : vert — complète.
   - QG-07 (Dette technique) : vert — ratio dette < 10%.
2. Escalade du QG-03 rouge à CORE-01 et CORE-05.
3. Demande de correctif urgent pour la vulnérabilité critique.
4. Plan d'action : correction sous 48h, re-audit par QA-03.
5. Rapport de conformité provisoire : "CONDITIONNEL — blocage sécurité".
6. Mise à jour du tableau de bord qualité.
7. Après correction et re-audit, bascule du QG-03 en vert.
8. Bilan qualité release v1.0 approuvé, transmission à GOV-02.

## Livrables
- `rapport-conformite-v1.0.md` — rapport de conformité pré-release
- `bilan-qualite-v1.0.md` — bilan qualité de fin de release
- `plan-actions-correctives-v1.0.md` — plan d'actions correctives
- Mise à jour du tableau de bord qualité
