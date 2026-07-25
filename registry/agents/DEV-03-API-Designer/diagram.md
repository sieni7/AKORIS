# Diagramme — DEV-03 API Designer

```mermaid
graph TD
    A[CORE-01 Orchestrator] --> B[DEV-03 API Designer]
    C[DEV-02 Backend Architect] --> B
    D[DEV-04 Domain Modeler] --> B
    B --> E[DEV-08 Integration Engineer]
    B --> F[CORE-05 Security Officer]
    B --> G[QA-07 Technical Debt Analyst]
    B --> H[DEV-01 Frontend Architect]
```

## Flux principal
1. Réception de l'architecture backend (DEV-02) et du modèle de domaine (DEV-04)
2. Design des endpoints REST/GraphQL
3. Rédaction des spécifications OpenAPI
4. Définition de la stratégie de versioning
5. Validation des schémas de sécurité (CORE-05)
6. Tests de contrat automatisés
