#!/usr/bin/env pwsh

# CryptoSolve Test Script - Verifies all components are working

Write-Host ""
Write-Host "🧪 CryptoSolve Platform Test" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

function Test-Component {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Gray -NoNewline
    Write-Host " ... " -ForegroundColor Gray -NoNewline
    
    try {
        $result = & $Test
        if ($result) {
            Write-Host "✓" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "✗" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "✗" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        return $false
    }
}

# Test 1: Node.js installed
if (Test-Component "Node.js/npm installed" {
    $npm = npm -v 2>&1
    $null -ne $npm
}) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 2: Backend directory exists
if (Test-Component "Backend directory" {
    Test-Path "backend"
}) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 3: Backend package.json exists
if (Test-Component "Backend package.json" {
    Test-Path "backend\package.json"
}) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 4: Frontend index.html exists
if (Test-Component "Frontend index.html" {
    Test-Path "index.html"
}) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 5: API client exists
if (Test-Component "Frontend API client" {
    Test-Path "src\api\client.js"
}) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 6: Backend dependencies installed
if (Test-Component "Backend dependencies" {
    Test-Path "backend\node_modules"
}) {
    $testsPassed++
} else {
    $testsFailed++
    Write-Host "  💡 Run: setup.ps1 to install dependencies" -ForegroundColor Yellow
}

# Test 7: .env.example exists
if (Test-Component "Environment template" {
    Test-Path "backend\.env.example"
}) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 8: .env.local exists
if (Test-Component ".env.local configured" {
    Test-Path "backend\.env.local"
}) {
    $testsPassed++
} else {
    $testsFailed++
    Write-Host "  💡 Run: setup.ps1 to create .env.local" -ForegroundColor Yellow
}

# Test 9: Migration file exists
if (Test-Component "Database schema" {
    Test-Path "backend\migrations\001_init_schema.sql"
}) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 10: API routes exist
if (Test-Component "API routes" {
    (Test-Path "backend\src\app\api\auth\route.ts") -and
    (Test-Path "backend\src\app\api\wallet\route.ts") -and
    (Test-Path "backend\src\app\api\orders\route.ts") -and
    (Test-Path "backend\src\app\api\price\route.ts")
}) {
    $testsPassed++
} else {
    $testsFailed++
}

Write-Host ""
Write-Host "Test Results" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host "✓ Passed: $testsPassed" -ForegroundColor Green
Write-Host "✗ Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✅ All tests passed! You're ready to start." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Add API keys to backend\.env.local" -ForegroundColor Gray
    Write-Host "2. Run: .\start-backend.ps1" -ForegroundColor Gray
    Write-Host "3. In another terminal: .\start-frontend.ps1" -ForegroundColor Gray
    Write-Host "4. Open: http://localhost:5500" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Some tests failed. Run setup.ps1 to fix issues." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Command: .\setup.ps1" -ForegroundColor Cyan
}

Write-Host ""
