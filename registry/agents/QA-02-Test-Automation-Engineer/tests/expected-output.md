# Expected Output — QA-02 Test Automation Engineer

## Format du rapport

```json
{
  "agent": "QA-02",
  "test_run_id": "TEST-2026-001",
  "summary": {
    "total_tests": 45,
    "unit": 30,
    "integration": 10,
    "e2e": 5,
    "coverage": 85.3,
    "automation_rate": 94.0,
    "reliability": 97.5
  },
  "test_plan": {
    "strategy": "unit_first + intégration critique + E2E parcours",
    "frameworks": ["Jest", "Cypress", "Supertest"],
    "ci_stage": "test"
  }
}
```

## Critères de succès
- Test Coverage > 80%
- Automation Rate > 90%
- Test Reliability > 95%
- 0 test flaky
