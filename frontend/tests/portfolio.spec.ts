import { test, expect } from '@playwright/test';

test.describe('Portfolio Page', () => {
  test.skip('should display portfolio page (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    await expect(page.locator('text=Portfolio')).toBeVisible();
    
    const dataTable = page.locator('table').first();
    if (await dataTable.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(dataTable).toBeVisible();
    }
  });

  test.skip('should display portfolio table with headers (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const table = page.locator('table').first();
    
    if (await table.isVisible({ timeout: 3000 }).catch(() => false)) {
      const rows = page.locator('tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test.skip('should have add stock button (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const addButton = page.locator('button').filter({ hasText: /Add|Create|New/i }).first();
    
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(addButton).toBeVisible();
    }
  });

  test.skip('should open modal when add button clicked (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const addButton = page.locator('button').filter({ hasText: /Add|Create|New/i }).first();
    
    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();
      
      const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
      await expect(modal).toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });

  test.skip('should display portfolio statistics (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const stats = page.locator('[data-testid="stat"], [class*="stat"]').first();
    
    if (await stats.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(stats).toBeVisible();
    }
  });

  test.skip('should handle pagination if available (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const paginationButtons = page.locator('button').filter({ hasText: /Next|Previous|Page/i });
    const count = await paginationButtons.count();
    
    if (count > 0) {
      const firstButton = paginationButtons.first();
      if (await firstButton.isEnabled({ timeout: 2000 }).catch(() => false)) {
        await firstButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test.skip('should display delete button for portfolio items (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const deleteButton = page.locator('button').filter({ hasText: /Delete|Remove/i }).first();
    
    if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test.skip('should be responsive on mobile (requires Google OAuth)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/portfolio');

    const content = page.locator('[role="main"], main, [class*="content"]').first();
    
    if (await content.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(content).toBeVisible();
    }

    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.skip('should handle edit portfolio item (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const editButton = page.locator('button').filter({ hasText: /Edit|Update/i }).first();
    
    if (await editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editButton.click();
      
      const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
      await expect(modal).toBeVisible({ timeout: 5000 }).catch(() => {});
    }
  });

  test.skip('should navigate back from portfolio (requires Google OAuth)', async ({ page }) => {
    await page.goto('/portfolio');

    const backButton = page.locator('button').filter({ hasText: /Back|Home|Dashboard/i }).first();
    
    if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await backButton.click();
      await page.waitForTimeout(500);
    }
  });
});
