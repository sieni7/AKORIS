import { test, expect } from '@playwright/test';

test('Registry Explorer loads with search and agent list', async ({ page }) => {
  await page.goto('/registry');
  await expect(page.locator('h2')).toHaveText('Registry Explorer');
  await expect(page.locator('input[placeholder*="Search agents"]')).toBeVisible();
  await expect(page.locator('text=Agents')).toBeVisible();
});
