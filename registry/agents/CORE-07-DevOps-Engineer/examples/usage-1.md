# Usage Example: Mise en place CI/CD pour microservices

## Contexte
Projet de plateforme SaaS avec 6 microservices backend, 2 applications frontend, base de données PostgreSQL et cache Redis. Déploiement sur Kubernetes.

## Entrées
- Architecture microservices (CORE-02) avec schéma de communication.
- Règles de sécurité (CORE-05) : TLS, chiffrement, pare-feu.
- Besoin de déploiement : blue-green sur Kubernetes, 3 environnements (staging, preprod, prod).

## Actions CORE-07
1. Mise en place du pipeline CI/CD (GitHub Actions) :
   - Build et analyse statique (SonarQube) pour chaque microservice.
   - Tests unitaires et d'intégration automatisés.
   - Construction et push des images Docker vers le registre.
   - Déploiement automatique sur staging, manuel sur preprod et prod.
2. Infrastructure as Code avec Terraform :
   - Cluster Kubernetes (AKS/EKS).
   - Base de données PostgreSQL managée.
   - Cache Redis et stockage objet.
   - Réseau et règles de pare-feu.
3. Monitoring avec Prometheus + Grafana :
   - Métriques CPU, mémoire, latence, taux d'erreur.
   - Logs centralisés (ELK/Loki).
   - Traces distribuées (OpenTelemetry).
   - Alerting sur PagerDuty pour les seuils critiques.
4. Gestion des secrets avec HashiCorp Vault.
5. Runbook d'exploitation et procédure de rollback.

## Livrables
- `.github/workflows/ci-cd.yml` — pipeline CI/CD
- `terraform/` — configurations IaC
- `monitoring/dashboards/` — dashboards Grafana
- `runbooks/deploiement.md` — runbook de déploiement
- `runbooks/rollback.md` — procédure de rollback
- `runbooks/incident.md` — procédure d'incident
