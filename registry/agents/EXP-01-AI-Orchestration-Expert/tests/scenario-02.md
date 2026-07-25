# Scenario 02: Sélection et benchmarking de modèles

**Objectif:** Sélectionner le modèle LLM optimal pour une tâche d'analyse de code.

## Préconditions
- Tâche : analyse statique de code et détection de patterns
- Volume : 50 fichiers, ~15k lignes
- Contraintes : latence < 5s, coût < $0.10 par appel

## Déroulement
1. Activer EXP-01
2. Lister les modèles disponibles (GPT-4o, Claude 3.5, Gemini 1.5)
3. Benchmarker chaque modèle sur un échantillon
4. Analyser coût, qualité, latence
5. Formuler la recommandation finale

## Résultats attendus
- Rapport de benchmark comparatif
- Recommandation de modèle
- Estimation des coûts annualisés
- Stratégie de fallback

## Critères de succès
- Modèle recommandé avec justification
- Coût respecté
- Qualité validée par QA-04
