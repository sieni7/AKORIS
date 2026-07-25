# Quality Gates — DEV-02 : Backend Architect

## Gate 1 : QG-DEV02-01 — Validation d'architecture backend
- **ID**: QG-DEV02-01
- **Name**: Validation d'architecture backend
- **Description**: Vérifie que l'architecture proposée respecte les contraintes et standards du projet
- **Criteria**:
  - Découpage en services cohérent et justifié
  - Patterns d'intégration documentés
  - Choix techniques validés avec CORE-01
  - Diagramme de déploiement produit
- **Severity**: BLOCKER

## Gate 2 : QG-DEV02-02 — Performance backend
- **ID**: QG-DEV02-02
- **Name**: Performance backend
- **Description**: Valide les métriques de performance des services
- **Criteria**:
  - Temps de réponse p95 < 500ms
  - Throughput cible atteignable
  - Stratégie de caching définie
  - Scalabilité démontrée
- **Severity**: MAJOR

## Gate 3 : QG-DEV02-03 — Tests d'intégration
- **ID**: QG-DEV02-03
- **Name**: Tests d'intégration
- **Description**: Valide la couverture de tests d'intégration
- **Criteria**:
  - Tests d'intégration pour chaque service
  - Couverture > 70% des cas d'intégration
  - Tests de charge planifiés
  - CI/CD avec tests automatisés
- **Severity**: MAJOR

## Gate 4 : QG-DEV02-04 — Qualité du code backend
- **ID**: QG-DEV02-04
- **Name**: Qualité du code backend
- **Description**: Vérifie la conformité aux standards de code
- **Criteria**:
  - Linting sans erreur
  - Code coverage > 80%
  - Pas de code mort ou de TODOs non traités
  - Documentation technique à jour
- **Severity**: MINOR
