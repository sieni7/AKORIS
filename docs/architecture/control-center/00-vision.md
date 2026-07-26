---
title: "AKORIS Control Center Vision"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "01-system-architecture.md"
  - "ADR-001-control-center.md"
---

# 00 — Vision

## 1. Vision

AKORIS Control Center est la **couche de pilotage et de supervision** du standard de gouvernance AKORIS. Il transforme un CLI puissant mais textuel en une **interface visuelle, interactive et collaborative**.

Il ne remplace pas le CLI ; il le complète en rendant :

- la **santé du projet** visible en un coup d'œil ;
- l'**architecture** (agents, règles, dépendances) navigable ;
- la **gouvernance** (états, transitions, quality gates) exécutable en quelques clics ;
- le **contexte projet** (ADR, logs, décisions) exploitable par les humains et les IA.

Son ambition est de faire du **projet un système vivant**, dont l'état est compris par tous les profils (Tech Lead, Développeur, Release Manager, Product Owner) en moins de 30 secondes.

---

## 2. Problème

Aujourd'hui, AKORIS CLI offre une gouvernance puissante, mais son interface textuelle présente des limites :

| Problème | Conséquence |
|----------|-------------|
| **Visibilité** | Les KPIs (santé, dette, vélocité) sont dispersés dans les logs et les commandes. |
| **Navigation** | Explorer le Registry (33 agents, 69 capacités, 12 règles) est complexe sans interface graphique. |
| **Pilotage** | Exécuter une transition d'état ou lancer un audit nécessite de se souvenir de la syntaxe exacte. |
| **Contexte** | Les ADR, les décisions et les logs ne sont pas reliés visuellement. |
| **Supervision** | Impossible de suivre l'activité en temps réel (logs, événements, déploiements) sans outils externes. |
| **IA** | La génération de prompts ne bénéficie pas d'une interface pour construire et tester le contexte. |

Le Control Center résout ces problèmes en offrant une **vue unifiée, interactive et temps réel** du projet, tout en restant strictement une interface (sans logique métier).

---

## 3. Personas

### 3.1 Tech Lead

- **Objectif** : Assurer la santé globale du projet et anticiper les risques.
- **Frustrations** : Passer du temps à interpréter les logs pour estimer la dette technique.
- **Fonctionnalités principales** : Executive Dashboard (IHG, Vélocité, Dette Technique), Quality Coverage.
- **Indicateur de succès** : Diagnostiquer un problème en moins de 30 secondes.

### 3.2 Développeur

- **Objectif** : Comprendre le système, trouver les bonnes pratiques et générer du code conforme à l'architecture.
- **Frustrations** : Ne pas savoir quel agent activer ni comment construire un prompt efficace.
- **Fonctionnalités principales** : Registry Explorer, Search, AI Studio (Prompts contextualisés), Logs Live.
- **Indicateur de succès** : Trouver un agent ou une règle en moins de 10 secondes.

### 3.3 Release Manager / DevOps

- **Objectif** : Automatiser et sécuriser les livraisons (CI/CD, déploiements, secrets).
- **Frustrations** : Les tokens sont éparpillés ; les déploiements nécessitent de quitter le projet.
- **Fonctionnalités principales** : Secret Vault, Connected Services, Deploy Center, GitHub Actions Viewer.
- **Indicateur de succès** : Lancer un déploiement en 1 clic.

### 3.4 Product Owner

- **Objectif** : Suivre l'avancement du projet et les décisions prises.
- **Frustrations** : Les jalons et les décisions sont noyés dans la documentation technique.
- **Fonctionnalités principales** : Project (State Machine, Milestones, ADR Explorer), Executive (Release Readiness).
- **Indicateur de succès** : Visualiser l'état d'avancement en un coup d'œil.

---

## 4. Principes d'architecture

Ces dix principes guident toutes les décisions de conception et de développement :

1. **Le Core est la seule source de logique métier.** Aucune règle (transition, gate, calcul) n'est dupliquée dans le CLI, l'API ou le Dashboard.
2. **Le CLI reste la source de vérité opérationnelle.** Le Dashboard orchestre mais ne décide jamais ; toute action est déléguée au Core.
3. **Le Dashboard orchestre, il ne décide pas.** Il ne fait qu'appeler des commandes et afficher des résultats.
4. **Toute action est traçable.** Chaque transition, déploiement ou génération de prompt est enregistrée dans les logs ou l'historique.
5. **Toute donnée importante est versionnée.** Les ADR, les prompts sauvegardés, et les décisions sont versionnés.
6. **Les interfaces sont remplaçables.** Le Core étant indépendant, il pourra alimenter un CLI, une TUI, une extension VS Code ou une API distante sans modification.
7. **L'automatisation est privilégiée.** Les tâches répétitives (audits, déploiements) doivent être déclenchables en 1 clic.
8. **Les contrats priment sur les implémentations.** Les API, les WebSockets et le SDK sont définis avant le code.
9. **Les erreurs doivent être exploitables.** Chaque erreur retourne un code, un message et une suggestion d'action.
10. **Le temps réel est utilisé avec parcimonie.** Uniquement là où il apporte une valeur mesurable (logs, notifications, déploiements).

---

## 5. Modules

### 5.1 Executive

- **Mission** : Piloter le projet via des KPIs synthétiques.
- **Responsabilités** : Health Score, Vélocité, Dette Technique, Quality Coverage, Release Readiness.
- **Hors périmètre** : Modification du Registry ou des règles.

### 5.2 Project

- **Mission** : Gérer la gouvernance et le cycle de vie du projet.
- **Responsabilités** : State Machine (états/transitions), Sprint Board, Milestones, ADR Explorer, Backlog Health.
- **Hors périmètre** : Gestion des secrets ou des déploiements (délégué à DevOps).

### 5.3 AI Studio

- **Mission** : Faciliter la génération de prompts IA contextualisés.
- **Responsabilités** : Agent Selector, Context Builder (ADR, Registry, Logs), Prompt Builder, LLM Playground, Prompt Library.
- **Hors périmètre** : Modifier la configuration du projet (Core).

### 5.4 DevOps

- **Mission** : Centraliser les secrets, superviser les services et piloter les déploiements.
- **Responsabilités** : Secret Vault, Connected Services, Deploy Center, GitHub Actions Viewer.
- **Hors périmètre** : Gestion des utilisateurs (projet en local).

### 5.5 Registry Explorer

- **Mission** : Rendre le référentiel de gouvernance (agents, règles, capacités) navigable.
- **Responsabilités** : Arborescence des agents, affichage du contrat, visualisation des dépendances et des événements.
- **Hors périmètre** : Modifier les agents (se fait via le CLI ou le Core).

---

## 6. Principes UX

1. **Action fréquente ≤ 2 clics.** Les commandes courantes (transition, audit, diagnostic) sont accessibles rapidement.
2. **Aucun écran surchargé.** Chaque module présente une information claire et hiérarchisée.
3. **Command Palette accessible partout** (Ctrl+K). C'est le point d'entrée principal pour les utilisateurs avancés.
4. **Recherche omniprésente.** Toute liste (agents, logs, ADR) est filtrable par recherche.
5. **Retour utilisateur immédiat.** Les actions (transition, déploiement) affichent un toast de succès/erreur.
6. **Cohérence visuelle.** Les couleurs, typographies, espacements et composants sont partagés entre tous les modules.

---

## 7. Critères de succès

L'évaluation du produit se fera sur des mesures objectivables :

| Objectif | Cible | Métrique |
|----------|-------|----------|
| Comprendre l'état du projet | < 30 s | Temps pour qu'un Tech Lead interprète le Health Score |
| Déclencher une transition | < 2 clics | Nombre de clics pour passer Draft → Planned |
| Trouver un agent | < 10 s | Temps pour trouver "Database Architect" via recherche |
| Construire un prompt IA | < 2 min | Temps pour générer un prompt contextualisé |
| Lancer un diagnostic | < 1 clic | Accès direct depuis la Command Palette |

---

## 8. Vision long terme

Le Control Center est conçu comme une **plateforme**. Le même Core pourra, à terme, alimenter :

- **CLI** (actuel) — interface textuelle.
- **Dashboard** (ce MVP) — interface web.
- **TUI** (Terminal UI) — interface clavier pour les utilisateurs avancés.
- **Extension VS Code** — intégration directe dans l'IDE.
- **Extension JetBrains** — intégration dans IntelliJ/WebStorm.
- **API distante** — pour les intégrations avec d'autres outils.
- **Version Cloud** — pour les équipes distribuées.

Cette architecture protège l'investissement : le Core est stable, les interfaces sont interchangeables.

---

## 9. Glossaire

| Terme | Définition |
|-------|------------|
| **Core** | Package central contenant toute la logique métier (Registry, State Machine, Search, Prompts, Secrets, etc.). |
| **Registry** | Référentiel de gouvernance : agents, règles, événements, quality gates, livrables, métriques. |
| **Agent** | Rôle logiciel autonome, défini par un contrat (capacités, dépendances, événements). |
| **Quality Gate** | Point de contrôle validant qu'un livrable respecte des critères prédéfinis. |
| **State (Machine)** | Modèle formel des 7 états et 8 transitions du cycle de vie du projet. |
| **Deliverable** | Artefact produit ou consommé par un agent (document, code, configuration, audit). |
| **Prompt** | Instruction structurée envoyée à un LLM, enrichie par le contexte du projet. |
| **Provider** | Service externe intégré (OpenAI, GitHub, Supabase, Vercel, Netlify). |
| **Control Center** | L'ensemble formé par le Dashboard, l'API, le SDK et le Core pour le pilotage. |
| **SDK** | Client TypeScript permettant au Dashboard (et à d'autres apps) de communiquer avec l'API. |
