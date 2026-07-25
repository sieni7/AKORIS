# Diagram — EXP-04 Data Engineer

```mermaid
flowchart TD
    A[EXP-04 Data Engineer] --> B[Pipelines ETL]
    A --> C[Data Warehouse]
    A --> D[Modélisation Analytique]
    A --> E[Qualité Données]
    B --> F[Extraction]
    B --> G[Transformation]
    B --> H[Chargement]
    C --> I[Data Marts]
    D --> J[Star Schema]
    D --> K[Snowflake]
    E --> L[Profiling]
    E --> M[Validation]
```
