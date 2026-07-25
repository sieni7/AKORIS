# Quality Gates — DEV-03 : API Designer

## Gate 1 : QG-DEV03-01 — Validation du contrat API
- **ID**: QG-DEV03-01
- **Name**: Validation du contrat API
- **Description**: Vérifie que la spécification OpenAPI est complète et conforme
- **Criteria**:
  - Spec OpenAPI complète (paths, schemas, responses)
  - Tous les codes d'erreur documentés
  - Security schemes définis
  - Exemples de requêtes/réponses fournis
- **Severity**: BLOCKER

## Gate 2 : QG-DEV03-02 — Rétrocompatibilité
- **ID**: QG-DEV03-02
- **Name**: Rétrocompatibilité
- **Description**: Valide que les changements d'API respectent la politique de versioning
- **Criteria**:
  - Breaking changes identifiés et versionnés
  - Politique de dépréciation respectée
  - Changelog à jour
  - Migration documentée
- **Severity**: BLOCKER

## Gate 3 : QG-DEV03-03 — Tests de contrat
- **ID**: QG-DEV03-03
- **Name**: Tests de contrat
- **Description**: Valide que les tests de contrat sont implémentés et passent
- **Criteria**:
  - Tests de contrat implémentés pour chaque endpoint
  - Tests passent en CI
  - Contrat validé par le fournisseur et le consommateur
- **Severity**: MAJOR

## Gate 4 : QG-DEV03-04 — Documentation API
- **ID**: QG-DEV03-04
- **Name**: Documentation API
- **Description**: Vérifie que la documentation est complète et accessible
- **Criteria**:
  - Documentation générée et publiée
  - Exemples d'appels fonctionnels
  - Guide de migration disponible
  - README à jour
- **Severity**: MINOR
