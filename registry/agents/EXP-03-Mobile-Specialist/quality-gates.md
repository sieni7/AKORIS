# Quality Gates — EXP-03 Mobile Specialist

## QG-EXP03-1: Tests sur device réel
- **Condition:** Application testée sur devices physiques iOS et Android
- **Méthode:** Exécution de la suite de tests sur device réel
- **Seuil:** 100% des scénarios critiques passent
- **Action si échec:** Correction des bugs spécifiques device

## QG-EXP03-2: Performance mobile
- **Condition:** Temps de démarrage, consommation batterie, utilisation mémoire
- **Méthode:** Profiling avec outils platforme (Xcode Instruments, Android Profiler)
- **Seuil:** Démarrage < 2s, mémoire < 150MB, batterie < 5%/h en usage normal
- **Action si échec:** Optimisation du code, lazy loading, réduction des appels réseau

## QG-EXP03-3: Synchronisation offline
- **Condition:** Données cohérentes après cycle offline → online
- **Méthode:** Tests de scénarios offline (avion, perte réseau)
- **Seuil:** Zéro perte de données, résolution de conflits correcte
- **Action si échec:** Revue de la stratégie de sync et des merge

## QG-EXP03-4: Conformité store
- **Condition:** Respect des guidelines App Store et Play Store
- **Méthode:** Revue de checklist pré-soumission
- **Seuil:** 100% des critères validés
- **Action si échec:** Mise en conformité avant soumission
