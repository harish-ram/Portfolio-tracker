$BaseUrl = "http://localhost:8080/api"
$Pass = 0
$Fail = 0
$Total = 0

function Log-Test {
    param([string]$Message)
    Write-Host "Testing: $Message" -ForegroundColor Cyan
}

function Log-Pass {
    param([string]$Message)
    Write-Host ("PASS: " + $Message) -ForegroundColor Green
    $script:Pass++
    $script:Total++
}

function Log-Fail {
    param([string]$Message, [string]$Response)
    Write-Host ("FAIL: " + $Message) -ForegroundColor Red
    if ($Response -and $Response.Length -lt 200) {
        Write-Host ("  Response: " + $Response) -ForegroundColor Yellow
    }
    $script:Fail++
    $script:Total++
}

function Test-Endpoint {
    param([string]$Method, [string]$Endpoint, [string]$Data, [string]$TestName, [int[]]$ExpectedCodes = @(200))
    
    Log-Test $TestName
    
    $curlArgs = @()
    $curlArgs += "-s"
    $curlArgs += "-w"
    $curlArgs += "`n%{http_code}"
    $curlArgs += "-X"
    $curlArgs += $Method
    
    if ($Data) {
        $curlArgs += "-H"
        $curlArgs += "Content-Type: application/json"
        $curlArgs += "-d"
        $curlArgs += $Data
    }
    
    $curlArgs += ($BaseUrl + $Endpoint)
    
    $output = & curl $curlArgs
    $httpCode = [int]($output[-1])
    $body = $output -join "`n"
    
    if ($httpCode -in $ExpectedCodes) {
        Log-Pass $TestName
        return $body.Substring(0, $body.Length - ($output[-1].Length + 1))
    } else {
        Log-Fail "$TestName - Expected $ExpectedCodes, got $httpCode" $body.Substring(0, [Math]::Min(200, $body.Length))
        return $null
    }
}

Test-Endpoint "GET" "/stocks" $null "GET /stocks" @(200)

Log-Test "POST /stocks - AAPL"
$stockData = '{
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
$result = Test-Endpoint "POST" "/stocks" $stockData "POST /stocks - AAPL" @(201)

Log-Test "POST /stocks - MSFT"
$stockData = '{
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
$result = Test-Endpoint "POST" "/stocks" $stockData "POST /stocks - MSFT" @(201)

Log-Test "POST /stocks - GOOGL"
$stockData = '{
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
$result = Test-Endpoint "POST" "/stocks" $stockData "POST /stocks - GOOGL" @(201)

Test-Endpoint "GET" "/stocks" $null "GET /stocks - all stocks" @(200)

Test-Endpoint "GET" "/stocks?level=GOAL" $null "GET /stocks?level=GOAL" @(200)

Test-Endpoint "GET" "/stocks?level=WATCH" $null "GET /stocks?level=WATCH" @(200)

Test-Endpoint "GET" "/stocks/AAPL" $null "GET /stocks/AAPL" @(200)

Log-Test "PUT /stocks/AAPL"
$updateData = '{
    "name": "Apple Inc.",
    "price": 155.50,
    "targetPrice": 170.00,
    "level": "BENCH"
}'
$result = Test-Endpoint "PUT" "/stocks/AAPL" $updateData "PUT /stocks/AAPL" @(200, 204)

Log-Test "PUT /stocks/MSFT/level"
$result = Test-Endpoint "PUT" "/stocks/MSFT/level?level=WATCH" $null "PUT /stocks/MSFT/level" @(200, 204)

Test-Endpoint "GET" "/portfolio" $null "GET /portfolio" @(200)

Test-Endpoint "GET" "/portfolio/positions" $null "GET /portfolio/positions" @(200)

Log-Test "POST /transactions - BUY"
$transData = '{
    "date": 1703337600000,
    "symbol": "AAPL",
    "type": "BUY",
    "noOfShares": 100.0,
    "price": 150.00,
    "cost": 15000.00
}'
$result = Test-Endpoint "POST" "/transactions" $transData "POST /transactions - BUY" @(201)

Log-Test "POST /transactions - DIVIDEND"
$divData = '{
    "date": 1703424000000,
    "symbol": "AAPL",
    "type": "DIVIDEND",
    "noOfShares": 100.0,
    "price": 0.95,
    "cost": 95.00
}'
$result = Test-Endpoint "POST" "/transactions" $divData "POST /transactions - DIVIDEND" @(201)

Log-Test "POST /transactions - SELL"
$sellData = '{
    "date": 1703510400000,
    "symbol": "AAPL",
    "type": "SELL",
    "noOfShares": 50.0,
    "price": 155.00,
    "cost": 7750.00
}'
$result = Test-Endpoint "POST" "/transactions" $sellData "POST /transactions - SELL" @(201)

Log-Test "GET /transactions"
$result = Test-Endpoint "GET" "/transactions" $null "GET /transactions" @(200)
$transactionId = $null
if ($result) {
    try {
        $json = $result | ConvertFrom-Json
        if ($json -is [array]) {
            $transactionId = $json[0].id
        } else {
            $transactionId = $json.id
        }
    } catch { }
}

if ($transactionId) {
    Test-Endpoint "GET" "/transactions/$transactionId" $null "GET /transactions/$transactionId" @(200)
}

Test-Endpoint "GET" "/portfolio/positions/AAPL" $null "GET /portfolio/positions/AAPL" @(200, 404)

Log-Test "GET /stocks/INVALID - should fail"
$curlArgs = @("-s", "-w", "`n%{http_code}", "-X", "GET", "$BaseUrl/stocks/INVALID")
$output = & curl $curlArgs
$httpCode = [int]($output[-1])
if ($httpCode -eq 404) {
    Log-Pass "GET /stocks/INVALID returns 404"
} else {
    Log-Fail "GET /stocks/INVALID" "Expected 404, got $httpCode"
}

Log-Test "GET /transactions/99999 - should fail"
$curlArgs = @("-s", "-w", "`n%{http_code}", "-X", "GET", "$BaseUrl/transactions/99999")
$output = & curl $curlArgs
$httpCode = [int]($output[-1])
if ($httpCode -eq 404) {
    Log-Pass "GET /transactions/99999 returns 404"
} else {
    Log-Fail "GET /transactions/99999" "Expected 404, got $httpCode"
}

Log-Test "POST /transactions - invalid data"
$badData = '{
    "date": "invalid",
    "symbol": "AAPL"
}'
$curlArgs = @("-s", "-w", "`n%{http_code}", "-X", "POST", "-H", "Content-Type: application/json", "-d", $badData, "$BaseUrl/transactions")
$output = & curl $curlArgs
$httpCode = [int]($output[-1])
if ($httpCode -eq 400 -or $httpCode -eq 500) {
    Log-Pass "POST /transactions invalid returns error"
} else {
    Log-Fail "POST /transactions invalid" "Expected 400/500, got $httpCode"
}

Log-Test "DELETE /stocks/GOOGL"
$curlArgs = @("-s", "-w", "`n%{http_code}", "-X", "DELETE", "$BaseUrl/stocks/GOOGL")
$output = & curl $curlArgs
$httpCode = [int]($output[-1])
if ($httpCode -eq 204 -or $httpCode -eq 200) {
    Log-Pass "DELETE /stocks/GOOGL"
} else {
    Log-Fail "DELETE /stocks/GOOGL" "Expected 204/200, got $httpCode"
}

Log-Test "GET /stocks/GOOGL - should not exist"
$curlArgs = @("-s", "-w", "`n%{http_code}", "-X", "GET", "$BaseUrl/stocks/GOOGL")
$output = & curl $curlArgs
$httpCode = [int]($output[-1])
if ($httpCode -eq 404) {
    Log-Pass "GET /stocks/GOOGL returns 404 after delete"
} else {
    Log-Fail "GET /stocks/GOOGL" "Expected 404, got $httpCode"
}

if ($transactionId) {
    Log-Test "DELETE /transactions/$transactionId"
    $curlArgs = @("-s", "-w", "`n%{http_code}", "-X", "DELETE", "$BaseUrl/transactions/$transactionId")
    $output = & curl $curlArgs
    $httpCode = [int]($output[-1])
    if ($httpCode -eq 204 -or $httpCode -eq 200) {
        Log-Pass "DELETE /transactions/$transactionId"
    } else {
        Log-Fail "DELETE /transactions/$transactionId" "Expected 204/200, got $httpCode"
    }
}

Write-Host ""
$divider = "===============================" 
Write-Host $divider -ForegroundColor Yellow
Write-Host ("Total Passed: " + $Pass) -ForegroundColor Green
Write-Host ("Total Failed: " + $Fail) -ForegroundColor Red
Write-Host ("Total Tests: " + $Total) -ForegroundColor Cyan
Write-Host $divider -ForegroundColor Yellow

if ($Fail -eq 0) {
    Write-Host "All tests passed" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Some tests failed" -ForegroundColor Red
    exit 1
}
