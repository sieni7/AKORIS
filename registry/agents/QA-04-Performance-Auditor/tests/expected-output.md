# Expected Output — QA-04 Performance Auditor

## Format du rapport

```json
{
  "agent": "QA-04",
  "perf_id": "PERF-2026-001",
  "date": "2026-07-25",
  "summary": {
    "endpoints_tested": 5,
    "response_time_p95_ms": 420,
    "throughput_achieved": 2450,
    "throughput_target": 2450,
    "throughput_percent": 100,
    "cpu_avg": 62,
    "memory_avg": 78
  },
  "bottlenecks": [
    {
      "component": "api/orders",
      "type": "database_query",
      "impact": "high",
      "p95_ms": 890,
      "recommendation": "Add index on orders.status"
    }
  ],
  "thresholds": {
    "response_time_p95_warning": 400,
    "response_time_p95_critical": 600,
    "cpu_warning": 80,
    "cpu_critical": 90
  }
}
```

## Critères de succès
- Response Time P95 < 500ms
- Throughput Target = 100%
- Load Test Coverage > 80%
- Recommandations transmises à DEV-07
