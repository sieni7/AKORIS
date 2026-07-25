# Event: ADR_CREATED

**Name:** ADR Created

**Phase:** design

**Description:** Une décision architecturale a été formalisée

## Triggers
- Revue par les pairs
- Mise à jour de l'architecture

## Produced By
- CORE-02

## Consumed By
- CORE-01
- CORE-06
- DEV-01
- DEV-02
- QA-06

## Schema
```json
{
  "event": "ADR_CREATED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
