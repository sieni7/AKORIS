# Entrées requises – Orchestrator (CORE-01)

| Nom | Source | Format | Description | Obligatoire |
|-----|--------|--------|-------------|-------------|
| Plan de projet | Initialisation / Mise à jour | JSON / Markdown | Définition des phases, jalons, dépendances et échéances | Oui |
| Statuts des agents | Tous les agents | JSON | État courant de chaque agent (actif, bloqué, terminé, erreur) | Oui |
| Décisions ADR | CORE-02 (Solution Architect) | Markdown | Décisions architecturales enregistrées | Oui |
| Rapports de blocage | Tous les agents | Markdown | Description des blocages rencontrés | Oui |
| Alertes qualité | Agents QA | JSON / Markdown | Anomalies, non-conformités ou déviations détectées | Non |
| Feedback de phase | CORE-03 (Product Owner) | Markdown | Retour sur la conformité fonctionnelle | Non |
