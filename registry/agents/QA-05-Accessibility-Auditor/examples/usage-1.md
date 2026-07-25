# Usage 1 — Audit d'accessibilité du Portail Client

## Contexte
Le Portail Client a été entièrement redesigné par DEV-05. Un audit WCAG AA est requis avant la mise en production.

## Déclenchement
```bash
@QA-05 a11y https://staging.akoris.io/portal
```

## Actions réalisées
1. Audit automatisé avec axe-core (38 pages auditées)
2. Audit Lighthouse Accessibilité
3. Test de navigation clavier complet (15 parcours)
4. Test avec lecteur d'écran NVDA (5 scénarios)
5. Vérification manuelle des contrastes (20 combinaisons de couleurs)
6. Revue des attributs ARIA

## Résultats

### Rapport d'accessibilité
- **Conformité WCAG**: AA partielle (2 critères non conformes)
- **Score automatisé**: 89/100

### Anomalies détectées
| ID | WCAG | Sévérité | Élément | Description |
|----|------|----------|---------|-------------|
| A-01 | 1.1.1 (A) | Critique | 15 images de produit | Attribut `alt` manquant sur les images de produit |
| A-02 | 1.4.3 (AA) | Majeure | .text-muted (gris #999) | Contraste insuffisant (ratio 2.8:1) sur 12 occurrences |
| A-03 | 2.4.3 (A) | Majeure | Filtres de recherche | Ordre de tabulation incohérent dans le panneau de filtres |
| A-04 | 4.1.2 (A) | Majeure | Menu déroulant | `aria-expanded` non mis à jour dynamiquement |

### Résumé par critère
| Niveau | Conforme | Non conforme | Score |
|--------|----------|-------------|-------|
| A | 22/25 | 3 | 88% |
| AA | 18/20 | 2 | 90% |
| AA requis | 38/42 critères | 4 | 90% |

### Recommandations
1. Ajouter des attributs `alt` descriptifs aux images de produit (bloquant)
2. Remplacer la couleur `.text-muted` (#999 → #767676) pour respecter le ratio 4.5:1
3. Corriger l'ordre de tabulation avec `tabindex` approprié
4. Mettre à jour `aria-expanded` via JavaScript sur le menu déroulant

## Décision
**Release conditionnelle** — 1 anomalie critique (A) et 1 majeure (AA) à corriger avant mise en production.
