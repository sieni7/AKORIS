# Test Scenario 01 — Performance Budget Definition

**Objective:** Validate the agent can define and enforce a performance budget.

**Input:**
- Application bundle details
- Current Lighthouse scores
- Business performance targets

**Expected Steps:**
1. Analyze current bundle composition
2. Set size budgets per route/chunk
3. Define timing budgets (LCP, FID, CLS)
4. Configure budget enforcement tooling

**Acceptance Criteria:**
- Budgets are specific and measurable
- Budgets align with business targets
- Enforcement integrated into CI pipeline
- Violations produce clear actionable alerts
