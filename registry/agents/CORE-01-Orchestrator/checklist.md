---
id: CORE-01
name: Orchestrator
---

- id: chk-orch-001
  category: Coordination
  description: Vérifier que tous les agents requis pour la phase courante sont actifs
  mandatory: true

- id: chk-orch-002
  category: Coordination
  description: Vérifier qu'aucun conflit ouvert entre agents n'est non résolu
  mandatory: true

- id: chk-orch-003
  category: Transition
  description: Valider que tous les critères de sortie de la phase courante sont remplis
  mandatory: true

- id: chk-orch-004
  category: Transition
  description: Vérifier que les livrables de la phase courante sont complets et approuvés
  mandatory: true

- id: chk-orch-005
  category: Arbitrage
  description: Documenter toute décision d'arbitrage avec justification
  mandatory: true

- id: chk-orch-006
  category: Arbitrage
  description: Notifier tous les agents impactés par une décision d'arbitrage
  mandatory: true

- id: chk-orch-007
  category: Surveillance
  description: Vérifier l'absence d'alerte non traitée depuis plus de 24h
  mandatory: true

- id: chk-orch-008
  category: Surveillance
  description: Produire un rapport de coordination si la phase est active depuis plus de 24h
  mandatory: false
