# Quality Gates – Solution Architect (CORE-02)

| ID | Nom | Description | Critères | Sévérité |
|----|-----|-------------|----------|----------|
| QG-SA-001 | Validation ADR par les pairs | Tout ADR doit être validé par au moins 2 pairs avant acceptation | 2 approbations d'agents CORE ou DEV | Blocker |
| QG-SA-002 | Justification technologique | Chaque choix technologique doit reposer sur des critères objectifs | Au moins 2 critères documentés par choix | Critical |
| QG-SA-003 | Couverture architecturale | L'architecture doit couvrir toutes les exigences fonctionnelles | 100 % des user stories tracées dans l'architecture | Blocker |
| QG-SA-004 | Cohérence des interfaces | Les interfaces entre modules doivent être non contradictoires | Vérification croisée des contrats | Critical |
| QG-SA-005 | Diagramme à jour | Le diagramme d'architecture doit refléter l'état actuel | Écart max de 1 version entre doc et implémentation | Major |
| QG-SA-006 | Compatibilité technologique | Les technologies choisies doivent être compatibles entre elles | Aucun conflit de version ou de dépendance connu | Critical |
