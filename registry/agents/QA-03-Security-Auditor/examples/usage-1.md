# Usage 1 — Audit de sécurité pré-release v2.5

## Contexte
Release v2.5 de l'application principale. Audit de sécurité complet requis avant déploiement.

## Déclenchement
```bash
@QA-03 audit release/v2.5
```

## Actions réalisées
1. Analyse SAST sur 156 fichiers (TypeScript, Python, Go)
2. Analyse DAST sur l'environnement de staging
3. Scan des dépendances (npm, pip, go modules)
4. Audit de configuration Kubernetes et Terraform
5. Vérification OWASP Top 10 complète

## Résultats

### Rapport d'audit
- **Vulnérabilités critiques**: 1
- **Vulnérabilités hautes**: 3
- **Vulnérabilités moyennes**: 7
- **Vulnérabilités faibles**: 12
- **Conformité OWASP**: 8/10 catégories OK

### Vulnérabilités principales
| ID | CVSS | Type | Composant | Description |
|----|------|------|-----------|-------------|
| V-001 | 9.1 | Critique | API Gateway | Injection SQL dans le paramètre `userId` (GET /api/users) |
| V-002 | 7.5 | Haute | Auth Service | JWT secret par défaut non modifié en production |
| V-003 | 7.2 | Haute | Kubernetes | Pod security policy désactivée |
| V-004 | 6.8 | Haute | npm | CVE-2024-1234 dans `lodash` (version 4.17.20) |

### Recommandations
- **Urgent**: Paramétrer la requête SQL dans l'API Gateway (fichier: `gateway/src/middleware/query.ts:142`)
- **Urgent**: Changer le JWT secret dans les variables d'environnement
- **Sous 7 jours**: Activer Pod Security Policies dans le cluster
- **Sous 7 jours**: Mettre à jour lodash vers 4.17.21+

## Décision
**Release bloquée** — 1 vulnérabilité critique et 3 hautes à résoudre avant déploiement.
