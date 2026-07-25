# Quality Gates — EXP-01 AI Orchestration Expert

## QG-EXP01-1: Coût par session
- **Condition:** Coût réel < budget défini
- **Méthode:** Vérification automatique post-exécution
- **Seuil:** Écart max 5% au-dessus du budget
- **Action si échec:** Ajustement du modèle ou réduction du contexte

## QG-EXP01-2: Qualité de sortie
- **Condition:** Sortie validée par QA-04
- **Méthode:** Revue qualitative sur échantillon
- **Seuil:** Score qualité > 8/10
- **Action si échec:** Révision du prompt et nouvelle itération

## QG-EXP01-3: Taux de succès des appels
- **Condition:** Taux de complétion sans erreur
- **Méthode:** Monitoring automatisé
- **Seuil:** > 95%
- **Action si échec:** Analyse des échecs et mise à jour des retries

## QG-EXP01-4: Latence de réponse
- **Condition:** Temps de réponse moyen
- **Méthode:** Mesure horodatée
- **Seuil:** < seuil défini par CORE-07
- **Action si échec:** Optimisation du modèle ou parallélisation
