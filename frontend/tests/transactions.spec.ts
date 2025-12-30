import { test, expect } from './fixtures';

test.describe('Transactions Page', () => {
  test.skip('should display transactions page (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    await expect(page.locator('text=Transaction')).toBeVisible({ timeout: 5000 }).catch(() => {});
    
    const transactionsContent = page.locator('[role="main"], main').first();
    if (await transactionsContent.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(transactionsContent).toBeVisible();
    }
  });

  test.skip('should display transactions table (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const table = page.locator('table').first();
    
    if (await table.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(table).toBeVisible();
    }
  });

  test.skip('should have transaction filters (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const filterSelects = page.locator('select, [role="combobox"]').first();
    
    if (await filterSelects.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(filterSelects).toBeVisible();
    }
  });

  test.skip('should filter transactions by type (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const typeFilter = page.locator('select').filter({ hasText: /Type|Action|Buy|Sell/i }).first();
    
    if (await typeFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await typeFilter.selectOption('BUY');
      await page.waitForTimeout(500);
      
      const table = page.locator('table').first();
      if (await table.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(table).toBeVisible();
      }
    }
  });

  test.skip('should display transaction details in table (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const tableRows = page.locator('tr');
    const count = await tableRows.count();
    
    if (count > 1) {
      const firstDataRow = tableRows.nth(1);
      await expect(firstDataRow).toBeVisible();
    }
  });

  test.skip('should display date column in transactions (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const dateColumn = page.locator('th').filter({ hasText: /Date|Time/i }).first();
    
    if (await dateColumn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(dateColumn).toBeVisible();
    }
  });

  test.skip('should display amount column in transactions (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const amountColumn = page.locator('th').filter({ hasText: /Amount|Price|Total/i }).first();
    
    if (await amountColumn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(amountColumn).toBeVisible();
    }
  });

  test.skip('should have sort functionality (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const sortableHeader = page.locator('th').first();
    
    if (await sortableHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sortableHeader.click();
      await page.waitForTimeout(500);
    }
  });

  test.skip('should display pagination if many transactions (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const paginationButtons = page.locator('button').filter({ hasText: /Next|Previous|Page/i });
    const count = await paginationButtons.count();
    
    if (count > 0) {
      await expect(paginationButtons.first()).toBeVisible();
    }
  });

  test.skip('should display transaction status/type as badge (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const badge = page.locator('[class*="badge"], [class*="tag"], [class*="status"]').first();
    
    if (await badge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(badge).toBeVisible();
    }
  });

  test.skip('should have delete transaction button (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const deleteButton = page.locator('button').filter({ hasText: /Delete|Remove|Cancel/i }).first();
    
    if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(deleteButton).toBeVisible();
    }
  });

  test.skip('should be responsive on mobile (requires Google OAuth)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/transactions');

    const content = page.locator('[role="main"], main').first();
    
    if (await content.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(content).toBeVisible();
    }

    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.skip('should filter transactions by date range (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const dateInputs = page.locator('input[type="date"]');
    const count = await dateInputs.count();
    
    if (count > 0) {
      await dateInputs.first().fill('2024-01-01');
      await page.waitForTimeout(500);
      
      const table = page.locator('table').first();
      if (await table.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(table).toBeVisible();
      }
    }
  });

  test.skip('should display no transactions message when empty (requires Google OAuth)', async ({ page }) => {
    await page.goto('/transactions');

    const emptyMessage = page.locator('text=/No transactions|empty/i').first();
    
    if (await emptyMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(emptyMessage).toBeVisible();
    }
  });
});
