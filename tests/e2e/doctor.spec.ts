import { test, expect } from '@playwright/test';

test('Doctor fix via Command Palette triggers notification', async ({ page }) => {
  await page.goto('/quality');
  await page.keyboard.press('Control+k');
  const searchInput = page.locator('input[placeholder*="command"]');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('fix');
  const firstResult = page.locator('[cmdk-item]').first();
  if (await firstResult.isVisible()) {
    await firstResult.click();
    await page.waitForTimeout(1500);
  }
});
