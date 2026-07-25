# Event: ARCHITECTURE_CHANGED

**Name:** Architecture Changed

**Phase:** design

**Description:** L'architecture a été modifiée de manière significative

## Triggers
- Mise à jour des ADR
- Notification des équipes

## Produced By
- CORE-02

## Consumed By
- CORE-01
- CORE-04
- DEV-01
- DEV-02
- DEV-04
- QA-01

## Schema
```json
{
  "event": "ARCHITECTURE_CHANGED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
