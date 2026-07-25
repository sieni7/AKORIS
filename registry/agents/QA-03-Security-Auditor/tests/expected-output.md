# Expected Output — QA-03 Security Auditor

## Format du rapport

```json
{
  "agent": "QA-03",
  "audit_id": "AUDIT-2026-001",
  "date": "2026-07-25",
  "summary": {
    "total_vulnerabilities": 7,
    "critical": 0,
    "high": 3,
    "medium": 3,
    "low": 1,
    "owasp_coverage": ["A01", "A02", "A03", "A05", "A06", "A07", "A09"]
  },
  "vulnerabilities": [
    {
      "id": "VULN-001",
      "cve": "CVE-2026-1234",
      "severity": "high",
      "cvss": 8.2,
      "component": "lodash@4.17.20",
      "remediation": "Upgrade to lodash@4.17.21+"
    }
  ],
  "compliance": {
    "owasp_top_10": "passed",
    "sast": "passed",
    "dast": "not_applicable"
  }
}
```

## Critères de succès
- Vuln Critical Count = 0
- Vuln High Count < 5
- Audit Frequency respectée (monthly)
- Conformité OWASP validée
