import { test, expect } from '@playwright/test';

test('should have correct page title', async ({ page }) => {
  await page.goto('https://howlingtesters.pl/party/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('party - Howling Testers');
  // await page.close()
});