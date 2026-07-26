import { test, expect } from '@playwright/test';

const views = [
  { path: '/health', title: 'System Health' },
  { path: '/quality', title: 'System Quality' },
  { path: '/release', title: 'Release Management' },
  { path: '/state-machine', title: 'State Machine' },
  { path: '/registry', title: 'Registry Explorer' },
  { path: '/logs', title: 'Live Logs' },
];

for (const v of views) {
  test(`navigate to ${v.path}`, async ({ page }) => {
    await page.goto(v.path);
    await expect(page.locator('h2')).toHaveText(v.title);
  });
}

test('Command palette opens with Ctrl+K', async ({ page }) => {
  await page.goto('/health');
  await page.keyboard.press('Control+k');
  await expect(page.locator('input[placeholder*="command"]')).toBeVisible();
  await page.keyboard.press('Escape');
});
