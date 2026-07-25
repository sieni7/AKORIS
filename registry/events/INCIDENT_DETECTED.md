# Event: INCIDENT_DETECTED

**Name:** Incident Detected

**Phase:** operations

**Description:** Un incident a été détecté en production

## Triggers
- Activation EXP-06
- Création runbook incident

## Produced By
- EXP-06
- CORE-07

## Consumed By
- CORE-01
- CORE-07
- EXP-06

## Schema
```json
{
  "event": "INCIDENT_DETECTED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
