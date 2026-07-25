# Event: QUALITY_GATE_FAILED

**Name:** Quality Gate Failed

**Phase:** quality

**Description:** Un Quality Gate a échoué, des corrections sont nécessaires

## Triggers
- Création de tâches correctives
- Notification des agents concernés

## Produced By
- GOV-02

## Consumed By
- CORE-01
- CORE-08
- DEV-01
- DEV-02
- QA-01

## Schema
```json
{
  "event": "QUALITY_GATE_FAILED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
