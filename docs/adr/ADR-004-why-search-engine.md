# ADR-004 : Moteur de recherche fédéré

**Statut :** Approuvé  
**Date :** 2026-07-26  
**Décideur :** AKORIS Core Team  

## Contexte

Les informations dans AKORIS sont réparties dans plusieurs sources (agents dans le Registry, règles dans `rules/`, ADRs dans `.akoris/decisions/`, logs dans `.akoris/logs/`). Pour trouver une information, l'utilisateur devait connaître la bonne commande (`capability find`, `agent list`, `logs`, etc.). Aucun point d'entrée unique.

## Options envisagées

| Option | Points forts | Points faibles |
|--------|-------------|----------------|
| **Moteur fédéré** | Point d'entrée unique, 7 sources, extensible | Complexité moyenne, pas de scoring |
| **Index plein texte (Lunr.js)** | Recherche avancée, stemming | Dépendance lourde, index en mémoire, surdimensionné |
| **Perpétuer la recherche par commande** | Simple | Mauvaise UX, courbe d'apprentissage |

## Décision

**Moteur fédéré interne** avec correspondance substring insensible à la casse. Chaque source est interrogée via son service dédié :

- Agents → `RegistryReaderV2.listAgentDirs() + readAgentJson()`
- Règles → `RegistryReaderV2.getRules()`
- Capacités → `RegistryReaderV2.getCapabilityRegistry()`
- Livrables → `RegistryReaderV2.getDeliverables()`
- Événements → `RegistryReaderV2.getEvents()`
- ADRs → `readFileSync` sur `.akoris/decisions/*.md`
- Logs → `readFileSync` sur `.akoris/logs/sessions/*.json`

## Conséquences

- 7 sources interrogées en une commande
- Filtrage par type avec `--type`
- Sortie texte (groupée par type) + JSON (`--json`) + verbose (`--verbose`)
- Résultats triés par type (agents en premier, logs en dernier)
- Résultats enrichis : champ matché, valeur matchée, chemin source
- Pas de dépendance externe
- Extensible par ajout d'une méthode privée dans `SearchEngine`

## Limites

- Pas de stemming ou de fuzzy matching
- Pas de scoring ou de ranking par pertinence
- Les ADRs nécessitent un parsing markdown simple

## Références

- Service : `src/services/search.service.ts`
- Commande : `src/commands/search.ts`
