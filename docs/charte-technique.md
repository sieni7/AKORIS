# AKORIS — Charte Technique

> Document de référence définissant les règles, les agents et le cycle de vie formel de la méthode AKORIS.

---

## 1. Constitution

### 1.1 Règles immuables

1. L'architecture précède toujours le développement.
2. Chaque agent possède un périmètre de responsabilité exclusif.
3. Toute décision structurante est documentée sous forme d'ADR.
4. Aucun développement n'est réalisé sans contexte projet.
5. Chaque sprint fait l'objet d'un audit indépendant.
6. La qualité prévaut sur la rapidité d'exécution.
7. La dette technique est traitée dès son apparition.
8. Les composants sont conçus pour être réutilisables.
9. Les connaissances sont capitalisées tout au long du projet.
10. La méthode reste indépendante des outils, des technologies et des moteurs d'exécution.

### 1.2 Règle d'orchestration

> **Aucun agent ne peut intervenir en dehors de son périmètre de responsabilité.**

### 1.3 Règle de validation humaine

> **Aucun incrément logiciel n'est mis en production sans validation humaine explicite.**

---

## 2. Les agents Core (8 permanents)

| # | Agent | Identifiant | Mission |
|---|-------|-------------|---------|
| 1 | Orchestrator | `akoris_core_orchestrator` | Piloter le cycle de gouvernance |
| 2 | Product Owner | `akoris_core_product_owner` | Définir et prioriser la vision métier |
| 3 | Architect | `akoris_core_architect` | Concevoir et garantir l'architecture |
| 4 | Tech Lead | `akoris_core_tech_lead` | Encadrer l'exécution technique |
| 5 | Data & Storage | `akoris_core_data_storage` | Modéliser et gérer les données |
| 6 | Security Officer | `akoris_core_security` | Garantir la sécurité du projet |
| 7 | QA Auditor | `akoris_core_qa_auditor` | Auditer la qualité en lecture seule |
| 8 | Agent Manager | `akoris_core_agent_manager` | Gérer le cycle de vie des agents |

## 3. Les agents Expert (25 spécialisés)

### Frontend (5)

| # | Agent | Identifiant | Activation |
|---|-------|-------------|-----------|
| 1 | React Specialist | `akoris_expert_react` | Stack React |
| 2 | Next.js Specialist | `akoris_expert_nextjs` | Stack Next.js |
| 3 | Vue/Nuxt Specialist | `akoris_expert_vue_nuxt` | Stack Vue |
| 4 | Mobile Specialist | `akoris_expert_mobile` | App mobile |
| 5 | UI/Tailwind Specialist | `akoris_expert_ui_tailwind` | Design system |

### Backend (6)

| # | Agent | Identifiant | Activation |
|---|-------|-------------|-----------|
| 6 | Node.js/Express Specialist | `akoris_expert_nodejs_express` | Stack Node |
| 7 | Python Specialist | `akoris_expert_python` | Stack Python |
| 8 | Laravel/PHP Specialist | `akoris_expert_laravel_php` | Stack Laravel |
| 9 | Spring Boot/Java Specialist | `akoris_expert_spring_java` | Stack Java |
| 10 | .NET/C# Specialist | `akoris_expert_dotnet_csharp` | Stack .NET |
| 11 | Go/Rust Specialist | `akoris_expert_go_rust` | Haute performance |

### API & Intégration (3)

| # | Agent | Identifiant | Activation |
|---|-------|-------------|-----------|
| 12 | API Design Specialist | `akoris_expert_api_design` | API publique |
| 13 | Third-Party Integration Specialist | `akoris_expert_integration` | Intégrations externes |
| 14 | Real-Time Specialist | `akoris_expert_realtime` | Temps réel |

### Base de données (4)

| # | Agent | Identifiant | Activation |
|---|-------|-------------|-----------|
| 15 | PostgreSQL Specialist | `akoris_expert_postgresql` | Base relationnelle |
| 16 | Supabase/Firebase Specialist | `akoris_expert_supabase_firebase` | BaaS |
| 17 | NoSQL Specialist | `akoris_expert_nosql` | Base non-relationnelle |
| 18 | Data Migration Specialist | `akoris_expert_data_migration` | Migration |

### DevOps & Infrastructure (5)

| # | Agent | Identifiant | Activation |
|---|-------|-------------|-----------|
| 19 | Docker/Container Specialist | `akoris_expert_docker` | Conteneurisation |
| 20 | CI/CD Specialist | `akoris_expert_cicd` | Automatisation |
| 21 | Cloud Specialist | `akoris_expert_cloud` | Hébergement cloud |
| 22 | Serverless Specialist | `akoris_expert_serverless` | Architecture serverless |
| 23 | Monitoring/Observability Specialist | `akoris_expert_monitoring` | Production |

### Qualité & Conformité (2)

| # | Agent | Identifiant | Activation |
|---|-------|-------------|-----------|
| 24 | Testing Specialist | `akoris_expert_testing` | Tests |
| 25 | Accessibility & Compliance Specialist | `akoris_expert_accessibility` | Accessibilité |

---

## 4. Contrat d'Agent (template)

Chaque agent mobilisé par AKORIS possède une fiche de mission formelle :

```text
┌─────────────────────────────────────────────────────────────┐
│                      CONTRAT D'AGENT                       │
├─────────────────────────────────────────────────────────────┤
│  Identité         │  Nom, rôle, niveau                     │
│  Mission          │  Objectif principal                    │
│  Responsabilités  │  Périmètre d'intervention              │
│  Entrées          │  Données et documents requis           │
│  Sorties          │  Livrables attendus                    │
│  Critères de      │  Conditions de validation              │
│  validation       │                                        │
│  Interdictions    │  Actions prohibées                     │
│  Escalade         │  Procédure en cas de doute             │
│  Livrables        │  Documents produits                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Quality Gates

Un sprint n'est validé que lorsque les critères suivants sont satisfaits :

| Gate | Vérification |
| --- | --- |
| **Architecture** | Conforme aux spécifications et aux bonnes pratiques |
| **Documentation** | À jour et complète |
| **Tests** | Validés avec couverture satisfaisante |
| **Audit** | Rapport d'audit favorable |
| **Dette technique** | Niveau acceptable et documenté |
| **Sécurité** | Validée selon les standards applicables |
| **ADR** | Décisions d'architecture mises à jour |

---

## 6. Matrice RACI

| Phase | Orchestrator | PO | Architect | Tech Lead | Expert(s) | QA Auditor | Agent Manager |
|-------|--------------|----|-----------|-----------|-----------|------------|---------------|
| Vision | R | A | C | C | I | I | I |
| Initialisation | R | A | C | C | I | I | C |
| Planification | R | A | C | C | C | I | I |
| Activation | R | I | C | C | C | I | C |
| Développement | I | I | C | R | R | I | I |
| Audit | I | I | I | I | I | R | I |
| Validation | R | A | C | C | I | C | I |
| Release | R | C | C | C | I | I | I |
| Capitalisation | R | C | C | I | I | I | C |

*R = Responsable, A = Approbateur, C = Consulté, I = Informé*

---

## 7. Cycle de gouvernance (vue formelle)

```text
                    ┌─────────────────┐
                    │     Vision      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Initialisation  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Planification  │
                    └────────┬────────┘
                             │
                             ▼
               ┌─────────────────────────┐
               │   Activation des agents │
               └────────┬────────────────┘
                        │
                        ▼
          ┌───────────────────────────────┐
          │     Boucle de développement   │
          │  ┌────────┐ ┌────────┐ ┌───┐  │
          │  │Développ│→│ Audit  │→│QG │  │
          │  └────────┘ └────────┘ └───┘  │
          └────────┬──────────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   Validation    │ ← Humain
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │    Release      │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Capitalisation  │
          └────────┬────────┘
                   │
                   └─────────────► Nouveau cycle
```

---

## 8. Règles d'activation des experts

Les experts sont activés à la demande par l'Orchestrator selon :
- la **stack technologique** du projet (ex: `akoris_expert_react` si le projet est en React)
- la **phase du cycle** (ex: `akoris_expert_cicd` au moment du déploiement)
- un **problème détecté** (ex: un expert monitoring si un audit révèle des lenteurs)
