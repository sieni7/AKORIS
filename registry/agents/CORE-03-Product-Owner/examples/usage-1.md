# Usage Example 1 – Product Owner : Sprint Planning avec priorisation

## Contexte
Sprint 3 du projet AKORIS Platform. CORE-03 prépare le sprint planning en collaboration avec DEV-01 (Frontend) et DEV-02 (Backend).

## Situation
- **Nouveaux besoins reçus :** module de notifications push, export PDF des rapports
- **Retour utilisateur :** temps de chargement perçu trop long sur le tableau de bord
- **Contrainte métier :** la fonctionnalité de notifications doit être livrée avant la fin du trimestre

## Traitement par le Product Owner

1. **Analyse des entrées** : CORE-03 étudie les nouveaux besoins et les retours utilisateurs.
2. **Mise à jour du backlog** : Il intègre les nouvelles stories et réévalue les priorités.
3. **Priorisation** :
   - **P1 (Haute) :** Optimisation du temps de chargement du tableau de bord (retour utilisateur)
   - **P2 (Haute) :** Module de notifications push (contrainte métier)
   - **P3 (Moyenne) :** Export PDF des rapports
4. **Affinage** : Il rédige la user story prioritaire avec ses critères d'acceptation.
5. **Sprint planning** : Il présente les stories prêtes à l'équipe DEV pour estimation et engagement.

## Livrable produit
```markdown
## User Story – US-042

**Titre :** Optimiser le temps de chargement du tableau de bord
**Priorité :** Haute
**Story Points :** 8
**Sprint :** 3

### Description
En tant qu'utilisateur, je veux que le tableau de bord se charge en moins de 2 secondes afin de pouvoir travailler efficacement sans latence.

### Critères d'acceptation
- [ ] Le tableau de bord s'affiche en moins de 2 secondes mesuré sur une connexion standard
- [ ] Les données sont chargées de manière asynchrone sans bloquer le rendu
- [ ] Un indicateur de chargement (skeleton) est affiché pendant le chargement
- [ ] La performance est maintenue avec 1000 enregistrements simultanés

### Dépendances
- DEV-02 : Optimisation des requêtes API
- DEV-01 : Mise en place du lazy loading

### Notes
Issue du retour utilisateur du sprint 2. Bloquant pour la rétention.
```
