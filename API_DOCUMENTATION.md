# Portfolio Manager REST API Documentation

Complete REST API documentation for the Portfolio Manager backend.

## Base URL

```
http://localhost:8080/api
```

## Content-Type

All requests and responses use `application/json`.

## CORS

The API is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173`

## Stock Endpoints

### Get All Stocks

```
GET /stocks
```

**Query Parameters:**
- `level` (optional): Filter by level - `WATCH`, `GOAL`, or `BENCH`

**Example:**
```bash
GET /stocks?level=WATCH
```

**Response:**
```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 150.25,
    "changePerc": 2.5,
    "targetPrice": 160.00,
    "divRate": 0.95,
    "divGrowth": 8.5,
    "yearsDivGrowth": 12,
    "creditRating": "AA",
    "comment": "Strong tech stock",
    "level": "GOAL"
  }
]
```

### Get Single Stock

```
GET /stocks/{symbol}
```

**Example:**
```bash
GET /stocks/AAPL
```

**Response:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.25,
  "changePerc": 2.5,
  "targetPrice": 160.00,
  "divRate": 0.95,
  "divGrowth": 8.5,
  "yearsDivGrowth": 12,
  "creditRating": "AA",
  "comment": "Strong tech stock",
  "level": "GOAL"
}
```

### Create Stock

```
POST /stocks
```

**Request Body:**
```json
{
  "symbol": "MSFT",
  "name": "Microsoft Corporation",
  "price": 380.50,
  "targetPrice": 400.00,
  "divRate": 1.05,
  "divGrowth": 6.0,
  "yearsDivGrowth": 20,
  "creditRating": "AAA",
  "comment": "Cloud and productivity leader",
  "level": "GOAL"
}
```

**Response:** (201 Created)
```json
{
  "symbol": "MSFT",
  "name": "Microsoft Corporation",
  "price": 380.50,
  "changePerc": 0.0,
  "targetPrice": 400.00,
  "divRate": 1.05,
  "divGrowth": 6.0,
  "yearsDivGrowth": 20,
  "creditRating": "AAA",
  "comment": "Cloud and productivity leader",
  "level": "GOAL"
}
```

### Update Stock

```
PUT /stocks/{symbol}
```

**Request Body:**
```json
{
  "name": "Apple Inc.",
  "price": 155.50,
  "targetPrice": 170.00,
  "level": "BENCH"
}
```

**Response:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 155.50,
  "changePerc": 3.5,
  "targetPrice": 170.00,
  "divRate": 0.95,
  "divGrowth": 8.5,
  "yearsDivGrowth": 12,
  "creditRating": "AA",
  "comment": "Strong tech stock",
  "level": "BENCH"
}
```

### Delete Stock

```
DELETE /stocks/{symbol}
```

**Response:** (204 No Content)

### Set Stock Level

```
PUT /stocks/{symbol}/level?level={level}
```

**Query Parameters:**
- `level` (required): `WATCH`, `GOAL`, or `BENCH`

**Example:**
```bash
PUT /stocks/AAPL/level?level=GOAL
```

**Response:** (204 No Content)

## Portfolio Endpoints

### Get Portfolio Summary

```
GET /portfolio
```

**Response:**
```json
{
  "currentCost": 50000.00,
  "currentValue": 55000.00,
  "currentResult": 5000.00,
  "currentResultPercentage": 10.0,
  "totalCost": 100000.00,
  "annualIncome": 1500.00,
  "totalIncome": 5000.00,
  "yieldOnCost": 1.5,
  "realizedResult": 2000.00,
  "totalReturn": 7000.00,
  "totalReturnPercentage": 7.0
}
```

### Get All Positions

```
GET /portfolio/positions
```

**Response:**
```json
[
  {
    "symbol": "AAPL",
    "stockName": "Apple Inc.",
    "noOfShares": 100.0,
    "currentCost": 15000.00,
    "totalCost": 15000.00,
    "costPerShare": 150.00,
    "currentValue": 15525.00,
    "unrealizedResult": 525.00,
    "unrealizedResultPercentage": 3.5,
    "totalIncome": 95.00,
    "annualIncome": 95.00,
    "yieldOnCost": 0.63,
    "totalReturn": 620.00
  }
]
```

### Get Single Position

```
GET /portfolio/positions/{symbol}
```

**Example:**
```bash
GET /portfolio/positions/AAPL
```

**Response:**
```json
{
  "symbol": "AAPL",
  "stockName": "Apple Inc.",
  "noOfShares": 100.0,
  "currentCost": 15000.00,
  "totalCost": 15000.00,
  "costPerShare": 150.00,
  "currentValue": 15525.00,
  "unrealizedResult": 525.00,
  "unrealizedResultPercentage": 3.5,
  "totalIncome": 95.00,
  "annualIncome": 95.00,
  "yieldOnCost": 0.63,
  "totalReturn": 620.00
}
```

## Transaction Endpoints

### Get All Transactions

```
GET /transactions
```

**Response:**
```json
[
  {
    "id": 1,
    "date": 1703337600000,
    "symbol": "AAPL",
    "type": "BUY",
    "noOfShares": 100.0,
    "price": 150.00,
    "cost": 15000.00
  },
  {
    "id": 2,
    "date": 1703424000000,
    "symbol": "AAPL",
    "type": "DIVIDEND",
    "noOfShares": 100.0,
    "price": 0.95,
    "cost": 95.00
  }
]
```

### Get Single Transaction

```
GET /transactions/{id}
```

**Example:**
```bash
GET /transactions/1
```

**Response:**
```json
{
  "id": 1,
  "date": 1703337600000,
  "symbol": "AAPL",
  "type": "BUY",
  "noOfShares": 100.0,
  "price": 150.00,
  "cost": 15000.00
}
```

### Create Transaction

```
POST /transactions
```

**Request Body:**
```json
{
  "date": 1703337600000,
  "symbol": "AAPL",
  "type": "BUY",
  "noOfShares": 50.0,
  "price": 155.00,
  "cost": 7750.00
}
```

**Required Fields:**
- `date`: Unix timestamp in milliseconds
- `symbol`: Stock ticker symbol
- `type`: `BUY`, `SELL`, or `DIVIDEND`
- `noOfShares`: Number of shares
- `price`: Price per share
- `cost`: Total transaction cost

**Response:** (201 Created)
```json
{
  "id": 3,
  "date": 1703337600000,
  "symbol": "AAPL",
  "type": "BUY",
  "noOfShares": 50.0,
  "price": 155.00,
  "cost": 7750.00
}
```

### Delete Transaction

```
DELETE /transactions/{id}
```

**Example:**
```bash
DELETE /transactions/3
```

**Response:** (204 No Content)

## Error Handling

### Error Response Format

```json
{
  "timestamp": "2023-12-23T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid stock symbol"
}
```

### Common Error Codes

- **400 Bad Request**: Invalid parameters or malformed request
- **404 Not Found**: Resource not found (e.g., stock symbol doesn't exist)
- **500 Internal Server Error**: Server-side error

## Data Types

### Stock Object
- `symbol` (string): Unique stock ticker symbol
- `name` (string): Company name
- `price` (number): Current price
- `changePerc` (number): Percentage change
- `targetPrice` (number): Target purchase price
- `divRate` (number): Dividend rate
- `divGrowth` (number): Dividend growth rate
- `yearsDivGrowth` (number): Years of dividend growth
- `creditRating` (string): Credit rating (NA, A, AA, AAA, etc.)
- `comment` (string): User notes
- `level` (string): Classification level (WATCH, GOAL, BENCH)

### Transaction Types
- `BUY`: Buy transaction
- `SELL`: Sell transaction
- `DIVIDEND`: Dividend received

### Position Object
Automatically calculated from transactions. Contains aggregated metrics about a held position.

### Portfolio Object
Aggregated metrics for the entire portfolio calculated from all positions.

## Rate Limiting

No rate limiting is currently implemented. In production, consider implementing rate limiting per IP or API key.

## Authentication

No authentication is currently implemented. For production use, consider adding:
- JWT tokens
- OAuth 2.0
- API keys

## Caching

No response caching is implemented. For better performance, consider:
- HTTP caching headers
- Redis caching for frequently accessed data
- Client-side caching strategies

## Best Practices

1. **Stock Symbols**: Use uppercase symbols (e.g., AAPL, MSFT)
2. **Dates**: All dates are in Unix timestamps (milliseconds since epoch)
3. **Numbers**: Use floating-point numbers for prices and quantities
4. **Error Handling**: Always check HTTP status codes and handle errors appropriately
5. **Performance**: Use the level filter when retrieving stocks to reduce payload

## Example Workflow

1. **Add a stock to track:**
   ```bash
   POST /stocks
   ```

2. **Create a buy transaction:**
   ```bash
   POST /transactions
   ```

3. **View portfolio:**
   ```bash
   GET /portfolio
   ```

4. **Check your position:**
   ```bash
   GET /portfolio/positions/AAPL
   ```

5. **Record a dividend:**
   ```bash
   POST /transactions (with type=DIVIDEND)
   ```

## Testing

Use tools like Postman, Insomnia, or cURL to test API endpoints:

```bash
# Get all stocks
curl -X GET "http://localhost:8080/api/stocks"

# Add a stock
curl -X POST "http://localhost:8080/api/stocks" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","name":"Apple Inc.","price":150.00}'

# Get portfolio
curl -X GET "http://localhost:8080/api/portfolio"
```

For more examples and integration details, see the frontend code in `frontend/src/services/api.ts`.
