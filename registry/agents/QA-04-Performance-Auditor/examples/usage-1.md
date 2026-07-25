# Usage 1 — Audit de performance du service de Recherche

## Contexte
Le service de recherche a été réécrit par DEV-02 avec une nouvelle architecture Elasticsearch. Un audit de performance est nécessaire avant la release.

## Déclenchement
```bash
@QA-04 perf search-service
```

## Actions réalisées
1. Déploiement de l'application en environnement de staging
2. Exécution de 3 scénarios de charge (100, 500, 1000 req/s)
3. Profiling CPU et mémoire du service
4. Analyse des requêtes Elasticsearch
5. Comparaison avec la baseline de l'ancienne version

## Résultats

### Rapport de performance
- **Charge testée**: 1000 req/s soutenues
- **Temps réponse moyen**: 45 ms (baseline: 230 ms) ✅
- **P95**: 120 ms (baseline: 480 ms) ✅
- **P99**: 350 ms (baseline: 1200 ms) ✅
- **CPU max**: 62% ✅
- **Mémoire max**: 512 MB ✅

### Goulots d'étranglement détectés
| ID | Sévérité | Composant | Description |
|----|----------|-----------|-------------|
| P-01 | Mineure | Index Elasticsearch | Latence sur requêtes avec `fuzzy` élevé (P99 > 2s sur 3% des cas) |

### Recommandations
1. Optimiser l'index `fuzzy` avec un ngram tokenizer (gain estimé: -40% latence)
2. Ajouter un cache Redis pour les recherches fréquentes (gain estimé: -60% charge ES)

## Décision
**Performance validée** — Amélioration significative par rapport à l'ancienne version. Recommandations transmises à DEV-07.
