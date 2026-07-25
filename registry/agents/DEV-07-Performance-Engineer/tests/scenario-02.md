# Test Scenario 02 — Core Web Vitals Optimization

**Objective:** Validate the agent improves CWV scores for a slow page.

**Input:**
- Page URL with poor CWV (LCP > 4s, CLS > 0.25)
- Current bundle analysis
- Existing caching configuration

**Expected Steps:**
1. Diagnose LCP root cause (image, font, render-blocking)
2. Implement optimizations (lazy load, preload, resize)
3. Diagnose CLS root cause (layout shifts)
4. Apply CLS fixes (dimensions, font swap, stable placeholders)

**Acceptance Criteria:**
- LCP < 2.5s after optimization
- CLS < 0.1 after optimization
- Bundle size remains under budget
- No regressions in other CWV metrics
