# Expected Output — CORE-03 Product Owner

## Format des livrables

### User Story
```yaml
user_story:
  id: "US-XXX"
  title: "Titre de la user story"
  as_a: "rôle utilisateur"
  i_want: "fonctionnalité souhaitée"
  so_that: "bénéfice attendu"
  acceptance_criteria:
    - "critère d'acceptation 1"
    - "critère d'acceptation 2"
  priority: "high|medium|low"
  story_points: 5
  dependencies: ["US-YYY"]
```

### Backlog priorisé
```yaml
backlog:
  sprint: "Sprint X"
  items:
    - id: "US-XXX"
      title: "Titre"
      priority: 1
      status: "ready|in_progress|done"
      assignee: "DEV-XX"
      estimated_effort: 5
```

### Rapport de Sprint Review
```yaml
sprint_review:
  sprint: "Sprint X"
  period:
    start: "YYYY-MM-DD"
    end: "YYYY-MM-DD"
  completed_stories:
    - id: "US-XXX"
      status: "accepted|rejected"
      validation_notes: "notes"
  velocity: 30
  stakeholder_feedback: "synthèse des retours"
  action_items:
    - "action à mener"
```
