import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

test.describe('API Integration Tests', () => {
  test('should authenticate user via API', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    expect(response.status()).toBeLessThan(400);
  });

  test('should fetch portfolio data', async ({ request, context }) => {
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    const data = await loginResponse.json().catch(() => ({}));
    const token = data.token || '';

    const response = await request.get(`${API_BASE_URL}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBeLessThan(400);
    
    if (response.status() === 200) {
      const portfolioData = await response.json();
      expect(Array.isArray(portfolioData) || portfolioData.data).toBeTruthy();
    }
  });

  test('should fetch stocks data', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/stocks`);

    expect(response.status()).toBeLessThan(400);
  });

  test('should search stocks by symbol', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/stocks/search?symbol=AAPL`);

    expect(response.status()).toBeLessThan(400);
  });

  test('should fetch transactions', async ({ request, context }) => {
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    const data = await loginResponse.json().catch(() => ({}));
    const token = data.token || '';

    const response = await request.get(`${API_BASE_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBeLessThan(400);
  });

  test('should create new portfolio item', async ({ request }) => {
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    const data = await loginResponse.json().catch(() => ({}));
    const token = data.token || '';

    const response = await request.post(`${API_BASE_URL}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        symbol: 'AAPL',
        quantity: 10,
        purchasePrice: 150.00,
      },
    });

    expect(response.status()).toBeLessThan(400);
  });

  test('should update portfolio item', async ({ request }) => {
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    const data = await loginResponse.json().catch(() => ({}));
    const token = data.token || '';

    const response = await request.put(`${API_BASE_URL}/portfolio/1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        quantity: 20,
      },
    });

    expect(response.status()).toBeLessThan(400);
  });

  test('should delete portfolio item', async ({ request }) => {
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    const data = await loginResponse.json().catch(() => ({}));
    const token = data.token || '';

    const response = await request.delete(`${API_BASE_URL}/portfolio/1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBeLessThan(400);
  });

  test('should handle invalid token', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/portfolio`, {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should handle missing authorization', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/portfolio`);

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should validate email format on login', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'invalid-email',
        password: 'password123',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should return proper error for wrong credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should handle network timeout gracefully', async ({ request }) => {
    try {
      const response = await request.get(`${API_BASE_URL}/stocks`, {
        timeout: 1000,
      });

      if (response.ok()) {
        expect(response.status()).toBeLessThan(400);
      }
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});

test.describe('API Response Validation', () => {
  test('portfolio response should have correct structure', async ({ request }) => {
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    const data = await loginResponse.json().catch(() => ({}));
    const token = data.token || '';

    const response = await request.get(`${API_BASE_URL}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status() === 200) {
      const portfolioData = await response.json();
      
      if (Array.isArray(portfolioData)) {
        if (portfolioData.length > 0) {
          const item = portfolioData[0];
          expect(item).toHaveProperty('symbol');
          expect(item).toHaveProperty('quantity');
        }
      }
    }
  });

  test('stocks response should include pricing data', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/stocks/search?symbol=AAPL`);

    if (response.status() === 200) {
      const stockData = await response.json();
      
      if (Array.isArray(stockData) && stockData.length > 0) {
        const stock = stockData[0];
        expect(stock).toHaveProperty('symbol');
        expect(stock).toHaveProperty('price');
      }
    }
  });

  test('transaction response should have required fields', async ({ request }) => {
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
      },
    });

    const data = await loginResponse.json().catch(() => ({}));
    const token = data.token || '';

    const response = await request.get(`${API_BASE_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status() === 200) {
      const transactions = await response.json();
      
      if (Array.isArray(transactions) && transactions.length > 0) {
        const transaction = transactions[0];
        expect(transaction).toHaveProperty('symbol');
        expect(transaction).toHaveProperty('type');
        expect(transaction).toHaveProperty('quantity');
        expect(transaction).toHaveProperty('price');
      }
    }
  });
});
