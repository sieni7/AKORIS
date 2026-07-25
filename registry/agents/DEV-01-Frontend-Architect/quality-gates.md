# Quality Gates — DEV-01 : Frontend Architect

## Gate 1 : QG-DEV01-01 — Validation d'architecture frontend
- **ID**: QG-DEV01-01
- **Name**: Validation d'architecture frontend
- **Description**: Vérifie que l'architecture proposée respecte les standards et contraintes du projet
- **Criteria**:
  - Arbre de composants cohérent et documenté
  - Choix techniques justifiés (framework, librairies)
  - Stratégie de state management définie
  - Bundle size estimé et sous le seuil
- **Severity**: BLOCKER

## Gate 2 : QG-DEV01-02 — Performance UI
- **ID**: QG-DEV01-02
- **Name**: Performance UI
- **Description**: Valide les métriques de performance frontend
- **Criteria**:
  - Lighthouse Performance > 90
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
  - Bundle size vendor < 500KB, app < 50KB
- **Severity**: MAJOR

## Gate 3 : QG-DEV01-03 — Accessibilité
- **ID**: QG-DEV01-03
- **Name**: Accessibilité
- **Description**: Valide la conformité WCAG 2.1
- **Criteria**:
  - Lighthouse Accessibility > 90
  - Navigation clavier fonctionnelle
  - Contraste des couleurs validé
  - Attributs ARIA corrects
- **Severity**: MAJOR

## Gate 4 : QG-DEV01-04 — Qualité du code
- **ID**: QG-DEV01-04
- **Name**: Qualité du code frontend
- **Description**: Vérifie la conformité aux standards de code
- **Criteria**:
  - ESLint sans erreur
  - Tests unitaires > 80% coverage
  - Pas de dépendances obsolètes
  - Documentation à jour
- **Severity**: MINOR
