# Diagramme — DEV-02 Backend Architect

```mermaid
graph TD
    A[CORE-01 Orchestrator] --> B[DEV-02 Backend Architect]
    C[CORE-02 Solution Architect] --> B
    B --> D[DEV-03 API Designer]
    B --> E[DEV-04 Domain Modeler]
    B --> F[CORE-04 Database Architect]
    B --> G[DEV-08 Integration Engineer]
    D --> B
    E --> B
```

## Flux principal
1. Réception des spécifications fonctionnelles et user stories
2. Définition de l'architecture backend globale
3. Découpage en services et modules
4. Conception des patterns d'intégration
5. Validation avec DEV-03 (contrats API) et DEV-04 (domaine)
6. Coordination avec CORE-04 (persistence)
