# Avant / Après AKORIS — Cas concret

> *Exemple illustratif (scénario type, non issu d'un projet réel documenté).*

---

## Contexte

Une équipe de développement de 5 développeurs + 1 IA (Claude Code) construisait une **API de gestion de clients** pour une PME.

**Problème initial :** L'équipe livrait vite, mais :

- Les décisions d'architecture étaient oubliées.
- Les tests étaient écrits après (ou pas du tout).
- Aucune traçabilité des choix.
- L'IA générait du code incohérent avec l'architecture décidée.
- Le schéma de base de données a changé 4 fois sans justification.

---

## Avant AKORIS

### Projet

```text
Semaine 1 : Sprint 1
  - Product Owner : "On veut une API pour gérer les clients."
  - Dev + IA : Implémentation rapide
  - Pas d'ADR, pas de spec formelle
  - Tests écrits à l'arrache

Semaine 3 : Sprint 2
  - Nouvelle feature : "Gérer les contacts associés"
  - Schema DB modifié
  - L'IA propose une refonte de l'API
  - Décision prise sans documentation

Semaine 5 : Sprint 3
  - 3 bugs critiques
  - Personne ne sait pourquoi le schéma DB a changé
  - L'équipe refactorise une partie de l'API
  - Absence de traçabilité
```

### Conséquences

| Problème | Impact |
|---|---|
| Décisions non documentées | 3 heures perdues par personne |
| Code IA incohérent | 2 jours de refactoring |
| Schéma DB modifié 4 fois | 12 heures de migration |
| Aucune traçabilité | 4 incidents de production évitables |

---

## Après AKORIS

### Projet

```text
Sprint 1 : Planification
  - akoris init
  - ADR : "API REST vs GraphQL" (approuvé)
  - Proposition : "API de gestion de clients"
  - State : PROPOSITION

Sprint 2 : Draft
  - Architecture validée (CORE-02)
  - Contrat API (DEV-03)
  - Modèle de données (CORE-04)
  - Transition : PROPOSITION → DRAFT

Sprint 3 : Développement
  - IMPLEMENTATION (ACTIVE)
  - L'IA génère du code conforme aux contrats
  - Tests automatisés (QA-02)
  - Couverture > 80%

Sprint 4 : Audit
  - Quality Gate : QG-AUDIT (sécurité, performance, doc)
  - Décision : PASS (QA-03, QA-04, QA-06)
  - Transition : ACTIVE → AUDIT

Sprint 5 : Release
  - Decision Gate humain : GO (SUPERVISEUR)
  - Transition : VALIDATED → RELEASED
  - Capitalisation : Post-mortem (GOV-03)
  - Transition : RELEASED → ARCHIVED
```

### Résultats

| Succès | Impact |
|---|---|
| 2 ADR validés, tracés | Décisions justifiées |
| Code IA conforme | 0 refactoring post-déploiement |
| Schéma DB stable | 0 migration après validation |
| Traçabilité complète | 0 incident de production |

---

## Conclusion

| Avant AKORIS | Après AKORIS |
|---|---|
| Code IA chaotique | Code IA gouverné |
| Décisions oubliées | Décisions tracées (ADR) |
| Dette technique invisible | Dette identifiée (QA-07) |
| Validation humaine approximative | Decision Gate explicite |
| Connaissance perdue | Connaissance capitalisée |

**Le même projet, 4 semaines, une équipe de 5 développeurs + 1 IA — la gouvernance change tout.**