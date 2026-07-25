# Usage Example — EXP-02: Mise en place multi-tenant pour SaaS Analytics

## Contexte
Plateforme SaaS d'analytics avec 3 plans (Free, Pro, Enterprise). CORE-03 a défini le pricing et les features par plan.

## Stratégie d'isolation choisie
- **Shared database, schema per tenant** — Bon équilibre isolation/coût
- Chiffrement des champs PII par tenant
- Pool de connexions filtré par tenant_id

## Architecture multi-tenant

```sql
-- Chaque table porte tenant_id
CREATE TABLE analytics.usage_data (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    metric_name VARCHAR(255),
    metric_value DECIMAL,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- RLS policy
CREATE POLICY tenant_isolation ON analytics.usage_data
    USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

## Cycle de facturation implémenté
1. **Création** → Carte bancaire + plan choisi
2. **Période d'essai** → 14 jours (Free amélioré)
3. **Renouvellement** → Mensuel pour Pro, annuel pour Enterprise
4. **Échec paiement** → 3 relances J+1, J+3, J+7 puis suspension
5. **Résiliation** → Export données, période de grâce 30 jours

## Résultat
- Isolation validée par CORE-05
- Facturation testée avec Stripe (100 scénarios)
- MRR tracking opérationnel dès J+1
