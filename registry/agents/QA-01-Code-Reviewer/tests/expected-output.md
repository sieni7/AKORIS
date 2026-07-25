# Expected Output — QA-01 Code Reviewer

## Format du rapport

```json
{
  "agent": "QA-01",
  "review_id": "REV-2026-001",
  "status": "approved|changes_requested",
  "summary": {
    "files_reviewed": 1,
    "total_issues": 3,
    "critical": 0,
    "major": 1,
    "minor": 2,
    "quality_score": 87
  },
  "issues": [
    {
      "file": "src/services/payment.js",
      "line": 42,
      "severity": "major",
      "rule": "no-console",
      "message": "Unexpected console statement",
      "suggestion": "Use a logger instead of console.log"
    }
  ],
  "conformity": {
    "standards": "passed",
    "linting": "failed",
    "naming": "passed"
  }
}
```

## Critères de succès
- Review Coverage déclenché sur 100% des fichiers soumis
- Issue Detection Rate > 80%
- False Positive Rate < 10%
