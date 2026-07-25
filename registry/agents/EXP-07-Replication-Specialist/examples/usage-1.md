# Usage Example — Création d'un Template pour Projet Data Pipeline

## Contexte
CORE-01 identifie un besoin récurrent de projets Data Pipeline. EXP-07 est sollicité pour créer un template standardisé.

## Déroulement
1. EXP-07 analyse les retours d'expérience de GOV-03 sur 3 projets Data antérieurs.
2. Définition de la structure du template : dags/, config/, tests/, docs/, docker-compose.yml.
3. Validation de la structure par GOV-01 (conformité AKORIS).
4. Création du générateur CLI : `akoris scaffold data-pipeline my-project`.
5. Test sur 3 projets pilotes (EXP-04 Data Engineer, équipes internes).
6. Intégration des retours : ajout d'un dossier profiling/, simplification du docker-compose.

## Résultats
- **Template:** "data-pipeline" version 1.0.0 publié dans le registry
- **Générateur:** CLI `akoris scaffold` étendu
- **Projets pilotes:** 3/3 validés sans blocage
- **Documentation:** Guide d'utilisation livré à CORE-06
