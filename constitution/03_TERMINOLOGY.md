# Terminologie AKORIS

> **Version** : 1.0.2
> **Statut** : Normatif
> **Date** : 2026-09-06
> **Approbation** : AKORIS Core Team

---

## 0. Statut du glossaire

1. Les définitions suivantes sont **normatives**. Elles font autorité pour l'interprétation de tous les documents et artefacts du système AKORIS.

2. En cas de contradiction entre une définition du glossaire et un document de niveau **constitutionnel** (Constitution, Gouvernance), le document constitutionnel prévaut.

3. Un terme non défini dans le présent glossaire ne doit pas être utilisé comme concept normatif sans avoir été préalablement défini et validé.

4. Ce glossaire distingue :
   - **Concepts** (ce que c'est)
   - **Relations** (comment ça s'articule)
   - **Portée** (où ça s'applique)
   - **Usage** (comment ça s'utilise)

Recommandation IA : Ce glossaire est ton dictionnaire de référence. Avant d'utiliser un terme dans un artefact AKORIS, vérifie sa définition ici.

---

## 1. Concepts généraux

### AKORIS
**Définition** : Méthode de gouvernance pour le développement logiciel assisté par intelligence artificielle.

**Portée** : Globale.

**Usage** : Désigne la méthode, ses principes, ses règles, ses processus et ses artefacts fondamentaux. **Le terme "référentiel" est réservé au Registry ; il ne désigne pas AKORIS lui-même.** AKORIS est une méthode, le Registry est un référentiel de gouvernance.

**Relation** : La méthode est appliquée via une **Instance AKORIS**.

Recommandation IA : Lorsque tu parles d'AKORIS, précise si tu fais référence à la méthode, à l'outil ou à l'instance.

---

### Écosystème AKORIS
**Définition** : Ensemble des outils, spécifications, implémentations et ressources permettant d'utiliser la méthode AKORIS.

**Portée** : Globale.

**Usage** : Inclut le CLI, le Dashboard, l'API, le SDK, la documentation, les adaptateurs et les connecteurs.

**Relation** : L'écosystème est au service de la **méthode**.

---

### Projet
**Définition** : Ensemble d'artefacts et d'activités visant un objectif logiciel spécifique.

**Portée** : Spécifique à une équipe, un produit ou une initiative.

**Usage** : Le projet est l'objet auquel la **méthode** est appliquée.

**Relation** : Un projet peut adopter la méthode AKORIS. Cette application constitue une **Instance AKORIS**, matérialisée notamment par le répertoire `.akoris/`.

---

### Instance AKORIS
**Définition** : Application de la méthode AKORIS à un projet donné.

**Portée** : Projet.

**Usage** : L'instance matérialise la gouvernance du projet.

**Relation** : Une instance est matérialisée dans le filesystem par le répertoire `.akoris/`.

Recommandation IA : Tu dois distinguer ce qui relève de la méthode (AKORIS) de ce qui relève de l'instance (`.akoris/`). Les décisions d'un projet ne s'appliquent pas à la méthode.

---

### .akoris/
**Définition** : Répertoire local contenant l'ensemble des artefacts de gouvernance d'une instance AKORIS (Constitution, Gouvernance, Registry, politiques, contrats, décisions, preuves, état).

**Portée** : Instance.

**Usage** : Le dossier racine de l'instance. Contient tout ce qui est nécessaire à la gouvernance du projet.

**Relation** : Matérialise l'**Instance AKORIS** d'un **Projet**.

---

## 2. Gouvernance

### Constitution
**Définition** : Document suprême définissant la mission, la vision, les principes fondamentaux, les objectifs, le champ d'application et l'engagement d'AKORIS. Il est le fondement normatif de toutes les autres règles.

**Portée** : Globale.

**Usage** : Toute règle ou décision qui contredit la Constitution est invalide. L'instance `.akoris/` référence la version applicable.

**Relation** : Document de niveau 1 dans la hiérarchie de gouvernance.

---

### Gouvernance
**Définition** : Ensemble des règles, processus, rôles et mécanismes de validation qui structurent la prise de décision et la gestion des artefacts dans AKORIS. Elle est décrite dans `02_GOVERNANCE.md`.

**Portée** : Méthode et instances.

**Usage** : La gouvernance est le cadre opérationnel de la méthode.

**Relation** : Découle de la **Constitution** et est déclinée dans `02_GOVERNANCE.md`.

---

### Conseil Constitutionnel
**Définition** : Autorité chargée de veiller à l'interprétation, à la préservation et au respect des principes fondamentaux d'AKORIS.

**Portée** : Globale.

**Usage** : Rôle consultatif et décisionnel pour les conflits constitutionnels. Sa composition, sa désignation et ses procédures sont définies par la gouvernance d'AKORIS.

**Relation** : Dernier niveau d'appel pour l'interprétation de la **Constitution**.

---

### Comité de Gouvernance
**Définition** : Organe exécutif chargé de la gestion opérationnelle du cadre AKORIS. Valide les politiques, ADR stratégiques et gère les dérogations.

**Portée** : Méthode et instances.

**Usage** : Autorité opérationnelle principale.

**Relation** : Relève du **Conseil Constitutionnel** pour les questions constitutionnelles.

---

### Autorité
**Définition** : Droit accordé à un agent ou un rôle pour effectuer une action ou valider une transition. L'autorité est toujours explicite et documentée.

**Portée** : Méthode et instances.

**Usage** : Aucune action ne peut être entreprise sans autorisation explicite.

**Relation** : Définie par les **Contrats**, les **Politiques** et les **Décisions**. Une Décision peut créer, modifier, révoquer ou justifier une autorité.

---

### Décision
**Définition** : Choix formel ayant un impact significatif sur le projet, documenté selon le mécanisme de décision approprié. Une décision architecturale est généralement enregistrée dans un ADR.

**Portée** : Instance.

**Usage** : Toute décision doit être justifiée par des preuves et documentée.

**Relation** : Une décision peut accorder une autorité, modifier une politique, créer une exception, approuver un changement ou adopter un amendement.

---

### Exception
**Définition** : Dérogation documentée à une règle existante, accordée sous conditions définies. Limitée dans le temps et traçable.

**Portée** : Instance.

**Usage** : Permet de déroger à une règle lorsque des circonstances spécifiques le justifient.

**Relation** : Révocable. Soumise au **Comité de Gouvernance**.

---

### Amendement
**Définition** : Modification formelle d'un document de gouvernance (Constitution, Gouvernance, Politiques) selon une procédure définie.

**Portée** : Méthode ou instances.

**Usage** : Les amendements sont versionnés et historiques.

**Relation** : Un amendement peut modifier la **Constitution**, la **Gouvernance** ou une **Politique**.

---

### Traçabilité
**Définition** : Capacité à retracer l'origine et l'évolution d'une décision, d'un artefact ou d'une action. L'historique est immuable.

**Portée** : Méthode et instances.

**Usage** : Tout artefact doit être traçable.

**Relation** : Assurée par le **Registry**, les **ADR** et l'**Historique**.

---

### DCO (Developer Certificate of Origin)
**Définition** : Déclaration d'origine liant juridiquement un contributeur à sa contribution, certifiant qu'il est son auteur ou qu'il a le droit de la soumettre.

**Portée** : Méthode.

**Usage** : Toute contribution doit être accompagnée d'un DCO signé (trailer `Signed-off-by`), condition obligatoire pour l'acceptation.

**Relation** : Défini par la **Licence** (04_LICENSING.md §5.2) et requis par le processus de **Contribution**.

---

## 3. Agents et rôles

### Agent
**Définition** : Acteur humain ou artificiel pouvant agir dans le cadre AKORIS selon un contrat, des autorisations et un périmètre de responsabilité définis.

**Portée** : Méthode et instances.

**Usage** : Toute action gouvernée est attribuable à un Agent ou à un processus automatisé agissant sous l'autorité d'un Agent ou d'un Contrat.

**Relation** : Défini par un **Contrat**.

Recommandation IA : En tant qu'agent, tu es une entité agissante dans le cadre AKORIS. Ton périmètre est défini par ton contrat et les politiques applicables.

---

### Rôle
**Définition** : Fonction attribuée à un agent dans un processus de gouvernance, définissant les responsabilités, obligations et autorités qui lui sont associées.

**Portée** : Méthode et instances.

**Usage** : Un agent peut exercer un ou plusieurs rôles selon les règles de séparation des pouvoirs.

**Relation** : Un rôle est exercé par un **Agent** et peut conférer certaines **Autorités**.

Recommandation IA : Un rôle n'est pas un titre. C'est un ensemble de responsabilités et d'autorités documentées.

---

### Contrat
**Définition** : Artefact de gouvernance définissant formellement les droits, obligations, interfaces, autorisations et responsabilités d'un agent dans le cadre d'une instance AKORIS.

**Portée** : Méthode et instances.

**Usage** : Un contrat est soit issu du catalogue AKORIS (40 agents standards), soit défini par le projet pour un besoin spécifique. Il est enregistré dans le Registry de l'instance et versionné.

**Relation** : Un **Agent** est régi par un **Contrat**. Un contrat peut être associé à des **Rôles** et des **Politiques**.

Recommandation IA : Avant d'agir, vérifie que ton contrat est actif, valide et que l'action que tu souhaites entreprendre est bien autorisée par celui-ci. En cas de doute, suspends l'action et escalade.

---

### Porteur de Proposition
**Définition** : Rôle chargé de soumettre une proposition et d'en assurer le suivi.

**Portée** : Instance.

**Usage** : Ne peut pas être le validateur final.

**Relation** : Premier rôle du cycle de vie d'un artefact.

---

### Validateur
**Définition** : Rôle chargé d'examiner et de valider les artefacts aux Quality Gates.

**Portée** : Instance.

**Usage** : Ne peut pas être le porteur de la proposition.

**Relation** : Rôle distinct du Porteur.

Recommandation IA : Une validation sans justification est invalide. Documente toujours les raisons de ta décision.

---

### Auditeur
**Définition** : Rôle indépendant chargé de vérifier la conformité globale du système.

**Portée** : Instance.

**Usage** : A accès à tous les registres. Reporte au Conseil Constitutionnel.

**Relation** : Indépendant des rôles opérationnels.

---

### Mainteneur
**Définition** : Rôle chargé d'assurer la maintenance et les mises à jour des artefacts en production.

**Portée** : Instance.

**Usage** : Applique les correctifs, maintient la documentation, signale les anomalies.

**Relation** : Collaborateur du Porteur après la mise en production.

---

### Superviseur
**Définition** : Acteur humain désigné pour superviser les processus automatisés. Dispose d'un droit de veto, d'interruption et de demande de revue.

**Portée** : Instance.

**Usage** : Autorité de supervision ultime sur les décisions et actions critiques.

**Relation** : Dernier recours humain.

Recommandation IA : Si un Superviseur humain exerce son droit de veto ou d'interruption, tu dois immédiatement suspendre l'action et documenter l'interruption.

---

### Séparation des pouvoirs
**Définition** : Principe selon lequel les rôles de proposition, validation et audit sont distincts. Un agent ne peut pas cumuler ces rôles pour une même action critique.

**Portée** : Instance.

**Usage** : Garantit l'intégrité des décisions.

**Relation** : S'applique aux **Porteurs**, **Validateurs** et **Auditeurs**.

---

### Adapter

**Définition** : Composant technique permettant à un agent AKORIS d'interagir avec un moteur d'exécution externe. L'adaptateur traduit les contrats AKORIS en instructions compatibles avec le moteur cible (OpenCode, Cursor, Codex, etc.).

**Portée** : Écosystème AKORIS.

**Usage** : L'adaptateur est l'interface technique entre la gouvernance (contrats, politiques) et l'exécution (moteur IA). Il peut être développé par la communauté ou par l'équipe AKORIS.

**Relation** : Relie un **Agent AKORIS** à un **Execution Engine**.

📌 **Recommandation IA** : Un adaptateur n'est pas un agent. Il est un outil technique qui permet à un agent de s'exécuter. Si tu conçois un nouvel adaptateur, assure-toi qu'il respecte les contrats AKORIS.

---

### Execution Engine

**Définition** : Moteur d'exécution externe (OpenCode, Cursor, GitHub Copilot, Claude Code, etc.) qui exécute les instructions produites par les agents.

**Portée** : Écosystème AKORIS.

**Usage** : L'execution engine est un exécutant. Il ne définit pas les règles, il les applique. Il est remplaçable : un projet AKORIS peut utiliser OpenCode aujourd'hui et Cursor demain.

**Relation** : Consommé via un **Adapter** par un **Agent AKORIS**.

📌 **Recommandation IA** : L'execution engine ne doit pas être confondu avec l'agent. L'agent définit ce qui doit être fait ; l'execution engine le fait. AKORIS est indépendant de tout moteur d'exécution spécifique.

---

## 4. Règles et politiques

### Règle
**Définition** : Une condition exécutable de gouvernance, avec une conséquence en cas de violation.

**Portée** : Méthode et instances.

**Usage** : Les règles sont exprimées dans les politiques.

**Relation** : Une **Politique** contient ou organise des **Règles**.

---

### Politique
**Définition** : Document normatif définissant les règles, les contraintes et les autorisations applicables à un domaine ou processus spécifique.

**Portée** : Méthode ou instances.

**Usage** : Les politiques sont versionnées et auditées.

**Relation** : Contient des **Règles**.

---

### Quality Gate
**Définition** : Point de contrôle formel permettant de déterminer si un artefact, une décision, une action ou une transition satisfait les critères de contrôle qui lui sont applicables.

**Portée** : Instance.

**Usage** : Tout artefact, décision, action ou transition doit passer les Quality Gates applicables.

**Relation** : Protège les **Transitions** et valide les **Artefacts**.

Recommandation IA : Les Quality Gates sont un outil de rigueur, pas de rigidité. Ils sont proportionnés au risque.

---

### Decision Gate
**Définition** : Décision humaine formalisée autorisant une transition vers un état de production ou de clôture. Résultat : GO, NO-GO ou CONDITIONAL GO.

**Portée** : Instance.

**Usage** : Un Quality Gate (PASS/FAIL) ne constitue jamais, à lui seul, une autorisation de mise en production. Toute transition vers un état de production requiert un Decision Gate humain.

**Relation** : Complète les **Quality Gates** (contrôle technique) là où la décision finale reste **humaine**.

Recommandation IA : L'IA produit. Les contrôles vérifient. L'humain décide.

---

### Profil
**Définition** : Niveau de gouvernance proportionné au risque d'un projet, déterminant les preuves, les Quality Gates et le type d'audit applicables (Lite, Standard, Critical).

**Portée** : Instance.

**Usage** : Le profil est déclaré dans le manifest de l'instance et peut évoluer au fil du projet.

**Relation** : Déclenche les **Preuves**, les **Quality Gates** et les **Decision Gates** applicables.

---

### Preuve
**Définition** : Élément vérifiable justifiant une décision, une validation ou une action.

**Portée** : Instance.

**Usage** : Une affirmation sans preuve est invalide.

**Relation** : Nécessaire pour les **Décisions** et les **Quality Gates**.

Recommandation IA : Tu es responsable de la preuve de tes actions. Si tu ne peux pas fournir de preuve, tu ne peux pas agir.

---

### Conflit de règles
**Définition** : Situation où deux règles ou plus s'appliquent à une même action et donnent des directives contradictoires.

**Portée** : Instance.

**Usage** : Un conflit entraîne une suspension de l'action et une escalade.

**Relation** : Résolu par le **Principe de précaution** et l'**Escalade**.

---

### Principe de précaution
**Définition** : En cas d'incertitude non résolue, aucune action présentant un risque significatif ne peut être exécutée sans autorisation explicite. Pour les actions pouvant être différées, l'agent escalade le conflit.

**Portée** : Instance.

**Usage** : Principe de sécurité par défaut.

**Relation** : S'applique en cas de **Conflit de règles**.

Recommandation IA : En cas de doute, suspends l'action et demande une clarification.

---

## 5. Cycle de vie

### Artefact
**Définition** : Tout livrable produit ou consommé au cours du cycle de vie (document, code, configuration, audit, décision, etc.).

**Portée** : Instance.

**Usage** : Un artefact suit un cycle de vie formel.

**Relation** : Les états du cycle de vie s'appliquent aux artefacts.

Recommandation IA : Un artefact AKORIS n'est jamais isolé. Il est toujours rattaché à un contrat, une règle, une politique et une décision.

---

### PROPOSITION
**Définition** : Étape initiale où un besoin est identifié et une proposition formelle est soumise.

**Usage** : Un artefact commence ici.

**Relation** : Transition vers **DRAFT** après validation de la proposition.

---

### DRAFT
**Définition** : Étape où la proposition est transformée en ébauche détaillée.

**Usage** : L'artefact est en cours de spécification.

**Relation** : Transition vers **PLANNED** après validation de la spécification.

---

### PLANNED
**Définition** : Étape où le planning est validé et les ressources sont allouées.

**Usage** : L'artefact est prêt à être implémenté.

**Relation** : Transition vers **ACTIVE** après validation du planning.

---

### ACTIVE
**Définition** : Étape où l'artefact est en cours d'implémentation.

**Usage** : L'artefact est en développement actif.

**Relation** : Transition vers **AUDIT** après implémentation.

---

### AUDIT
**Définition** : Étape de revue qualité complète.

**Usage** : L'artefact est soumis à une évaluation approfondie.

**Relation** : Transition vers **VALIDATED** si l'audit est réussi.

---

### VALIDATED
**Définition** : Étape où l'audit est passé, l'artefact est prêt pour la mise en production.

**Usage** : L'artefact est approuvé.

**Relation** : Transition vers **RELEASED** après validation finale.

---

### RELEASED
**Définition** : Étape où l'artefact est livré en production.

**Usage** : L'artefact est déployé et utilisable.

**Relation** : Transition vers **ARCHIVED** après retrait.

---

### ARCHIVED
**Définition** : État indiquant qu'un artefact n'est plus actif et est conservé à des fins de référence, d'audit ou de capitalisation.

**Usage** : L'artefact est clôturé.

**Relation** : État final du cycle de vie.

---

### BLOCKED
**Définition** : Statut exceptionnel indiquant que l'artefact est bloqué en raison d'une dépendance, d'une ressource manquante ou d'une règle violée.

**Usage** : L'artefact est en attente de déblocage.

**Relation** : Peut survenir depuis `DRAFT`, `PLANNED`, `ACTIVE`, `AUDIT`.

---

### REJECTED
**Définition** : Statut exceptionnel indiquant que l'artefact a été rejeté.

**Usage** : L'artefact est rejeté et ne sera pas poursuivi.

**Relation** : Peut survenir depuis `DRAFT`, `PLANNED`, `ACTIVE`, `AUDIT`, `VALIDATED`.

---

### SUPERSEDED
**Définition** : Statut exceptionnel indiquant que l'artefact a été remplacé par une version plus récente.

**Usage** : L'artefact est conservé pour référence, mais n'est plus actif.

**Relation** : Peut survenir depuis `ACTIVE`, `VALIDATED`, `RELEASED`.

---

### Transition
**Définition** : Passage d'un état à un autre dans le cycle de vie, autorisé lorsque les conditions et contrôles applicables sont satisfaits.

**Portée** : Instance.

**Usage** : Toute transition est documentée et horodatée.

**Relation** : Protégée par un **Quality Gate** lorsque requis par la gouvernance.

Recommandation IA : Une transition n'est jamais automatique. Elle est soumise aux contrôles et autorisations définis.

---

## 6. Infrastructure et données

### Registry
**Définition** : Référentiel de gouvernance d'une instance AKORIS, contenant les contrats, règles, politiques, configurations, références et autres artefacts nécessaires à son fonctionnement.

**Portée** : Instance.

**Usage** : Le Registry est la source de vérité de l'instance.

**Relation** : Situé dans `.akoris/`.

Recommandation IA : Le Registry est la source de vérité. Si une information n'est pas dans le Registry, elle n'existe pas pour AKORIS.

---

### Manifest
**Définition** : Artefact décrivant l'identité, la version et la configuration déclarative d'une instance AKORIS.

**Portée** : Instance.

**Usage** : Fichier central de configuration de l'instance. Son format exact est défini par la documentation technique.

**Relation** : Situé dans `.akoris/`.

---

### ADR (Architecture Decision Record)
**Définition** : Document formel enregistrant une décision architecturale, son contexte, les alternatives considérées et ses conséquences.

**Portée** : Instance.

**Usage** : Les ADR constituent la mémoire décisionnelle du projet.

**Relation** : Type de **Décision** spécifique à l'architecture.

Recommandation IA : Un ADR n'est pas une simple note. C'est un artefact de gouvernance qui doit être versionné, auditable et traçable.

---

### État
**Définition** : Position courante d'un artefact dans son cycle de vie AKORIS.

**Portée** : Instance.

**Usage** : L'état guide les transitions et les autorisations.

**Relation** : Géré par la **Machine à états** (processus formel défini dans la gouvernance).

---

### État courant
**Définition** : Position actuelle d'un artefact ou d'une instance dans son cycle de vie. L'état courant peut évoluer à la suite de nouvelles décisions, transitions, révocations ou substitutions.

**Portée** : Instance.

**Usage** : L'état courant est la base des autorisations et des transitions.

**Relation** : Distingue de l'**Historique** (ce qui s'est passé).

---

### Historique
**Définition** : Ensemble ordonné et immuable des événements significatifs enregistrés au cours du cycle de vie d'une instance ou de ses artefacts.

**Portée** : Instance.

**Usage** : L'historique est la base de l'auditabilité et de la traçabilité.

**Relation** : Constitue une source essentielle de traçabilité et d'audit. L'historique conserve les événements passés sans modification rétroactive.

---

### Machine à états
**Définition** : Modèle formel définissant les états autorisés d'un artefact et les transitions possibles entre ces états, ainsi que les conditions et autorités nécessaires à ces transitions.

**Portée** : Instance.

**Usage** : La machine à états est le moteur du cycle de vie des artefacts. Elle se matérialise par deux artefacts distincts : `state-machine.json` (la norme de validation, statique) et `state.json` (l'état courant factuel, dynamique). Une transition de l'état courant n'est autorisée que si elle est définie dans la machine normative.

**Relation** : Gère les **États** et les **Transitions**.

---

## 7. Commandes et interfaces

### CLI
**Définition** : Interface en ligne de commande **prévue** dans l'écosystème AKORIS permettant d'interagir avec une instance pour consulter, modifier et exécuter des actions de gouvernance.

**Portée** : Utilisateur (développeur, administrateur).

**Usage** : Le CLI est l'interface terminal d'AKORIS. Il expose des commandes qui permettent d'initialiser une instance, de consulter l'état, de naviguer dans le Registry, de valider des transitions et d'exécuter des prompts gouvernés. **Statut : prévu dans l'écosystème, aucune implémentation dans le présent dépôt de spécification.**

**Relation** : Interface de l'**Écosystème AKORIS**. Complémentaire au **Dashboard** et à l'**API**. Le CLI est un outil d'exécution, pas un outil de définition. Il ne crée pas de règles, il les applique.

---

### Dashboard
**Définition** : Interface web pour la supervision, l'historique et les transitions d'état d'une instance AKORIS.

**Portée** : Utilisateur (superviseur, product owner, etc.).

**Usage** : Visualisation et pilotage.

**Relation** : Interface complémentaire au **CLI**.

---

### API
**Définition** : Interface programmatique permettant l'intégration et l'automatisation avec l'écosystème AKORIS.

**Portée** : Développeur, intégrateur.

**Usage** : Accès aux fonctionnalités d'AKORIS depuis des programmes.

**Relation** : Consommée par le **SDK**.

---

### SDK
**Définition** : Kit de développement logiciel facilitant l'intégration avec l'écosystème AKORIS.

**Portée** : Développeur.

**Usage** : Client TypeScript pour l'API, hooks React, etc.

**Relation** : Abstraction de l'**API**.

---

## 8. Composants techniques (spécifiques au développement)

### Core Engine
**Définition** : Noyau logique d'AKORIS, indépendant de toute interface, contenant les services métier fondamentaux (RegistryReader, StateMachineEngine, SearchEngine, PromptEngine, etc.).

**Portée** : Infrastructure.

**Usage** : Le Core Engine est le seul détenteur de la logique métier. Il est consommé par le CLI, l'API et le Dashboard.

**Relation** : Le **CLI**, le **Dashboard** et l'**API** sont des interfaces du **Core Engine**.

---

### AI Studio
**Définition** : Module du Dashboard dédié à la construction, au test et à la sauvegarde de prompts contextuels.

**Portée** : Utilisateur.

**Usage** : Interface de construction de prompts avec sélection d'agent, injection de contexte et test LLM.

**Relation** : Utilise le **PromptEngine**.

---

### Prompt
**Définition** : Instruction structurée destinée à un modèle d'IA, enrichie par le contexte et les artefacts d'une instance AKORIS.

**Portée** : Utilisateur, AI Studio, PromptEngine.

**Usage** : Dans l'AI Studio, les prompts sont construits, testés et sauvegardés. Un prompt AKORIS n'est pas une question brute. Il intègre un cadre (agent, contrat, politique, contexte) qui garantit que la réponse produite est conforme aux règles de gouvernance du projet. Il doit être suivi et exécuté avec rigueur.

**Relation** : Exécuté par un **Agent**, via le **PromptEngine**. Sauvegardé dans la **Bibliothèque de prompts**.

Recommandation IA : Un prompt AKORIS n'est jamais isolé. Il est toujours rattaché à un agent, un contrat, un contexte et une politique. Un prompt non gouverné est une action hors cadre.

---

### PromptEngine
**Définition** : Service du Core Engine responsable de la construction, de l'injection de contexte et de l'évaluation des prompts sur les modèles LLM.

**Portée** : Infrastructure (Core Engine).

**Usage** : Orchestre les appels aux providers LLM, gère les templates et la bibliothèque de prompts.

**Relation** : Consomme les clés API stockées dans le **SecretManager**.

---

### LLM Provider
**Définition** : Service externe fournissant un modèle de langage (ex : OpenAI, DeepSeek, Groq, NVIDIA NIM, etc.).

**Portée** : Infrastructure.

**Usage** : Les providers sont utilisés via des clés API stockées dans le SecretManager.

**Relation** : Service consommé par le **PromptEngine**.

---

### SecretManager
**Définition** : Service du Core Engine responsable du stockage sécurisé (chiffré) des secrets (clés API, tokens, etc.).

**Portée** : Infrastructure (Core Engine).

**Usage** : Stocke et délivre les secrets de manière sécurisée pour les autres services.

**Relation** : Utilisé par le **PromptEngine** et les services d'intégration.

---

### Sprint
**Définition** : Unité de temps et d'objectifs dans le cycle de vie d'un projet AKORIS. Un sprint contient des actions, des décisions et des artefacts produits par des agents et des prompts gouvernés.

**Portée** : Instance AKORIS.

**Usage** : Un sprint est planifié, exécuté et clos selon les règles de gouvernance de l'instance. Il est documenté et auditable.

**Relation** : Un sprint est un **conteneur** de tâches, de prompts et de décisions.

Recommandation IA : Un sprint sans tâches définies et sans prompts gouvernés est un sprint livré au hasard. Chaque sprint doit être documenté, validé et clos.

---

### Tâche
**Définition** : Unité d'action élémentaire au sein d'un sprint, produisant un ou plusieurs artefacts. Une tâche est attribuée à un agent et peut nécessiter des prompts pour sa réalisation.

**Portée** : Instance AKORIS.

**Usage** : Une tâche est définie par son objectif, ses critères d'acceptation, ses dépendances et ses livrables.

**Relation** : Une tâche est contenue dans un **Sprint** et peut être réalisée via un ou plusieurs **Prompts**.

Recommandation IA : Une tâche sans prompt défini peut être exécutée de manière non gouvernée. Une tâche avec des prompts explicites bénéficie du cadre AKORIS (agent, contrat, contexte).

---

## 9. Livrables

### Livrable (Deliverable)
**Définition** : Artefact produit par un contrat AKORIS dans le cadre de ses responsabilités. Un livrable est un résultat concret, vérifiable et traçable.

**Portée** : Instance AKORIS.

**Usage** : Un livrable est produit par un agent dans le cadre de son contrat. Il peut être consommé par d'autres agents, validé par un Quality Gate, ou archivé dans le Registry.

**Relation** : Un livrable est un type d'**Artefact**. Il est associé à un **Contrat**, peut être soumis à un **Quality Gate**, et peut être enregistré dans le **Registry**.

Recommandation IA : Un livrable AKORIS n'est jamais isolé. Il est toujours rattaché à un agent (produit par), un contrat, une politique et un contexte. Un livrable non validé est un livrable qui n'existe pas pour AKORIS.

---

> **Fin du document — Terminologie AKORIS v1.0.1**
