# Event: DEPENDENCY_UPDATED

**Name:** Dependency Updated

**Phase:** development

**Description:** Une dépendance majeure a été mise à jour

## Triggers
- Tests de régression
- Vérification compatibilité

## Produced By
- DEV-08
- CORE-07

## Consumed By
- CORE-01
- QA-02
- QA-03

## Schema
```json
{
  "event": "DEPENDENCY_UPDATED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
