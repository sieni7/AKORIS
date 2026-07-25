# Expected Output — CORE-01 Orchestrator

## Format des livrables

### Rapport de coordination
```yaml
coordination_report:
  date: "YYYY-MM-DD"
  phase: "nom_de_phase"
  agent_statuses:
    - id: "CORE-XX"
      status: "active|blocked|completed|error"
      summary: "description concise"
  conflicts:
    - id: "CONFLICT-XXX"
      agents: ["CORE-XX", "CORE-YY"]
      status: "resolved|escalated|pending"
      resolution: "description de la décision"
  blocked_items:
    - agent: "CORE-XX"
      reason: "cause du blocage"
      recommended_action: "action proposée"
  recommendations:
    - type: "transition|escalation|reallocation"
      description: "description"
```

### Décision d'arbitrage
```yaml
arbitration_decision:
  id: "ARB-XXX"
  date: "YYYY-MM-DD"
  context: "description du contexte du conflit"
  agents_involved: ["CORE-XX", "CORE-YY"]
  options:
    - option: "A"
      description: "description"
      pros: ["avantage"]
      cons: ["inconvénient"]
  decision: "option retenue"
  justification: "motivation détaillée"
  impact: "impact sur le projet"
```

### Validation de phase
```yaml
phase_validation:
  phase: "nom_phase"
  status: "approved|rejected|pending"
  exit_criteria:
    - criterion: "description"
      met: true|false
      evidence: "preuve"
  conditions: "conditions à remplir avant approbation"
```
