# Checklist — EXP-02 SaaS Specialist

## Multi-tenant
- [ ] Stratégie d'isolation choisie (DB par tenant / schema / shared)
- [ ] Données sensibles isolées par tenant
- [ ] Performance validée avec N tenants simultanés

## Facturation / Abonnements
- [ ] Modèle de pricing défini avec CORE-03
- [ ] Cycle de vie complet testé (création → renouvellement → résiliation)
- [ ] Gestion des échecs de paiement implémentée
- [ ] Prorata et période d'essai gérés

## Onboarding
- [ ] Parcours utilisateur défini
- [ ] Wizard de configuration tenant
- [ ] Import de données initial si applicable

## Métriques SaaS
- [ ] MRR / ARR calculés et affichés
- [ ] Churn rate tracking implémenté
- [ ] LTV / CAC estimés
- [ ] ARPU par plan disponible
