---
agent: DEV-04
name: Domain Modeler
---

# Checklist — Domain Modeler

## Analyse du domaine
- [ ] Glossaire métier établi et partagé
- [ ] Event Storming réalisé avec les experts métier
- [ ] Bounded contexts identifiés et cartographiés
- [ ] Relations entre contexts documentées

## Modélisation des agrégats
- [ ] Agrégats identifiés avec racines claires
- [ ] Limites de cohérence des agrégats définies
- [ ] Règles d'accès et de modification documentées
- [ ] Identifiants des agrégats choisis

## Entités et objets de valeur
- [ ] Entités distinguées des objets de valeur
- [ ] Objets de valeur immutables
- [ ] Égalité structurelle définie pour les value objects
- [ ] Cycle de vie des entités documenté

## Événements de domaine
- [ ] Événements de domaine identifiés
- [ ] Nommage au passé (CustomerCreated, OrderPaid)
- [ ] Données portées par chaque événement définies
- [ ] Versioning des événements prévu

## Règles métier
- [ ] Invariants formalisés
- [ ] Contraintes de validation documentées
- [ ] Cas limites identifiés
- [ ] Erreurs métier et exceptions définies

## Validation
- [ ] Modèle revu et validé par CORE-03
- [ ] Terminologie métier respectée
- [ ] Modèle cohérent avec les user stories
- [ ] Documentation partagée avec l'équipe
