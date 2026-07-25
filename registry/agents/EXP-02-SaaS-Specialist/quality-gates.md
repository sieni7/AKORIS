# Quality Gates — EXP-02 SaaS Specialist

## QG-EXP02-1: Isolation tenant
- **Condition:** Aucune fuite de données entre tenants
- **Méthode:** Tests de pénétration et tests automatisés
- **Seuil:** Zéro vulnérabilité d'isolation
- **Action si échec:** Correction de l'architecture d'isolation + re-test

## QG-EXP02-2: Cycle de facturation
- **Condition:** Cycle complet testé sans erreur
- **Méthode:** Tests E2E sur chaque étape
- **Seuil:** 100% des scénarios passent
- **Action si échec:** Correction des workflows + re-exécution

## QG-EXP02-3: Précision métriques SaaS
- **Condition:** Calculs MRR, churn, LTV exacts
- **Méthode:** Vérification mathématique sur jeu de données connu
- **Seuil:** Écart < 0.1%
- **Action si échec:** Correction des formules de calcul

## QG-EXP02-4: Performance multi-tenant
- **Condition:** Temps de réponse avec N tenants simultanés
- **Méthode:** Test de charge progressif
- **Seuil:** Dégradation < 20% entre 1 et 1000 tenants
- **Action si échec:** Optimisation des requêtes ou revue de la stratégie d'isolation
