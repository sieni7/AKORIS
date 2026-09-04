# Gouvernance d'AKORIS

> **Version** : 1.0.0  
> **Statut** : Normatif  
> **Date** : 2026-09-04  
> **Approbation** : AKORIS Core Team

---

## Préambule

La présente Gouvernance définit les **mécanismes opérationnels** d'AKORIS. Elle est le deuxième document normatif après la Constitution (`01_CONSTITUTION.md`) et s'appuie sur la terminologie définie dans `03_TERMINOLOGY.md`.

Elle décrit :

- Les **autorités** et leur hiérarchie
- Les **rôles** et leurs responsabilités
- Les **mécanismes de décision**
- Le **cycle de vie** des artefacts
- Les **Quality Gates**
- Les **règles et politiques**
- Les **exceptions et dérogations**
- Les **amendements**
- L'**audit et la traçabilité**
- L'**éthique opérationnelle**
- La **gouvernance de l'instance `.akoris/`**

Toute action, décision ou artefact dans AKORIS doit se conformer à cette Gouvernance.

Recommandation IA : Cette Gouvernance est ton cadre opérationnel. Avant d'agir, vérifie toujours que l'autorité, le rôle et le processus sont définis et conformes.

---

## 0. Autorité et hiérarchie

### 0.1. Conseil Constitutionnel

**Définition** : Autorité chargée de veiller à l'interprétation, à la préservation et au respect des principes fondamentaux d'AKORIS (définis dans `01_CONSTITUTION.md`).

**Composition** : 3 à 5 membres, issus des équipes fondatrices ou des mainteneurs historiques. Renouvellement par cooptation.

**Rôle** :
- Interpréter la Constitution en cas de conflit d'opinion.
- Valider les amendements constitutionnels.
- Aucun rôle opérationnel (ne valide pas les décisions quotidiennes).

**Fréquence** : Réunion sur demande (uniquement en cas de conflit d'interprétation). Maximum une fois par trimestre.

**Décisions** : Prise par consensus. En l'absence de consensus, la décision est reportée et documentée pour une revue ultérieure.

**IA dans le Conseil** : Non. Le Conseil est exclusivement humain.

Recommandation IA : Si tu détectes un conflit d'interprétation constitutionnelle, documente-le et escalade-le vers le Conseil. Ne tente pas de trancher un conflit constitutionnel par toi-même.

---

### 0.2. Comité de Gouvernance

**Définition** : Organe exécutif chargé de la gestion opérationnelle du cadre AKORIS.

**Composition** : Représentants des équipes et parties prenantes actives.

**Rôle** :
- Valider les nouvelles politiques et les modifications de politiques existantes.
- Approuver les ADR de niveau stratégique.
- Gérer les demandes de dérogation.
- Superviser le processus d'amélioration continue.
- Nommer les responsables de validation pour les Quality Gates.

Recommandation IA : Le Comité de Gouvernance est ton autorité de référence pour les décisions opérationnelles. Si tu as un doute sur l'application d'une règle, c'est vers lui que tu dois te tourner.

---

### 0.3. Agents et rôles

AKORIS définit un **catalogue de 40 contrats d'agents de référence**. Chaque projet active les agents nécessaires à son contexte dans son Registry.

Les agents peuvent être :
- **Humains** : personnes physiques identifiées et authentifiées.
- **Artificiels** : programmes ou systèmes autonomes autorisés à agir dans le cadre défini.

Recommandation IA : En tant qu'agent artificiel, tu es soumis aux mêmes contrats et autorisations qu'un agent humain. Ton périmètre d'action est défini par ton contrat et les politiques du projet.

---

### 0.4. Hiérarchie des autorités

```
Conseil Constitutionnel
    ↓  (interprète et préserve la Constitution)
Comité de Gouvernance
    ↓  (valide les politiques, ADR, dérogations)
Registres Locaux / Agents
    ↓  (exécutent les actions dans le cadre autorisé)
```

Recommandation IA : Cette hiérarchie est non négociable. Tu ne peux pas court-circuiter un niveau. Toute action non autorisée par le niveau approprié est bloquée ou escaladée.

---

### 0.5. Principe d'autorité explicite

Aucune action ne peut être entreprise sans une **autorisation explicite** documentée dans :
- La Constitution (`01_CONSTITUTION.md`)
- La Gouvernance (le présent document)
- Les politiques (`POL-XXX`)
- Les contrats (`CORE-XXX`, `DEV-XXX`, etc.)
- Les décisions (ADR)

L'autorité n'est jamais implicite.

Recommandation IA : Avant d'agir, vérifie toujours que l'autorité pour cette action existe et est documentée. Si ce n'est pas le cas, tu dois suspendre l'action et demander une clarification.

---

## 1. Rôles et responsabilités

### 1.1. Porteur de Proposition

**Mission** : Soumettre et suivre une proposition jusqu'à sa validation ou son rejet.

**Responsabilités** :
- Rédiger la proposition avec le contexte, la justification et une ébauche de solution.
- Assurer le suivi du cycle de vie.
- Fournir la documentation nécessaire.

**Limites** : Ne peut pas être le validateur final de sa propre proposition.

---

### 1.2. Validateur

**Mission** : Examiner et valider les artefacts aux Quality Gates.

**Règles** :
- Ne peut pas être le même acteur que le Porteur de Proposition.
- Doit fournir une justification écrite pour toute validation ou rejet.

Recommandation IA : Une validation sans justification est invalide. Documente toujours les raisons de ta décision.

---

### 1.3. Auditeur

**Mission** : Rôle indépendant chargé de vérifier la conformité globale.

**Pouvoirs** :
- Accès à tous les registres.
- Reporte directement au Conseil Constitutionnel.
- Peut déclencher des audits inopinés.

**Indépendance** : L'Auditeur exerce son indépendance conformément à la gouvernance applicable et adresse ses rapports à l'autorité de gouvernance compétente.

---

### 1.4. Mainteneur

**Mission** : Assurer la maintenance et les mises à jour des artefacts en production.

**Responsabilités** :
- Appliquer les correctifs documentés.
- Maintenir la documentation à jour.
- Signaler les anomalies.

---

### 1.5. Superviseur

**Mission** : Acteur humain désigné pour superviser les processus automatisés.

**Pouvoirs** :
- Droit de veto.
- Droit d'interruption.
- Droit de demander une revue.

Recommandation IA : Si un Superviseur humain exerce son droit de veto ou d'interruption, tu dois immédiatement suspendre l'action et documenter l'interruption. Tu ne peux pas contourner un veto.

---

### 1.6. Séparation des pouvoirs

**Principe** : Les rôles de proposition, validation et audit sont séparés.

- Un agent ne peut pas être à la fois le porteur d'une proposition et son validateur final.
- Les actions critiques impliquent au moins deux rôles distincts.

**Exception pour les projets à ressources limitées** :
Lorsque la séparation des rôles n'est pas matériellement possible (projet solo, prototype, environnement local) :

1. L'exception est explicitement documentée dans le Registry.
2. Un niveau de contrôle compensatoire est défini (ex : audit différé, revue externe périodique).
3. L'exception est soumise à une révision régulière par le Comité de Gouvernance.

Recommandation IA : Si tu détectes qu'une action critique est soumise à un seul rôle alors que la séparation des pouvoirs est requise, signale-le. L'exception ne peut pas être invoquée sans documentation explicite.

---

## 2. Autorité de décision

### 2.1. Matrice d'autorité

| Nature de la décision | Mécanisme | Autorité compétente |
|---|---|---|
| **Correction mineure** | Autorité du rôle | Responsable désigné |
| **Choix technique** | Décision individuelle | Responsable désigné |
| **Architecture majeure** | Review + validation | Comité de Gouvernance |
| **Sécurité critique** | Validation renforcée | Comité de Gouvernance |
| **Modification constitutionnelle** | Procédure spéciale | Conseil Constitutionnel |
| **Exception majeure** | Approbation explicite | Comité de Gouvernance |

---

### 2.2. Niveaux de risque

| Niveau | Critère | Mécanisme | Autorité |
|---|---|---|---|
| **Faible** | Impact limité, réversible | Décision individuelle | Responsable désigné |
| **Moyen** | Impact modéré, réversible | Validation simple | Validateur |
| **Élevé** | Impact significatif, difficilement réversible | Validation renforcée | Comité de Gouvernance |
| **Critique** | Impact systémique, irréversible | Validation multi-niveaux | Comité de Gouvernance + Conseil Constitutionnel |

---

### 2.3. Consensus

**Utilisation** : Décisions constitutionnelles et modifications majeures.

**Règle** : Accord unanime des participantes et participants.

---

### 2.4. Majorité simple

**Utilisation** : Décisions opérationnelles courantes.

**Règle** : Plus de 50 % des voix.

---

### 2.5. Majorité qualifiée

**Utilisation** : Nouvelles politiques et ADR stratégiques.

**Règle** : Au moins 2/3 des voix.

---

### 2.6. Délégation

**Principe** : Une autorité peut déléguer une décision à un niveau inférieur, à condition que :

1. La délégation soit documentée.
2. Le niveau de risque soit compatible.
3. La délégation soit révocable.

---

### 2.7. Veto / interruption

**Pouvoirs du Superviseur** :
- Veto sur une action en cours.
- Interruption d'un processus automatisé.
- Demande de revue.

**Conséquences** : Toute action faisant l'objet d'un veto est suspendue immédiatement. Une décision de reprise nécessite une validation explicite.

Recommandation IA : Un veto n'est pas une fin en soi. Il te signale qu'une action doit être revue. Documente le veto et les raisons de la suspension.

---

## 3. Cycle de vie

### 3.1. PROPOSITION

Un besoin est identifié. Une Proposition formelle est soumise via le Registre.

**Contenu requis** :
- Contexte
- Justification
- Ébauche de solution

**Transition** : `PROPOSITION → DRAFT` (après validation de la proposition)

---

### 3.2. DRAFT

La Proposition est transformée en ébauche détaillée.

**Contenu requis** :
- Spécifications préliminaires
- Interfaces identifiées
- Critères d'acceptation

**Transition** : `DRAFT → PLANNED` (après validation de la spécification)

---

### 3.3. PLANNED

Le planning est validé. Les ressources sont allouées.

**Contenu requis** :
- Planning détaillé
- Ressources identifiées
- Risques évalués

**Transition** : `PLANNED → ACTIVE` (après validation du planning)

---

### 3.4. ACTIVE

L'artefact est en cours d'implémentation.

**Suivi** :
- Traçabilité des modifications
- Documentation continue
- Rapports d'avancement

**Transition** : `ACTIVE → AUDIT` (après implémentation)

---

### 3.5. AUDIT

Revue qualité complète.

**Contrôles** :
- Sécurité
- Performances
- Documentation
- Conformité

**Transition** : `AUDIT → VALIDATED` (si l'audit est réussi)

---

### 3.6. VALIDATED

Audit passé. Prêt pour la mise en production.

**Exigences** :
- Tous les Quality Gates sont PASS
- Documentation validée
- Approbation du validateur

**Transition** : `VALIDATED → RELEASED` (après validation finale)

---

### 3.7. RELEASED

Version livrée en production.

**Exigences** :
- Approbation formelle
- CHANGELOG mis à jour
- Plan de rollback documenté

**Transition** : `RELEASED → ARCHIVED` (après retrait)

---

### 3.8. ARCHIVED

Artefact clôturé. Connaissances capitalisées.

**Exigences** :
- Post-mortem réalisé
- Documentation finalisée
- Archives conservées

**Transition** : État final.

---

### 3.9. BLOCKED

**Statut** : L'artefact est bloqué en raison d'une dépendance, d'une ressource manquante ou d'une règle violée.

**Peut survenir depuis** : `DRAFT`, `PLANNED`, `ACTIVE`, `AUDIT`

**Action** : Un responsable désigné analyse le blocage et détermine la procédure de déblocage.

**Transitions possibles** : `BLOCKED → ACTIVE` (après déblocage) ou `BLOCKED → REJECTED`

---

### 3.10. REJECTED

**Statut** : L'artefact a été rejeté.

**Peut survenir depuis** : `DRAFT`, `PLANNED`, `ACTIVE`, `AUDIT`, `VALIDATED`

**Action** : La décision de rejet est documentée avec les raisons. Un retour constructif est fourni. Une nouvelle proposition peut être créée si les circonstances ou les conditions ont changé.

**Transition** : `REJECTED → ARCHIVED` (définitif)

---

### 3.11. SUPERSEDED

**Statut** : L'artefact a été remplacé par une version plus récente ou une approche différente.

**Peut survenir depuis** : `ACTIVE`, `VALIDATED`, `RELEASED`

**Action** : La décision de remplacement est documentée. L'ancien artefact est conservé pour référence.

**Transition** : `SUPERSEDED → ARCHIVED` (définitif)

Recommandation IA : Les transitions exceptionnelles sont documentées comme les transitions normales. Elles ne sont pas des échecs, mais des décisions.

---

## 4. Quality Gates

### 4.1. Principe

Chaque transition entre deux étapes du cycle de vie est protégée par un **Quality Gate** lorsque requis par la gouvernance.

Un Quality Gate est un point de contrôle formel permettant de déterminer si un artefact, une décision, une action ou une transition satisfait les critères de contrôle qui lui sont applicables.

Les Quality Gates sont obligatoires lorsqu'ils sont définis comme tels par la gouvernance applicable.

Recommandation IA : Les Quality Gates sont un outil de rigueur, pas de rigidité. Ils sont proportionnés au risque.

---

### 4.2. Critères

Chaque Quality Gate définit :
- **Critères d'entrée** : conditions à remplir pour accéder au gate.
- **Procédures de vérification** : méthodes utilisées pour évaluer la conformité.
- **Critères de sortie** : conditions à remplir pour être validé.

---

### 4.3. Responsabilités

- **Responsable** : Personne ou rôle chargé de la validation (Validateur).
- **Ne peut pas être le porteur** : le validateur ne peut pas être le même que le porteur de la proposition.

---

### 4.4. Preuves

Une affirmation présentée comme vérifiée, une décision ou une validation nécessitant une justification doit être accompagnée des preuves applicables.

**Exemples de preuves** :
- Rapports de test
- Inspections
- Signatures
- Audits

Recommandation IA : Produis les preuves nécessaires à l'audit. Une validation sans preuve est invalide.

---

### 4.5. Échec d'un Quality Gate

**Conséquences** :
- La transition est bloquée.
- Les raisons de l'échec sont documentées.
- Un plan de correction est défini.

**Recours** : Le porteur peut demander une dérogation (voir section 6) ou soumettre une version corrigée.

Recommandation IA : Si un gate échoue, propose un plan de correction clair.

---

### 4.6. Dérogation

Une dérogation est une exception à une règle établie.

**Conditions** :
- Documentée dans une demande formelle.
- Justifiée par un motif valable.
- Soumise au Comité de Gouvernance.
- Limité dans le temps.
- Assortie d'un plan de régularisation.

Recommandation IA : Les dérogations sont exceptionnelles.

---

## 5. Règles et politiques

### 5.1. Hiérarchie des règles

1. **Constitution** (`01_CONSTITUTION.md`) : principes suprêmes
2. **Gouvernance** (ce document) : règles de fonctionnement du système
3. **Politiques** (`POL-XXX`) : règles applicables à un domaine spécifique
4. **Contrats** (`CORE-XXX`, `DEV-XXX`, etc.) : règles applicables à un agent
5. **Règles locales** : règles spécifiques à un projet

Recommandation IA : En cas de conflit, le niveau supérieur prévaut.

---

### 5.2. Versionnement

Toutes les règles et politiques sont versionnées (SemVer).

**Règle** : Une modification d'une politique fait l'objet d'une nouvelle version. L'historique des versions est conservé.

Recommandation IA : Avant d'appliquer une politique, vérifie que tu utilises la version la plus récente.

---

### 5.3. Applicabilité

Chaque règle ou politique définit son champ d'application :
- **Tous les projets** : applicable à l'ensemble des instances.
- **Domaine spécifique** : applicable à un domaine (ex : sécurité, qualité).
- **Projet spécifique** : applicable uniquement à un projet donné.

---

### 5.4. Conflits de règles

Lorsqu'une action est soumise à des règles contradictoires :

1. L'agent suspend l'action.
2. Il enregistre le conflit dans le Registry.
3. Il identifie les règles en conflit.
4. Il applique la règle de niveau hiérarchique supérieur.
5. Si le conflit persiste, il escalade.

Recommandation IA : Ne choisis jamais arbitrairement. Documente le conflit.

---

### 5.5. Résolution des conflits

**Principe de précaution** : En cas d'incertitude non résolue, aucune action présentant un risque significatif ne peut être exécutée sans autorisation explicite. Pour les actions pouvant être différées, l'agent escalade le conflit.

**Mécanisme d'escalade** :
1. L'agent signale le conflit.
2. Un responsable désigné analyse le conflit.
3. La décision de résolution est documentée.
4. La décision est versionnée dans le Registry.

---

### 5.6. Principe de précaution

En l'absence de règle explicite :
- L'agent ne prend pas d'initiative risquée.
- L'agent documente l'absence de règle.
- L'agent escalade vers l'autorité compétente.

Recommandation IA : En cas de doute, suspends l'action et demande une clarification.

---

## 6. Exceptions et dérogations

### 6.1. Conditions

Une exception peut être accordée lorsque :

1. Une règle empêche la réalisation d'un objectif légitime.
2. Le respect de la règle entraîne un préjudice disproportionné.
3. Une situation imprévue nécessite une réponse rapide.

---

### 6.2. Autorisation

- **Niveau faible** : autorisée par le responsable désigné.
- **Niveau élevé** : autorisée par le Comité de Gouvernance.
- **Niveau critique** : autorisée par le Comité de Gouvernance + notification au Conseil Constitutionnel.

---

### 6.3. Durée

Toute exception est limitée dans le temps. Elle doit préciser une date de fin ou une condition de révocation.

---

### 6.4. Traçabilité

Toute exception est :
- Documentée.
- Versionnée.
- Auditable.

Recommandation IA : Une exception sans documentation est une violation.

---

### 6.5. Révocation

Une exception peut être révoquée si :
- Les conditions qui la justifient ne sont plus valables.
- La dérogation a été utilisée de manière abusive.
- Une nouvelle règle rend l'exception caduque.

---

## 7. Amendements

### 7.1. Constitution

**Procédure** : Toute modification de la Constitution nécessite :
1. Une proposition formelle.
2. Un examen par le Conseil Constitutionnel.
3. Une validation par consensus.
4. Une documentation de la modification.

**Limitation** : Les principes fondamentaux (section 3 de `01_CONSTITUTION.md`) ne peuvent être modifiés que par une procédure d'amendement constitutionnel super-majoritaire.

Recommandation IA : La Constitution est le document suprême. Propose des modifications avec une justification détaillée.

---

### 7.2. Governance

**Procédure** : Les modifications de la gouvernance (ce document) suivent la procédure des décisions majeures :
1. Proposition formelle.
2. Revue par les parties prenantes.
3. Validation par le Comité de Gouvernance.

---

### 7.3. Politiques

**Procédure** : Les modifications de politiques suivent la procédure standard :
1. Proposition.
2. Revue.
3. Validation.

---

### 7.4. Procédure générale d'amendement

1. **Proposition** : Un acteur soumet une proposition d'amendement.
2. **Examen** : La proposition est examinée par l'autorité compétente.
3. **Consultation** : Les parties prenantes sont consultées.
4. **Validation** : L'amendement est validé selon les règles de décision.
5. **Documentation** : L'amendement est enregistré et versionné.

---

### 7.5. Historique

Tous les amendements sont conservés dans un historique immuable.

Recommandation IA : L'historique est une ressource précieuse. Consulte-le avant de proposer un nouvel amendement.

---

## 8. Audit et traçabilité

### 8.1. Événements auditables

Sont systématiquement enregistrés pour audit :
- Toutes les transitions d'état.
- Toutes les validations de Quality Gates.
- Toutes les décisions majeures.
- Toutes les exceptions et dérogations.
- Toutes les modifications de politiques.
- Toutes les actions des Superviseurs (veto, interruption).

Recommandation IA : Tes actions sont tracées. Agis comme si tout ce que tu fais était enregistré.

---

### 8.2. Preuves

**Principe** : Toute affirmation, toute décision, toute action doit être étayée par des preuves vérifiables.

**Règles** :
- Toute décision est accompagnée de la référence aux éléments de preuve qui la justifient.
- Les preuves sont conservées dans leur forme originale.
- Une affirmation sans preuve est invalide.
- La charge de la preuve incombe à celui qui émet l'affirmation.

Recommandation IA : Tu es responsable de la preuve de tes actions.

---

### 8.3. Provenance

Toute donnée enregistrée doit indiquer :
- Sa source.
- Sa date de création.
- Son auteur.
- Son contexte.

---

### 8.4. Registry

Le Registry est le référentiel central de l'instance. Il contient :
- Les agents et leurs contrats.
- Les règles et politiques.
- Les décisions.
- Les preuves.
- L'historique des transitions.

Recommandation IA : Le Registry est la source de vérité de l'instance. Si une information n'est pas dans le Registry, elle n'existe pas pour AKORIS.

---

### 8.5. Intégrité historique

L'historique des enregistrements ne peut pas être altéré. Les décisions peuvent être remplacées, révoquées ou supersédées, mais l'historique reste intact.

Recommandation IA : L'historique est immuable. Tu ne peux pas effacer une décision, mais tu peux la corriger par une nouvelle décision.

---

## 9. Éthique opérationnelle

### 9.1. Supervision humaine

L'humain conserve l'autorité de supervision ultime sur les décisions et actions critiques.

- Les décisions critiques nécessitent une validation humaine.
- Un superviseur humain peut interrompre tout processus automatisé.

Recommandation IA : La supervision humaine n'est pas une défiance. C'est une garantie de responsabilité.

---

### 9.2. Sécurité

Toutes les actions doivent respecter les politiques de sécurité :
- Authentification.
- Autorisation.
- Chiffrement des données sensibles.
- Confidentialité.

Recommandation IA : La sécurité est une condition préalable à toute action.

---

### 9.3. Transparence

Les décisions et règles pertinentes sont accessibles aux parties prenantes autorisées. Leur justification peut être vérifiée.

**Transparence ≠ accès universel** : Certaines informations peuvent être protégées pour des raisons de sécurité ou de confidentialité.

Recommandation IA : Sois transparent dans tes actions, mais respecte les limites de confidentialité.

---

### 9.4. Responsabilité

Chaque acteur est responsable de ses actions et de leurs conséquences.

**Mécanismes** :
- Traçabilité des actions.
- Identification claire de tout acteur effectuant une action.
- Mécanismes de contrôle, d'escalade et de correction.

Recommandation IA : Tu es responsable de tes actions. Si tu commets une erreur, documente-la et propose une correction.

---

### 9.5. Escalade

Toute situation anormale, toute ambiguïté ou tout conflit de règles doit être escaladé.

**Niveaux d'escalade** :
1. Responsable direct.
2. Comité de Gouvernance.
3. Conseil Constitutionnel (pour les conflits constitutionnels).

Recommandation IA : L'escalade n'est pas un échec. C'est une procédure normale.

---

## 10. Gouvernance de l'instance `.akoris/`

### 10.1. Initialisation

Un projet adopte AKORIS en initialisant une instance :

```bash
akoris init [nom-du-projet]
```

Cette commande crée la structure minimale :
- `.akoris/` avec sous-dossiers.
- `manifest.json` (identité du projet).
- `state.json` (état initial : `PROPOSITION`).
- `.gitignore` avec exclusion des secrets.

Recommandation IA : L'initialisation est la première décision de gouvernance. Prends-la au sérieux.

---

### 10.2. Configuration

L'instance est configurée via :
- Le `manifest.json` : identité du projet, agents activés, domaine.
- Les politiques : règles applicables au projet.
- Le Registry : contrats, règles, décisions.

Recommandation IA : La configuration est un processus continu.

---

### 10.3. Registry

Le Registry de l'instance contient :
- Les agents activés (parmi les 40 de référence).
- Les contrats des agents.
- Les règles et politiques.
- Les décisions (ADR).
- Les preuves.
- L'historique des transitions.

Recommandation IA : Le Registry est le cœur de l'instance. Il doit être maintenu à jour et auditable.

---

### 10.4. Activation des agents

Chaque projet active les agents nécessaires à son contexte.

**Procédure** :
1. Sélection des agents dans le catalogue de référence.
2. Activation dans le Registry.
3. Documentation des choix.

Recommandation IA : Les agents activés définissent le périmètre de gouvernance du projet. Choisis-les en fonction des besoins réels.

---

### 10.5. Évolution de l'instance

L'instance évolue avec le projet :
- Ajout de nouveaux agents.
- Modification des politiques.
- Ajout de décisions.
- Mise à jour des contrats.

Recommandation IA : L'évolution est documentée et versionnée. Chaque modification est une décision de gouvernance.

---

**AKORIS est une méthode de gouvernance. L'instance `.akoris/` est son application concrète.**

---

> **Fin du document — Gouvernance d'AKORIS v1.0.0**
