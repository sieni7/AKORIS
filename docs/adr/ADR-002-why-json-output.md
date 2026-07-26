# ADR-002 : Pourquoi `--json` est disponible partout ?

## Contexte

Le CLI doit être utilisable à la fois par des humains (sortie textuelle colorée) et par des scripts ou des pipelines CI/CD (sortie structurée). Les sorties textuelles sont belles mais difficiles à parser.

## Décision

Toutes les commandes acceptent l'option `--json` et produisent une sortie structurée (objet JSON valide).

## Alternatives considérées

- **Sortie uniquement en texte** : pratique pour l'humain, inexploitable par les scripts.
- **Format CSV ou TSV** : structuré mais limité pour les données hiérarchiques.
- **Format YAML** : moins universel que JSON.
- **Format XML** : lourd et moins utilisé dans les CLI modernes.

## Justification

- JSON est un standard universel, lisible par toutes les langages et outils (`jq`, `python`, etc.).
- Le CLI peut être intégré facilement dans des pipelines : `akoris search "database" --json | jq '.agents'`.
- C'est une attente forte des utilisateurs d'outils modernes (ex: `kubectl -o json`, `aws --output json`).
- Le module `printJSON()` centralise la production de JSON, garantissant une cohérence.

## Conséquences

- Chaque commande doit avoir une logique conditionnelle : si `--json`, elle appelle `printJSON()` ; sinon, elle utilise les helpers textuels.
- Le développeur doit s'assurer que la sortie JSON contient les mêmes informations que la sortie texte (sans en rajouter).

## Statut

Accepté.
