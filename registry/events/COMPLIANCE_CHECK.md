# Event: COMPLIANCE_CHECK

**Name:** Compliance Check

**Phase:** governance

**Description:** Un contrôle de conformité réglementaire a été effectué

## Triggers
- Rapport de conformité
- Plan d'action si non-conforme

## Produced By
- EXP-05

## Consumed By
- CORE-01
- CORE-05
- GOV-01

## Schema
```json
{
  "event": "COMPLIANCE_CHECK",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
