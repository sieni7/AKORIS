# Usage Example 1 – Database Architect : Conception du module Transactions

## Contexte
Nouveau module "Transactions financières" dans le projet AKORIS Platform. CORE-04 est activé pour concevoir le modèle de données associé.

## Besoins reçus
- **Entités :** Transaction, Compte, Utilisateur, Catégorie
- **Volumétrie :** 500 000 transactions / mois, 10 000 comptes, 50 000 utilisateurs
- **Contrainte :** intégrité référentielle stricte, traçabilité des modifications (audit trail)
- **SGBD :** PostgreSQL 16

## Traitement par le Database Architect

1. **Analyse des besoins** : CORE-04 étudie les spécifications et l'architecture globale (CORE-02).
2. **Conception du schéma** : Il produit le modèle logique avec entités, attributs et relations.
3. **Normalisation** : Le schéma est conçu en 3NF avec dérogation pour les logs d'audit (table dénormalisée).
4. **Indexation** : Il définit les index pour les requêtes les plus fréquentes.
5. **Migration** : Il produit le script de migration V1 avec rollback.
6. **Documentation** : Il met à jour le dictionnaire des données.

## Livrable produit
```sql
-- Migration V1 – Module Transactions
-- Date : 2026-07-25
-- Auteur : CORE-04

-- UP
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
    category_id UUID REFERENCES categories(id),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);

-- DOWN
DROP INDEX IF EXISTS idx_accounts_user_id;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_account_id;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
```

```markdown
### Analyse de performance – Requête : Solde par utilisateur
- Plan d'exécution : Index Scan sur accounts.user_id
- Temps moyen : 2 ms (pour 10 000 comptes)
- Index utilisé : idx_accounts_user_id
- Recommandation : Aucune – performance conforme
```
