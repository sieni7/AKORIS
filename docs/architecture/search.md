# Moteur de recherche fédéré

La commande `akoris search` interroge plusieurs sources de données en une seule requête, avec une interface unifiée.

---

## Sources indexées

| Source | Contenu | Nombre |
|--------|---------|--------|
| Agents | id, name, domain, tags, criticity, status | 33 |
| Règles | id, name, description, severity, tags | 12 |
| Capacités | id → agents associés | 69 |
| Livrables | id, name, type, producedBy, consumedBy | 15 |
| Événements | id, name, description, triggers | 18 |
| ADRs | titre, statut, contenu (parse markdown) | variable |
| Logs | agentId, action, details (100 dernières entrées) | dynamique |

---

## Algorithme

1. **Normalisation** : suppression des accents, mise en minuscule des termes de recherche et des champs cibles.
2. **Correspondance** : recherche insensible à la casse sur tous les champs pertinents.
3. **Scoring** : les correspondances exactes dans les champs `id` et `name` reçoivent un score plus élevé.
4. **Regroupement** : les résultats sont regroupés par type (agent, règle, livrable, etc.) et triés par pertinence décroissante.

---

## Utilisation

### Recherche générale

```bash
akoris search "database"
```

Sortie :
```
📋 Résultats pour "database"

Agents (2):
  CORE-04  Database Architect       design_database, optimize_sql
  DEV-07   Database Administrator   database_migration, performance_tuning

Livrables (1):
  DEL-013  Document d'Architecture Technique

Règles (1):
  RULE-042  Validation obligatoire des livrables
```

### Filtrage

```bash
akoris search "security" --type agent   # seulement les agents
akoris search "release" --json          # sortie JSON structurée
```

---

## Performance et limites

- L'indexation est effectuée en mémoire au moment de l'exécution.
- Pour les logs, seules les 100 dernières entrées sont indexées (évite de saturer la mémoire).
- La recherche est conçue pour des Registry de taille modérée (< 500 agents). Pour des volumes plus importants, une évolution vers une indexation persistante est envisagée en version majeure.

---

**Voir aussi** : [ADR-004](../adr/ADR-004-why-search-engine.md)
