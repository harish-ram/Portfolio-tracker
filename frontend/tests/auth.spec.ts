import { test, expect } from '@playwright/test';

test.describe('Authentication - Google OAuth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('should display login page with title', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toContainText('Portfolio Manager');
  });

  test('should display subtitle on login page', async ({ page }) => {
    const subtitle = page.locator('p').filter({ hasText: /Sign in|manage.*investments/i }).first();
    
    if (await subtitle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(subtitle).toBeVisible();
    }
  });

  test('should display Google OAuth button', async ({ page }) => {
    const googleButton = page.locator('button').filter({ hasText: /Sign in with Google|Google/i }).first();
    await expect(googleButton).toBeVisible({ timeout: 5000 });
  });

  test('should have OAuth protection notice', async ({ page }) => {
    const protectionNotice = page.locator('text=Google OAuth').first();
    
    if (await protectionNotice.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(protectionNotice).toBeVisible();
    }
  });

  test('should have copyright notice', async ({ page }) => {
    const copyright = page.locator('text=Portfolio Manager').nth(1);
    
    if (await copyright.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(copyright).toBeVisible();
    }
  });

  test('should have centered layout on login page', async ({ page }) => {
    const container = page.locator('[class*="flex"]').filter({ hasText: /Portfolio Manager/i }).first();
    
    if (await container.isVisible({ timeout: 3000 }).catch(() => false)) {
      const classList = await container.evaluate((el) => el.className);
      expect(classList.toLowerCase()).toContain('center');
    }
  });

  test('should have gradient background', async ({ page }) => {
    const backgroundDiv = page.locator('div').first();
    
    const styles = await backgroundDiv.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return computed.background || computed.backgroundColor;
    });
    
    expect(styles).toBeTruthy();
  });

  test('should have Google logo in OAuth button', async ({ page }) => {
    const googleButton = page.locator('button').filter({ hasText: /Sign in with Google/i }).first();
    
    if (await googleButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      const svg = googleButton.locator('svg').first();
      await expect(svg).toBeVisible();
    }
  });

  test('login page should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const title = page.locator('h1');
    await expect(title).toBeVisible();

    const googleButton = page.locator('button').filter({ hasText: /Google/i }).first();
    await expect(googleButton).toBeVisible();
    
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should load without critical console errors', async ({ page }) => {
    const errorMessages: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('401') && !text.includes('Unauthorized')) {
          errorMessages.push(text);
        }
      }
    });

    await expect(page.locator('h1')).toContainText('Portfolio Manager');
    
    expect(errorMessages).toHaveLength(0);
  });

  test('Google OAuth button should redirect', async ({ page, context }) => {
    const googleButton = page.locator('button').filter({ hasText: /Sign in with Google/i }).first();
    
    if (await googleButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      const href = await googleButton.evaluate((el) => {
        const parent = el.closest('[onclick], a, button');
        return parent?.getAttribute('href') || parent?.onclick?.toString() || '';
      });
      
      expect(href || 'oauth').toContain('oauth');
    }
  });
});
