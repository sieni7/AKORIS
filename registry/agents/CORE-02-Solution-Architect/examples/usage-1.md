# Usage Example 1 – Solution Architect : Choix du moteur de base de données

## Contexte
Le projet AKORIS Platform nécessite le choix d'un moteur de base de données principal. CORE-02 est activé pour produire un ADR documentant cette décision.

## Spécifications reçues
- **Type de données :** transactions financières, profils utilisateurs, logs d'audit
- **Volume estimé :** 10M d'enregistrements / mois
- **Contrainte :** forte consistance (ACID), temps de réponse < 100ms
- **Environnement :** Cloud Azure, conteneurisé

## Traitement par le Solution Architect

1. **Analyse des besoins** : CORE-02 examine les spécifications fonctionnelles et les contraintes techniques.
2. **Identification des options** : PostgreSQL, Microsoft SQL Server, Azure Cosmos DB
3. **Évaluation** : Chaque option est notée selon les critères :
   - Conformité ACID
   - Performance en lecture/écriture
   - Coût d'infrastructure
   - Compatibilité avec l'écosystème Azure
   - Compétences de l'équipe
4. **Consultation** : CORE-02 consulte CORE-04 (Database Architect) pour l'avis technique spécialisé
5. **Rédaction de l'ADR** : Production du document de décision

## Livrable produit
```markdown
## ADR-001 – Choix du moteur de base de données principal

**Statut :** Accepté
**Date :** 2026-07-25

### Contexte
Choix du moteur de base de données pour le module Transactions et le module Utilisateurs.

### Options envisagées
1. PostgreSQL 16 – Open source, ACID, mature, support Azure
2. SQL Server 2022 – Natif Azure, excellentnes performances, coût licence élevé
3. Azure Cosmos DB – Distribué, NoSQL, compromis sur ACID

### Décision
PostgreSQL 16

### Justification
- Conformité ACID totale pour les transactions financières
- Support managé Azure Database for PostgreSQL
- Coût d'infrastructure réduit (pas de licence)
- Large communauté et compétences disponibles
- Excellente performance < 50ms sur les requêtes typiques

### Conséquences
- Positives : Économie de licence, flexibilité, portabilité
- Négatives : Courbe d'apprentissage sur les fonctionnalités avancées

### Participants
- CORE-02, CORE-04
```
