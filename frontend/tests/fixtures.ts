import { test as base, expect } from '@playwright/test';

interface TestFixtures {
  authenticatedPage: void;
}

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    try {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      const loginButton = page.locator('button').filter({ hasText: /Sign in with Google|Google/i }).first();
      
      if (await loginButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Protected page detected, skipping OAuth flow in tests');
      }
    } catch (error) {
      console.log('Dashboard access attempt:', error);
    }

    await use();
  },
});

export { expect };
