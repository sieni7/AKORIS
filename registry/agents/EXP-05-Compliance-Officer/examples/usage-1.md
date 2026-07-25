# Usage Example — Audit RGPD Pré-release

## Contexte
Projet "Marketplace Horizon" en phase de pré-mise en production. CORE-01 déclenche un audit réglementaire via EXP-05.

## Déroulement
1. EXP-05 reçoit le périmètre et l'architecture finale de CORE-01 et CORE-05.
2. Analyse des flux de données personnelles identifiés.
3. Vérification du registre de traitement existant.
4. Mise à jour de la DPIA pour le module de recommandations personnalisées.
5. Identification d'un écart : absence de consentement explicite pour le partage de données avec partenaire tiers.

## Résultats
- **Écart:** Absence de mécanisme de consentement pour le partenaire tiers.
- **Recommandation:** Ajouter une étape de collecte de consentement avant l'activation du module.
- **Action obligatoire:** Correction avant mise en production.
- **Rapport transmis à:** CORE-01, CORE-05, GOV-01.
