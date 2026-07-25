# Expected Deliverables — CORE-05 Security Officer

## Format des livrables

| Livrable | Format | Contenu minimal | Destinataire |
|----------|--------|-----------------|--------------|
| Politique de sécurité | Markdown (`.md`) | Principes, règles, normes applicables, exceptions | CORE-01, CORE-07 |
| Règles de pare-feu / segmentation | JSON ou YAML | Règles de flux, zones réseau, listes de contrôle d'accès | CORE-07 |
| Spécifications authN/authZ | Markdown (`.md`) | Mécanismes, protocoles, flux, rôles et permissions | DEV-01, DEV-02 |
| Plan de test sécurité | Markdown (`.md`) | Scénarios d'attaque, outils, périmètre, calendrier | QA-03 |
| Rapport d'analyse des vulnérabilités | Markdown (`.md`) | Vulnérabilités, sévérité (CVSS), recommandations, priorisation | CORE-01, CORE-02 |

## Règles de qualité
- Chaque livrable doit être versionné.
- Les documents doivent être relus et approuvés par CORE-01.
- Les livrables techniques doivent être accompagnés d'exemples concrets.
- Le rapport de vulnérabilités doit inclure un score CVSS pour chaque entrée.
