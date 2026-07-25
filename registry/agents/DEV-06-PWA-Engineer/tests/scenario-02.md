# Test Scenario 02 — Push Notifications Setup

**Objective:** Validate push notification configuration and delivery.

**Input:**
- VAPID keys
- Notification payload template
- User subscription endpoint

**Expected Steps:**
1. Configure push service
2. Handle subscription management
3. Send notification payload
4. Handle notification click events

**Acceptance Criteria:**
- Subscription persists across sessions
- Notifications delivered when online
- Notifications queued when offline
- Click events navigate to correct route
