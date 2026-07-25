# Diagramme — DEV-01 Frontend Architect

```mermaid
graph TD
    A[CORE-01 Orchestrator] --> B[DEV-01 Frontend Architect]
    C[CORE-02 Solution Architect] --> B
    B --> D[DEV-05 UX Engineer]
    B --> E[DEV-07 Performance Engineer]
    B --> F[DEV-08 Integration Engineer]
    B --> G[QA-04 Performance Auditor]
    B --> H[DEV-03 API Designer]
    H --> B
```

## Flux principal
1. Réception des spécifications UI/UX (DEV-05)
2. Conception de l'arbre de composants et routing
3. Définition du design system
4. Implémentation de la stratégie de state management
5. Optimisation des performances (DEV-07, QA-04)
6. Validation des appels API (DEV-08)
