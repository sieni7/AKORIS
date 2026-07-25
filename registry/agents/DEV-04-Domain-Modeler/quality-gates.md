# Quality Gates — DEV-04 : Domain Modeler

## Gate 1 : QG-DEV04-01 — Validation du modèle de domaine
- **ID**: QG-DEV04-01
- **Name**: Validation du modèle de domaine
- **Description**: Vérifie que le modèle de domaine est complet, cohérent et validé métier
- **Criteria**:
  - Agrégats, entités et value objects identifiés
  - Relations entre agrégats documentées
  - Ubiquitous Language respecté et glossaire à jour
  - Revue métier effectuée par CORE-03
- **Severity**: BLOCKER

## Gate 2 : QG-DEV04-02 — Cartographie des bounded contexts
- **ID**: QG-DEV04-02
- **Name**: Cartographie des bounded contexts
- **Description**: Valide la délimitation et les relations entre contexts
- **Criteria**:
  - Bounded contexts clairement délimités et justifiés
  - Relations entre contexts documentées (partnership, customer/supplier, etc.)
  - Pas de chevauchement de responsabilités
  - Alignement avec le découpage applicatif (DEV-02)
- **Severity**: MAJOR

## Gate 3 : QG-DEV04-03 — Événements de domaine
- **ID**: QG-DEV04-03
- **Name**: Événements de domaine
- **Description**: Valide la complétude et la cohérence des événements de domaine
- **Criteria**:
  - Événements nommés au passé (CustomerCreated, OrderShipped)
  - Données portées par chaque événement définies
  - Versioning des événements prévu
  - Événements alignés avec les agrégats
- **Severity**: MAJOR

## Gate 4 : QG-DEV04-04 — Règles métier
- **ID**: QG-DEV04-04
- **Name**: Règles métier formalisées
- **Description**: Vérifie que les règles métier sont complètes et exploitables
- **Criteria**:
  - Invariants formalisés et compréhensibles
  - Cas limites et erreurs métier documentés
  - Règles validées par CORE-03
  - Pas de contradiction entre règles
- **Severity**: MAJOR
