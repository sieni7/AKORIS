import { test, expect } from '@playwright/test';

test('Logs page loads with live stream', async ({ page }) => {
  await page.goto('/logs');
  await expect(page.locator('h2')).toHaveText('Live Logs');
  await expect(page.locator('text=Log Stream')).toBeVisible();
  await expect(page.locator('input[placeholder*="Filter by level"]')).toBeVisible();
  await expect(page.locator('input[placeholder*="Filter by agent"]')).toBeVisible();
});
