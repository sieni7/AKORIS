import { test, expect } from '@playwright/test';

test('State machine page displays graph and transitions', async ({ page }) => {
  await page.goto('/state-machine');
  await expect(page.locator('h2')).toHaveText('State Machine');
  await expect(page.locator('text=Visual Graph')).toBeVisible();
  await expect(page.locator('text=States')).toBeVisible();
  await expect(page.locator('text=Transitions')).toBeVisible();
});

test('State machine shows available transitions', async ({ page }) => {
  await page.goto('/state-machine');
  const transitionsSection = page.locator('h3:has-text("Transitions")');
  await expect(transitionsSection).toBeVisible();
});
