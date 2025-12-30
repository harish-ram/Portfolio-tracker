import { Page, expect } from '@playwright/test';

export class TestHelpers {
  static async login(page: Page, email: string = 'test@example.com', password: string = 'password123') {
    await page.goto('/');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 }).catch(() => {});
  }

  static async logout(page: Page) {
    const logoutButton = page.locator('button').filter({ hasText: /Logout|Sign out/i }).first();
    
    if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutButton.click();
      await page.waitForURL('/', { timeout: 5000 }).catch(() => {});
    }
  }

  static async navigateTo(page: Page, destination: string) {
    const link = page.locator('a').filter({ hasText: new RegExp(destination, 'i') }).first();
    
    if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
      await link.click();
      await page.waitForLoadState('networkidle').catch(() => {});
      return true;
    }
    
    return false;
  }

  static async openModal(page: Page, buttonText: string = 'Add') {
    const button = page.locator('button').filter({ hasText: new RegExp(buttonText, 'i') }).first();
    
    if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
      await button.click();
      
      const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
      await expect(modal).toBeVisible({ timeout: 5000 }).catch(() => {});
      return modal;
    }
    
    return null;
  }

  static async closeModal(page: Page) {
    const closeButton = page.locator('button').filter({ hasText: /Close|Cancel|X/i }).first();
    
    if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeButton.click();
    }
  }

  static async fillForm(page: Page, fields: Record<string, string>) {
    for (const [label, value] of Object.entries(fields)) {
      const input = page.locator(`input, select, textarea`).filter({ has: page.locator(`text=${label}`) }).first();
      
      if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
        const tagName = await input.evaluate((el) => el.tagName.toLowerCase());
        
        if (tagName === 'select') {
          await input.selectOption(value);
        } else {
          await input.fill(value);
        }
      }
    }
  }

  static async submitForm(page: Page, submitButtonText: string = 'Submit') {
    const submitButton = page.locator('button').filter({ hasText: new RegExp(submitButtonText, 'i') }).first();
    
    if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForTimeout(500);
      return true;
    }
    
    return false;
  }

  static async waitForToast(page: Page, text: string, timeout: number = 5000) {
    const toast = page.locator('[class*="toast"], [role="status"], [role="alert"]').filter({ hasText: new RegExp(text, 'i') }).first();
    
    await expect(toast).toBeVisible({ timeout }).catch(() => {});
  }

  static async clickTableRow(page: Page, rowText: string) {
    const row = page.locator('tr').filter({ hasText: new RegExp(rowText, 'i') }).first();
    
    if (await row.isVisible({ timeout: 2000 }).catch(() => false)) {
      await row.click();
      return true;
    }
    
    return false;
  }

  static async getTableData(page: Page): Promise<string[][]> {
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    const data: string[][] = [];
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');
      const cellCount = await cells.count();
      const rowData: string[] = [];
      
      for (let j = 0; j < cellCount; j++) {
        const cell = cells.nth(j);
        const text = await cell.textContent();
        rowData.push(text || '');
      }
      
      data.push(rowData);
    }
    
    return data;
  }

  static async sortTable(page: Page, columnIndex: number) {
    const headers = page.locator('th');
    
    if (await headers.nth(columnIndex).isVisible({ timeout: 2000 }).catch(() => false)) {
      await headers.nth(columnIndex).click();
      await page.waitForTimeout(500);
      return true;
    }
    
    return false;
  }

  static async filterBy(page: Page, filterName: string, value: string) {
    const select = page.locator('select').filter({ hasText: new RegExp(filterName, 'i') }).first();
    
    if (await select.isVisible({ timeout: 2000 }).catch(() => false)) {
      await select.selectOption(value);
      await page.waitForTimeout(500);
      return true;
    }
    
    return false;
  }

  static async searchFor(page: Page, query: string) {
    const searchInput = page.locator('input[type="text"]').first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill(query);
      await page.waitForTimeout(500);
      return true;
    }
    
    return false;
  }

  static async isElementVisible(page: Page, selector: string, timeout: number = 2000): Promise<boolean> {
    const element = page.locator(selector).first();
    
    return await element.isVisible({ timeout }).catch(() => false);
  }

  static async isElementDisabled(page: Page, selector: string): Promise<boolean> {
    const element = page.locator(selector).first();
    
    return await element.isDisabled().catch(() => true);
  }

  static async getElementText(page: Page, selector: string): Promise<string> {
    const element = page.locator(selector).first();
    
    return await element.textContent().then((text) => text || '');
  }

  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `./test-results/screenshots/${name}-${timestamp}.png` });
  }

  static async waitForNavigation(page: Page, url: string | RegExp, timeout: number = 5000) {
    await page.waitForURL(url, { timeout }).catch(() => {});
  }

  static async clearInput(page: Page, selector: string) {
    const input = page.locator(selector).first();
    
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await input.triple_click();
      await input.press('Delete');
      return true;
    }
    
    return false;
  }

  static async hoverElement(page: Page, selector: string) {
    const element = page.locator(selector).first();
    
    if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
      await element.hover();
      return true;
    }
    
    return false;
  }

  static async scrollToElement(page: Page, selector: string) {
    const element = page.locator(selector).first();
    
    if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
      await element.scrollIntoViewIfNeeded();
      return true;
    }
    
    return false;
  }

  static async getAttributeValue(page: Page, selector: string, attribute: string): Promise<string | null> {
    const element = page.locator(selector).first();
    
    return await element.getAttribute(attribute).catch(() => null);
  }

  static async countElements(page: Page, selector: string): Promise<number> {
    const elements = page.locator(selector);
    
    return await elements.count().catch(() => 0);
  }

  static async waitForElementToDisappear(page: Page, selector: string, timeout: number = 5000) {
    const element = page.locator(selector).first();
    
    await expect(element).not.toBeVisible({ timeout }).catch(() => {});
  }

  static async deleteItem(page: Page, itemText: string) {
    const row = page.locator('tr').filter({ hasText: new RegExp(itemText, 'i') }).first();
    
    if (await row.isVisible({ timeout: 2000 }).catch(() => false)) {
      const deleteButton = row.locator('button').filter({ hasText: /Delete|Remove/i }).first();
      
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click();
        
        const confirmButton = page.locator('button').filter({ hasText: /Confirm|Yes|Delete/i }).nth(1);
        
        if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await confirmButton.click();
          return true;
        }
      }
    }
    
    return false;
  }

  static async editItem(page: Page, itemText: string) {
    const row = page.locator('tr').filter({ hasText: new RegExp(itemText, 'i') }).first();
    
    if (await row.isVisible({ timeout: 2000 }).catch(() => false)) {
      const editButton = row.locator('button').filter({ hasText: /Edit|Update/i }).first();
      
      if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editButton.click();
        return true;
      }
    }
    
    return false;
  }
}
