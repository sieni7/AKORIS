# Event: SPRINT_COMPLETED

**Name:** Sprint Completed

**Phase:** review

**Description:** Le sprint est terminé, revue nécessaire

## Triggers
- Revue de sprint
- Mise à jour du backlog

## Produced By
- CORE-03

## Consumed By
- CORE-01
- CORE-03
- QA-05
- QA-06
- GOV-03

## Schema
```json
{
  "event": "SPRINT_COMPLETED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
