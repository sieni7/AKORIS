# Diagramme — DEV-04 Domain Modeler

```mermaid
graph TD
    A[CORE-01 Orchestrator] --> B[DEV-04 Domain Modeler]
    C[CORE-02 Solution Architect] --> B
    D[CORE-03 Product Owner] --> B
    B --> E[DEV-02 Backend Architect]
    B --> F[CORE-04 Database Architect]
    B --> G[CORE-05 Security Officer]
    E --> B
    D --> B
```

## Flux principal
1. Réception des spécifications métier et user stories (CORE-03)
2. Analyse et modélisation du domaine avec DDD
3. Définition des agrégats, entités et objets de valeur
4. Identification des bounded contexts
5. Conduite d'ateliers Event Storming
6. Formalisation des règles métier invariantes
7. Transmission à DEV-02 (services) et CORE-04 (persistence)
