# Expected Output — QA-05 Accessibility Auditor

## Rapport d'accessibilité

```yaml
agent: QA-05
type: accessibility-audit
target: Page de connexion
wcag_version: 2.2
level: AA
```

### Scores

| Critère | Score | Status |
|---------|-------|--------|
| Conformité WCAG AA | 100% | ✅ |
| Accessibilité globale | 92% | ✅ |
| Navigation clavier | 100% | ✅ |
| Lecteurs d'écran | 95% | ✅ |
| Contrastes | 100% | ✅ |
| ARIA | 100% | ✅ |

### Issues

| ID | Type | Sévérité | Élément | Recommandation |
|----|------|----------|---------|---------------|
| A01 | Contraste | Mineur | Footer (gris #999) | Passer à #767676 |
| A02 | Focus | Info | Menu déroulant | Ajouter outline visible |

### Résultat final

**Conforme WCAG AA** avec 2 recommandations mineures.
