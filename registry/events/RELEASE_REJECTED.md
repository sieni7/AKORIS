# Event: RELEASE_REJECTED

**Name:** Release Rejected

**Phase:** release

**Description:** La release est rejetée pour non-conformité

## Triggers
- Plan de correction
- Nouvel audit

## Produced By
- GOV-02

## Consumed By
- CORE-01
- CORE-08
- QA-03
- QA-04
- QA-05

## Schema
```json
{
  "event": "RELEASE_REJECTED",
  "timestamp": "ISO 8601",
  "producer": "Agent ID",
  "payload": {}
}
```
