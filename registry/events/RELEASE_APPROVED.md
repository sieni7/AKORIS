# Event: RELEASE_APPROVED

**Name:** Release Approved

**Phase:** release

**Description:** La release est approuvée pour déploiement

## Triggers
- Déploiement en production
- Mise à jour CHANGELOG

## Produced By
- GOV-02

## Consumed By
- CORE-01
- CORE-07
- CORE-06

## Schema
```json
{
  "event": "RELEASE_APPROVED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
