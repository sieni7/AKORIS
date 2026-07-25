# Test Scenario 01 — Service Worker Implementation

**Objective:** Validate the service worker registration and caching strategy.

**Input:**
- Application shell routes
- List of critical assets
- Desired cache strategy (Cache First with Network Fallback)

**Expected Steps:**
1. Register service worker
2. Precache critical assets
3. Implement runtime caching for API routes
4. Handle offline fallback page

**Acceptance Criteria:**
- SW registers without errors
- All critical assets available offline
- Cache hit rate > 80% on repeated visits
- Lighthouse PWA audit passes > 90
