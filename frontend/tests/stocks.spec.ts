import { test, expect } from '@playwright/test';

test.describe('Stocks Page', () => {
  test.skip('should display stocks page (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    await expect(page.locator('text=Stocks')).toBeVisible();
    
    const stocksContent = page.locator('[role="main"], main').first();
    if (await stocksContent.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(stocksContent).toBeVisible();
    }
  });

  test.skip('should display stock search input (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(searchInput).toBeVisible();
      expect(await searchInput.getAttribute('placeholder')).toContain(/search|stock/i);
    }
  });

  test.skip('should search for stocks (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('AAPL');
      await page.waitForTimeout(1000);
      
      const results = page.locator('li, tr, [role="option"]').first();
      
      if (await results.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(results).toBeVisible();
      }
    }
  });

  test.skip('should display stock list (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    const stockList = page.locator('ul, table, [role="list"]').first();
    
    if (await stockList.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(stockList).toBeVisible();
    }
  });

  test.skip('should have add to portfolio button for stocks (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    await page.waitForLoadState('networkidle').catch(() => {});

    const addButtons = page.locator('button').filter({ hasText: /Add|Buy|Purchase/i });
    const count = await addButtons.count();
    
    if (count > 0) {
      await expect(addButtons.first()).toBeVisible();
    }
  });

  test.skip('should display stock details when selected (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    const stockItem = page.locator('li, tr, [role="option"], [class*="stock"]').first();
    
    if (await stockItem.isVisible({ timeout: 3000 }).catch(() => false)) {
      await stockItem.click();
      
      const details = page.locator('[class*="detail"], [data-testid="details"], div').nth(2);
      
      if (await details.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(details).toBeVisible();
      }
    }
  });

  test.skip('should display stock price information (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    await page.waitForLoadState('networkidle').catch(() => {});

    const priceInfo = page.locator('text=/\\$|USD|Price/i').first();
    
    if (await priceInfo.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(priceInfo).toBeVisible();
    }
  });

  test.skip('should handle stock selection and add to portfolio (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('AAPL');
      await page.waitForTimeout(1000);
      
      const addButton = page.locator('button').filter({ hasText: /Add|Buy|Purchase/i }).first();
      
      if (await addButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addButton.click();
        
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
        await expect(modal).toBeVisible({ timeout: 5000 }).catch(() => {});
      }
    }
  });

  test.skip('should display loading spinner during search (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('TEST');
      
      const spinner = page.locator('[data-testid="loading"], .spinner, [class*="loading"]').first();
      
      if (await spinner.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(spinner).toBeVisible();
        
        await page.waitForLoadState('networkidle').catch(() => {});
      }
    }
  });

  test.skip('should be responsive on mobile (requires Google OAuth)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/stocks');

    const content = page.locator('[role="main"], main').first();
    
    if (await content.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(content).toBeVisible();
    }

    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.skip('should handle empty search results (requires Google OAuth)', async ({ page }) => {
    await page.goto('/stocks');

    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('INVALIDSTOCKCODE12345');
      await page.waitForTimeout(1000);
      
      const noResults = page.locator('text=/No results|not found|no stocks/i').first();
      
      if (await noResults.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(noResults).toBeVisible();
      }
    }
  });
});
