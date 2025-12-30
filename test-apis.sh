#!/bin/bash

BASE_URL="http://localhost:8080/api"
PASS=0
FAIL=0
TOTAL=0

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Timestamp for unique test data
TIMESTAMP=$(date +%s)

log_test() {
    echo -e "${BLUE}Testing: $1${NC}"
}

log_pass() {
    echo -e "${GREEN}✓ PASS: $1${NC}"
    ((PASS++))
    ((TOTAL++))
}

log_fail() {
    echo -e "${RED}✗ FAIL: $1${NC}"
    echo "  Response: $2"
    ((FAIL++))
    ((TOTAL++))
}

# Test 1: Get All Stocks (Empty at first)
log_test "GET /stocks"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/stocks")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ]; then
    log_pass "GET /stocks"
else
    log_fail "GET /stocks - Expected 200, got $http_code" "$body"
fi

# Test 2: Create Stock 1
log_test "POST /stocks (Create AAPL)"
stock_data='{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.25,
  "targetPrice": 160.00,
  "divRate": 0.95,
  "divGrowth": 8.5,
  "yearsDivGrowth": 12,
  "creditRating": "AA",
  "comment": "Strong tech stock",
  "level": "GOAL"
}'
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/stocks" \
  -H "Content-Type: application/json" \
  -d "$stock_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "201" ]; then
    log_pass "POST /stocks (Create AAPL)"
else
    log_fail "POST /stocks - Expected 201, got $http_code" "$body"
fi

# Test 3: Create Stock 2
log_test "POST /stocks (Create MSFT)"
stock_data='{
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
}'
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/stocks" \
  -H "Content-Type: application/json" \
  -d "$stock_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "201" ]; then
    log_pass "POST /stocks (Create MSFT)"
else
    log_fail "POST /stocks - Expected 201, got $http_code" "$body"
fi

# Test 4: Create Stock 3 for WATCH level
log_test "POST /stocks (Create GOOGL)"
stock_data='{
  "symbol": "GOOGL",
  "name": "Alphabet Inc.",
  "price": 140.00,
  "targetPrice": 150.00,
  "divRate": 0.0,
  "divGrowth": 0.0,
  "yearsDivGrowth": 0,
  "creditRating": "AA",
  "comment": "Search and advertising",
  "level": "WATCH"
}'
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/stocks" \
  -H "Content-Type: application/json" \
  -d "$stock_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "201" ]; then
    log_pass "POST /stocks (Create GOOGL)"
else
    log_fail "POST /stocks - Expected 201, got $http_code" "$body"
fi

# Test 5: Get All Stocks
log_test "GET /stocks (All stocks)"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/stocks")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ] && echo "$body" | grep -q "AAPL"; then
    log_pass "GET /stocks (All stocks)"
else
    log_fail "GET /stocks - Expected 200 with AAPL, got $http_code" "$body"
fi

# Test 6: Get Stocks by level (GOAL)
log_test "GET /stocks?level=GOAL"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/stocks?level=GOAL")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ] && echo "$body" | grep -q "AAPL"; then
    log_pass "GET /stocks?level=GOAL"
else
    log_fail "GET /stocks?level=GOAL - Expected 200 with AAPL, got $http_code" "$body"
fi

# Test 7: Get Stocks by level (WATCH)
log_test "GET /stocks?level=WATCH"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/stocks?level=WATCH")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ] && echo "$body" | grep -q "GOOGL"; then
    log_pass "GET /stocks?level=WATCH"
else
    log_fail "GET /stocks?level=WATCH - Expected 200 with GOOGL, got $http_code" "$body"
fi

# Test 8: Get Single Stock
log_test "GET /stocks/AAPL"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/stocks/AAPL")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ] && echo "$body" | grep -q "Apple Inc"; then
    log_pass "GET /stocks/AAPL"
else
    log_fail "GET /stocks/AAPL - Expected 200, got $http_code" "$body"
fi

# Test 9: Update Stock
log_test "PUT /stocks/AAPL"
update_data='{
  "name": "Apple Inc.",
  "price": 155.50,
  "targetPrice": 170.00,
  "level": "BENCH"
}'
response=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/stocks/AAPL" \
  -H "Content-Type: application/json" \
  -d "$update_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ] && echo "$body" | grep -q "BENCH"; then
    log_pass "PUT /stocks/AAPL"
else
    log_fail "PUT /stocks/AAPL - Expected 200, got $http_code" "$body"
fi

# Test 10: Set Stock Level
log_test "PUT /stocks/MSFT/level?level=WATCH"
response=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/stocks/MSFT/level?level=WATCH")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "204" ] || [ "$http_code" == "200" ]; then
    log_pass "PUT /stocks/MSFT/level?level=WATCH"
else
    log_fail "PUT /stocks/MSFT/level - Expected 204/200, got $http_code" "$body"
fi

# Test 11: Get Portfolio Summary
log_test "GET /portfolio"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/portfolio")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ]; then
    log_pass "GET /portfolio"
else
    log_fail "GET /portfolio - Expected 200, got $http_code" "$body"
fi

# Test 12: Get All Positions
log_test "GET /portfolio/positions"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/portfolio/positions")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ]; then
    log_pass "GET /portfolio/positions"
else
    log_fail "GET /portfolio/positions - Expected 200, got $http_code" "$body"
fi

# Test 13: Create Transaction (BUY)
log_test "POST /transactions (BUY)"
trans_data='{
  "date": 1703337600000,
  "symbol": "AAPL",
  "type": "BUY",
  "noOfShares": 100.0,
  "price": 150.00,
  "cost": 15000.00
}'
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -d "$trans_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
transaction_id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ "$http_code" == "201" ]; then
    log_pass "POST /transactions (BUY)"
else
    log_fail "POST /transactions - Expected 201, got $http_code" "$body"
fi

# Test 14: Create Transaction (DIVIDEND)
log_test "POST /transactions (DIVIDEND)"
div_data='{
  "date": 1703424000000,
  "symbol": "AAPL",
  "type": "DIVIDEND",
  "noOfShares": 100.0,
  "price": 0.95,
  "cost": 95.00
}'
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -d "$div_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "201" ]; then
    log_pass "POST /transactions (DIVIDEND)"
else
    log_fail "POST /transactions - Expected 201, got $http_code" "$body"
fi

# Test 15: Create Transaction (SELL)
log_test "POST /transactions (SELL)"
sell_data='{
  "date": 1703510400000,
  "symbol": "AAPL",
  "type": "SELL",
  "noOfShares": 50.0,
  "price": 155.00,
  "cost": 7750.00
}'
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -d "$sell_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "201" ]; then
    log_pass "POST /transactions (SELL)"
else
    log_fail "POST /transactions - Expected 201, got $http_code" "$body"
fi

# Test 16: Get All Transactions
log_test "GET /transactions"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/transactions")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ]; then
    log_pass "GET /transactions"
    transaction_id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
else
    log_fail "GET /transactions - Expected 200, got $http_code" "$body"
fi

# Test 17: Get Single Transaction (if we have an ID)
if [ ! -z "$transaction_id" ]; then
    log_test "GET /transactions/$transaction_id"
    response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/transactions/$transaction_id")
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    if [ "$http_code" == "200" ]; then
        log_pass "GET /transactions/$transaction_id"
    else
        log_fail "GET /transactions/$transaction_id - Expected 200, got $http_code" "$body"
    fi
fi

# Test 18: Get Single Position
log_test "GET /portfolio/positions/AAPL"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/portfolio/positions/AAPL")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "200" ] || [ "$http_code" == "404" ]; then
    if [ "$http_code" == "200" ]; then
        log_pass "GET /portfolio/positions/AAPL"
    else
        log_pass "GET /portfolio/positions/AAPL (404 - position doesn't exist)"
    fi
else
    log_fail "GET /portfolio/positions/AAPL - Expected 200 or 404, got $http_code" "$body"
fi

# Test 19: Test Invalid Stock Symbol (should 404)
log_test "GET /stocks/INVALID (should fail)"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/stocks/INVALID")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "404" ]; then
    log_pass "GET /stocks/INVALID returns 404"
else
    log_fail "GET /stocks/INVALID - Expected 404, got $http_code" "$body"
fi

# Test 20: Test Invalid Transaction ID (should 404)
log_test "GET /transactions/99999 (should fail)"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/transactions/99999")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "404" ]; then
    log_pass "GET /transactions/99999 returns 404"
else
    log_fail "GET /transactions/99999 - Expected 404, got $http_code" "$body"
fi

# Test 21: Test Malformed Request (should 400)
log_test "POST /transactions with invalid data (should fail)"
bad_data='{
  "date": "invalid",
  "symbol": "AAPL"
}'
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -d "$bad_data")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "400" ] || [ "$http_code" == "500" ]; then
    log_pass "POST /transactions with invalid data returns error"
else
    log_fail "POST /transactions with invalid data - Expected 400/500, got $http_code" "$body"
fi

# Test 22: Delete Stock (if needed, using GOOGL as test)
log_test "DELETE /stocks/GOOGL"
response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/stocks/GOOGL")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "204" ] || [ "$http_code" == "200" ]; then
    log_pass "DELETE /stocks/GOOGL"
else
    log_fail "DELETE /stocks/GOOGL - Expected 204/200, got $http_code" "$body"
fi

# Test 23: Verify deletion
log_test "GET /stocks/GOOGL (should not exist)"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/stocks/GOOGL")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)
if [ "$http_code" == "404" ]; then
    log_pass "GET /stocks/GOOGL returns 404 after deletion"
else
    log_fail "GET /stocks/GOOGL - Expected 404, got $http_code" "$body"
fi

# Test 24: Delete Transaction (if we have a transaction ID)
if [ ! -z "$transaction_id" ]; then
    log_test "DELETE /transactions/$transaction_id"
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/transactions/$transaction_id")
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    if [ "$http_code" == "204" ] || [ "$http_code" == "200" ]; then
        log_pass "DELETE /transactions/$transaction_id"
    else
        log_fail "DELETE /transactions/$transaction_id - Expected 204/200, got $http_code" "$body"
    fi
fi

# Summary
echo ""
echo -e "${YELLOW}========== TEST SUMMARY ==========${NC}"
echo -e "${GREEN}Total Passed: $PASS${NC}"
echo -e "${RED}Total Failed: $FAIL${NC}"
echo -e "${BLUE}Total Tests: $TOTAL${NC}"
echo -e "${YELLOW}=================================${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
