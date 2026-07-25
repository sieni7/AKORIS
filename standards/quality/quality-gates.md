# Quality Gates standards

## Introduction

Ce document definit les Quality Gates (seuils de qualite) applicables a tous les projets de l'organisation. Un Quality Gate est un ensemble de conditions qui doivent etre remplies pour qu'une livraison soit consideree comme acceptable.

## Definitions

Les Quality Gates sont verifies a chaque etape du pipeline CI/CD. Tout echec bloque la progression vers l'etape suivante.

## Quality Gate 1 : Commit (pre-commit)

Verifications effectuees localement avant chaque commit.

### Conditions

| Condition | Seuil | Action en cas d'echec |
|-----------|-------|----------------------|
| Linting | Aucune erreur | Bloque le commit |
| Formatage | Fichiers conformes au formateur | Bloque le commit |
| Types TypeScript | Aucune erreur de compilation | Bloque le commit |
| Tests unitaires | 100% de reussite | Bloque le commit |
| Fichiers modifies | Moins de 400 lignes modifies | Avertissement |
| Secrets | Aucun secret detecte | Bloque le commit |

### Configuration

```json
// .husky/pre-commit
{
  "hooks": {
    "pre-commit": "lint-staged && npm run typecheck && npm run test:related",
    "pre-push": "npm run test && npm run audit"
  }
}
```

## Quality Gate 2 : Pull Request

Verifications effectuees sur chaque Pull Request.

### Conditions

| Condition | Seuil | Action en cas d'echec |
|-----------|-------|----------------------|
| Build | Compilation reussie | Bloque le merge |
| Tests unitaires | 100% de reussite | Bloque le merge |
| Tests d'integration | 100% de reussite | Bloque le merge |
| Couverture lignes | >= 80% | Bloque le merge |
| Couverture branches | >= 80% | Bloque le merge |
| Couverture domaine | 100% | Bloque le merge |
| Linting | Aucune erreur | Bloque le merge |
| Audit securite | Aucune vulnerabilite haute ou critique | Bloque le merge |
| Analyse statique (SonarQube) | Aucun bug, aucun smell critique | Bloque le merge |
| Duplication | < 3% | Avertissement |
| Revue de code | Au moins 2 approbations | Bloque le merge |
| Conflits | Aucun conflit avec la branche cible | Bloque le merge |
| Taille de la PR | < 400 lignes modifies | Avertissement |

### Pipeline CI associe

```yaml
# .github/workflows/pr.yml
name: Pull Request Quality Gate
on: [pull_request]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run test:integration
      - run: npm audit --audit-level=high
      - uses: sonarsource/sonarqube-quality-gate-action@v1
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
```

## Quality Gate 3 : Staging

Verifications effectuees apres deploiement sur l'environnement de staging.

### Conditions

| Condition | Seuil | Action en cas d'echec |
|-----------|-------|----------------------|
| Deploiement | Succes sans erreur | Bloque la mise en production |
| Health checks | Tous les endpoints /health OK | Bloque la mise en production |
| Tests E2E | 100% de reussite | Bloque la mise en production |
| Tests de performance | Temps de reponse median < 200ms | Bloque la mise en production |
| Tests de charge | Pas d'erreur sous 2x le trafic attendu | Avertissement |
| Tests de securite (ZAP) | Aucune alerte haute | Bloque la mise en production |
| Migration DB | Executee sans erreur | Bloque la mise en production |
| Logs | Aucune erreur fatale | Bloque la mise en production |

## Quality Gate 4 : Production

Verifications effectuees avant et apres deploiement en production.

### Pre-deploiement

| Condition | Seuil | Action en cas d'echec |
|-----------|-------|----------------------|
| Approbation metier | Validation du Product Owner | Bloque le deploiement |
| Approbation technique | Validation de l'architecte | Bloque le deploiement |
| Change management | Ticket RFC approuve | Bloque le deploiement |
| Fenetre de deploiement | Dans la fenetre autorisee | Bloque le deploiement |
| Backup | Backup de la base effectue | Bloque le deploiement |
| Feature flags | Nouveautes desactivees par defaut | Bloque le deploiement |

### Post-deploiement

| Condition | Seuil | Action en cas d'echec |
|-----------|-------|----------------------|
| Health checks | OK pendant 15 minutes | Rollback automatique |
| Taux d'erreur | < 0.1% des requetes | Rollback automatique |
| Temps de reponse | P95 < 500ms | Rollback automatique |
| Trafic | Pas de baisse anormale | Alerte equipe |
| Logs d'erreur | Pas d'augmentation significative | Alerte equipe |
| Moniteurs APM | Pas de degradation detectee | Alerte equipe |

## Exemptions

### Procedure d'exemption

1. Une exemption temporaire peut etre demandee via un ticket.
2. L'exemption doit etre approuvee par l'architecte technique.
3. L'exemption a une duree limitee (maximum 7 jours).
4. Un plan de correction doit etre fourni.

### Cas autorises

- Correction de bug critique en production.
- Mise a jour de securite urgente.
- Blocage technique temporaire documente.

## Outils utilises

- **SonarQube** : analyse statique et couverture.
- **Jest/Vitest** : tests unitaires et couverture.
- **Playwright/Cypress** : tests E2E.
- **k6** : tests de performance et de charge.
- **OWASP ZAP** : tests de securite.
- **npm audit / Snyk** : analyse des vulnerabilites.
- **GitGuardian / truffleHog** : detection de secrets.

## Rapports

Chaque Quality Gate genere un rapport qui est :

1. Stocke dans les artefacts CI.
2. Visible dans l'interface SonarQube.
3. Diffuse sur le canal Slack de l'equipe.
4. Archive pour audit pendant 1 an.

## Sanctions

- Un echec de Quality Gate bloque le pipeline.
- Les contournements deliberes font l'objet d'une escalation.
- Trois echecs consecutifs declenchent une revue de processus.
