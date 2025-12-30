@echo off
setlocal enabledelayedexpansion

set BaseUrl=http://localhost:8080/api
set Pass=0
set Fail=0
set Total=0

echo Testing: GET /stocks
curl -s -X GET "%BaseUrl%/stocks" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /stocks
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /stocks
)

echo.
echo Testing: POST /stocks - AAPL
curl -s -X POST "%BaseUrl%/stocks" -H "Content-Type: application/json" -d "{"symbol":"AAPL","name":"Apple Inc.","price":150.25,"targetPrice":160.00,"divRate":0.95,"divGrowth":8.5,"yearsDivGrowth":12,"creditRating":"AA","comment":"Strong tech stock","level":"GOAL"}" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: POST /stocks - AAPL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: POST /stocks - AAPL
)

echo.
echo Testing: POST /stocks - MSFT
curl -s -X POST "%BaseUrl%/stocks" -H "Content-Type: application/json" -d "{"symbol":"MSFT","name":"Microsoft Corporation","price":380.50,"targetPrice":400.00,"divRate":1.05,"divGrowth":6.0,"yearsDivGrowth":20,"creditRating":"AAA","comment":"Cloud and productivity leader","level":"GOAL"}" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: POST /stocks - MSFT
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: POST /stocks - MSFT
)

echo.
echo Testing: POST /stocks - GOOGL
curl -s -X POST "%BaseUrl%/stocks" -H "Content-Type: application/json" -d "{"symbol":"GOOGL","name":"Alphabet Inc.","price":140.00,"targetPrice":150.00,"divRate":0.0,"divGrowth":0.0,"yearsDivGrowth":0,"creditRating":"AA","comment":"Search and advertising","level":"WATCH"}" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: POST /stocks - GOOGL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: POST /stocks - GOOGL
)

echo.
echo Testing: GET /stocks
curl -s -X GET "%BaseUrl%/stocks" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /stocks - all stocks
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /stocks - all stocks
)

echo.
echo Testing: GET /stocks?level=GOAL
curl -s -X GET "%BaseUrl%/stocks?level=GOAL" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /stocks?level=GOAL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /stocks?level=GOAL
)

echo.
echo Testing: GET /stocks?level=WATCH
curl -s -X GET "%BaseUrl%/stocks?level=WATCH" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /stocks?level=WATCH
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /stocks?level=WATCH
)

echo.
echo Testing: GET /stocks/AAPL
curl -s -X GET "%BaseUrl%/stocks/AAPL" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /stocks/AAPL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /stocks/AAPL
)

echo.
echo Testing: PUT /stocks/AAPL
curl -s -X PUT "%BaseUrl%/stocks/AAPL" -H "Content-Type: application/json" -d "{"name":"Apple Inc.","price":155.50,"targetPrice":170.00,"level":"BENCH"}" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: PUT /stocks/AAPL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: PUT /stocks/AAPL
)

echo.
echo Testing: PUT /stocks/MSFT/level?level=WATCH
curl -s -X PUT "%BaseUrl%/stocks/MSFT/level?level=WATCH" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: PUT /stocks/MSFT/level
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: PUT /stocks/MSFT/level
)

echo.
echo Testing: GET /portfolio
curl -s -X GET "%BaseUrl%/portfolio" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /portfolio
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /portfolio
)

echo.
echo Testing: GET /portfolio/positions
curl -s -X GET "%BaseUrl%/portfolio/positions" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /portfolio/positions
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /portfolio/positions
)

echo.
echo Testing: POST /transactions - BUY
curl -s -X POST "%BaseUrl%/transactions" -H "Content-Type: application/json" -d "{"date":1703337600000,"symbol":"AAPL","type":"BUY","noOfShares":100.0,"price":150.00,"cost":15000.00}" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: POST /transactions - BUY
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: POST /transactions - BUY
)

echo.
echo Testing: POST /transactions - DIVIDEND
curl -s -X POST "%BaseUrl%/transactions" -H "Content-Type: application/json" -d "{"date":1703424000000,"symbol":"AAPL","type":"DIVIDEND","noOfShares":100.0,"price":0.95,"cost":95.00}" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: POST /transactions - DIVIDEND
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: POST /transactions - DIVIDEND
)

echo.
echo Testing: POST /transactions - SELL
curl -s -X POST "%BaseUrl%/transactions" -H "Content-Type: application/json" -d "{"date":1703510400000,"symbol":"AAPL","type":"SELL","noOfShares":50.0,"price":155.00,"cost":7750.00}" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: POST /transactions - SELL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: POST /transactions - SELL
)

echo.
echo Testing: GET /transactions
curl -s -X GET "%BaseUrl%/transactions" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /transactions
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /transactions
)

echo.
echo Testing: GET /portfolio/positions/AAPL
curl -s -X GET "%BaseUrl%/portfolio/positions/AAPL" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /portfolio/positions/AAPL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /portfolio/positions/AAPL
)

echo.
echo Testing: DELETE /stocks/GOOGL
curl -s -X DELETE "%BaseUrl%/stocks/GOOGL" >nul 2>&1
if errorlevel 1 (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: DELETE /stocks/GOOGL
) else (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: DELETE /stocks/GOOGL
)

echo.
echo Testing: GET /stocks/GOOGL - should not exist
curl -s -X GET "%BaseUrl%/stocks/GOOGL" >nul 2>&1
if errorlevel 1 (
    set /a Pass+=1
    set /a Total+=1
    echo PASS: GET /stocks/GOOGL returns error after delete
) else (
    set /a Fail+=1
    set /a Total+=1
    echo FAIL: GET /stocks/GOOGL - should have returned error
)

echo.
echo.
echo ===============================
echo Total Passed: %Pass%
echo Total Failed: %Fail%
echo Total Tests: %Total%
echo ===============================

if %Fail% equ 0 (
    echo All tests passed
    exit /b 0
) else (
    echo Some tests failed
    exit /b 1
)
