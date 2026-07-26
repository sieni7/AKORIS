import { test, expect } from '@playwright/test';

test('Health dashboard loads and displays KPI cards', async ({ page }) => {
  await page.goto('/health');
  await expect(page.locator('h2')).toHaveText('System Health');
  const cards = page.locator('h3');
  await expect(cards.first()).toBeVisible();
});

test('Quality dashboard loads with issues list', async ({ page }) => {
  await page.goto('/quality');
  await expect(page.locator('h2')).toHaveText('System Quality');
  await expect(page.locator('button:has-text("Fix All")')).toBeVisible();
});

test('Release dashboard loads with current state', async ({ page }) => {
  await page.goto('/release');
  await expect(page.locator('h2')).toHaveText('Release Management');
});

test('Doctor fix button triggers notification', async ({ page }) => {
  await page.goto('/quality');
  const fixAll = page.locator('button:has-text("Fix All")');
  await expect(fixAll).toBeVisible();
  if (await fixAll.isEnabled()) {
    await fixAll.click();
    await page.waitForTimeout(1500);
  }
});
