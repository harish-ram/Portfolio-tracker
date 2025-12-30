# Playwright Automation Tests

Comprehensive end-to-end testing suite for the Portfolio Manager frontend application using Playwright.

## Test Files Overview

### **auth.spec.ts**
Tests for authentication and login functionality:
- Login page display
- Invalid credentials handling
- Form validation (email, password required)
- Email format validation
- Remember me checkbox functionality

### **dashboard.spec.ts**
Tests for the Dashboard page:
- Dashboard content display
- Statistics cards rendering
- Portfolio chart display
- Navigation functionality
- Loading states
- Mobile responsiveness

### **portfolio.spec.ts**
Tests for the Portfolio page:
- Portfolio display and table rendering
- Add/Edit/Delete portfolio items
- Modal interactions
- Portfolio statistics
- Pagination handling
- Mobile responsiveness

### **stocks.spec.ts**
Tests for the Stocks page:
- Stock list display
- Search functionality
- Stock selection and details
- Price information display
- Add to portfolio flow
- Loading states
- Empty state handling

### **transactions.spec.ts**
Tests for the Transactions page:
- Transaction list display
- Transaction table and columns
- Filtering by type and date
- Sorting functionality
- Pagination
- Delete transaction functionality
- Mobile responsiveness

### **components.spec.ts**
Tests for reusable components:
- **Modal Component**: Open/close, title, actions
- **Form Component**: Field display, validation, submission
- **DataTable Component**: Display, headers, rows, sorting, pagination
- **Navbar Component**: Navigation links, logo, user profile
- **Loading Spinner Component**: Display and hiding
- **Error Banner Component**: Error message display
- **Success Banner Component**: Success message display
- **Stat Card Component**: Display and values

### **e2e-flows.spec.ts**
End-to-end user flow tests:
- Full navigation workflow
- Add stock to portfolio flow
- Update portfolio item
- Delete portfolio item with confirmation
- View transaction history
- Filter and view transaction details
- Dashboard access from all pages
- Mobile responsive navigation
- Session persistence across navigation
- Back button navigation
- Page refresh without losing session
- **Performance Tests**: Page load times
- **Accessibility Tests**: Heading hierarchy, alt text, labels, buttons

### **api-integration.spec.ts**
API integration tests:
- User authentication via API
- Fetch portfolio data
- Fetch stocks data
- Search stocks by symbol
- Fetch transactions
- Create/Update/Delete portfolio items
- Invalid token handling
- Error handling and validation
- API response structure validation

### **helpers.ts**
Utility functions for tests:
- `login()`: Authenticate user
- `logout()`: Sign out user
- `navigateTo()`: Navigate to pages
- `openModal()`: Open modal dialogs
- `closeModal()`: Close modal dialogs
- `fillForm()`: Fill form fields
- `submitForm()`: Submit forms
- `waitForToast()`: Wait for notifications
- `clickTableRow()`: Click table rows
- `getTableData()`: Extract table data
- `sortTable()`: Sort table columns
- `filterBy()`: Apply filters
- `searchFor()`: Search functionality
- `isElementVisible()`: Check visibility
- `isElementDisabled()`: Check if disabled
- `getElementText()`: Get element text
- `takeScreenshot()`: Capture screenshots
- `deleteItem()`: Delete table items
- `editItem()`: Edit table items
- And more utility functions...

## Installation

```bash
npm install -D @playwright/test
```

## Configuration

The `playwright.config.ts` file is pre-configured with:
- Base URL: `http://localhost:5173`
- Multiple browsers: Chromium, Firefox, WebKit
- Mobile devices: Pixel 5, iPhone 12
- Screenshot capture on failure
- HTML report generation
- Automatic dev server startup

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/auth.spec.ts
```

### Run tests with specific pattern
```bash
npx playwright test -g "should display login page"
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
```

### Run tests in parallel (default)
```bash
npx playwright test --workers=4
```

### Run tests serially
```bash
npx playwright test --workers=1
```

## Environment Variables

Set these environment variables for test execution:

```bash
TEST_EMAIL=your-test-email@example.com
TEST_PASSWORD=your-test-password
API_BASE_URL=http://localhost:8080/api
```

Example `.env.local` for tests:
```
TEST_EMAIL=test@example.com
TEST_PASSWORD=password123
API_BASE_URL=http://localhost:8080/api
```

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports are generated in the `playwright-report` directory.

## CI/CD Integration

For CI/CD pipelines (GitHub Actions, Jenkins, etc.):

```bash
CI=1 npm run test
```

This will:
- Run tests serially
- Retry failed tests twice
- Disable server reuse
- Generate reports

## Test Coverage

The test suite covers:
- ✅ Authentication and login flows
- ✅ Dashboard functionality
- ✅ Portfolio management (CRUD operations)
- ✅ Stock search and selection
- ✅ Transaction tracking
- ✅ Component interactions
- ✅ Form validation
- ✅ Error handling
- ✅ API integration
- ✅ End-to-end user flows
- ✅ Mobile responsiveness
- ✅ Performance metrics
- ✅ Accessibility compliance

## Debugging Tips

### Enable debug mode
```bash
npm run test:debug
```

### View browser interactions
```bash
npx playwright test --headed
```

### Enable trace for failed tests
Tests already capture traces on failure. Inspect with:
```bash
npx playwright show-trace trace.zip
```

### Screenshot on failure
Screenshots are automatically captured for failed tests in the test-results directory.

## Best Practices

1. **Use test fixtures** for common setup (authentication, etc.)
2. **Use helper functions** from `helpers.ts` for repeated actions
3. **Add timeouts** when waiting for dynamic elements
4. **Use data-testid** attributes for reliable element selection
5. **Test user flows** not implementation details
6. **Keep tests independent** - don't rely on test execution order
7. **Use page objects** pattern for complex pages
8. **Mock API responses** when needed for faster tests

## Troubleshooting

### Tests fail with "Could not find browser"
```bash
npx playwright install
```

### Port 5173 already in use
Change port in `vite.config.ts` or kill process using the port.

### Tests timeout
Increase timeout in `playwright.config.ts`:
```typescript
use: {
  navigationTimeout: 30000,
  actionTimeout: 10000,
}
```

### API tests fail
Ensure backend API is running on the configured `API_BASE_URL`.

## Adding New Tests

1. Create a new `.spec.ts` file in the `tests` directory
2. Import `{ test, expect }` from `./fixtures` or `@playwright/test`
3. Use helper functions from `helpers.ts` for common actions
4. Follow existing test patterns
5. Add descriptive test names and comments

Example:
```typescript
import { test, expect } from './fixtures';
import { TestHelpers } from './helpers';

test.describe('My New Feature', () => {
  test('should do something', async ({ page, authenticatedPage }) => {
    await page.goto('/my-page');
    
    const element = page.locator('.my-element');
    await expect(element).toBeVisible();
  });
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Configuration Guide](https://playwright.dev/docs/test-configuration)
- [API Reference](https://playwright.dev/docs/api/class-test)
- [Debugging Guide](https://playwright.dev/docs/debug)
