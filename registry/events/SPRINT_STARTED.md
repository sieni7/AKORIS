# Event: SPRINT_STARTED

**Name:** Sprint Started

**Phase:** development

**Description:** Un nouveau sprint de développement commence

## Triggers
- Activation des agents DEV
- Début de la planification

## Produced By
- CORE-03

## Consumed By
- CORE-01
- CORE-07
- DEV-01
- DEV-02
- QA-01
- QA-02

## Schema
```json
{
  "event": "SPRINT_STARTED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
