# Event: CONTRACT_UPDATED

**Name:** Agent Contract Updated

**Phase:** governance

**Description:** Le contrat d'un agent a été modifié

## Triggers
- Validation du nouveau contrat
- Mise à jour dépendances

## Produced By
- GOV-01

## Consumed By
- CORE-01
- CORE-06
- EXP-07

## Schema
```json
{
  "event": "CONTRACT_UPDATED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
