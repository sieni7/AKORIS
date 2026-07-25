# Event: AUDIT_FINISHED

**Name:** Audit Finished

**Phase:** quality

**Description:** Un audit est terminé, rapport disponible

## Triggers
- Revue des résultats
- Plan d'action correctif

## Produced By
- QA-03
- QA-04
- QA-05
- QA-06
- QA-07

## Consumed By
- CORE-01
- CORE-08
- GOV-02

## Schema
```json
{
  "event": "AUDIT_FINISHED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
