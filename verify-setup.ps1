#!/usr/bin/env pwsh

# CryptoSolve Setup Verification Script

Write-Host ""
Write-Host "Verifying CryptoSolve Setup..." -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Test 1: Node.js
Write-Host -NoNewline "Node.js/npm installed "
if (npm -v 2>&1 | Out-Null) {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Backend directory
Write-Host -NoNewline "Backend directory exists "
if (Test-Path "backend") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

# Test 3: package.json
Write-Host -NoNewline "Backend package.json "
if (Test-Path "backend\package.json") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

# Test 4: Frontend
Write-Host -NoNewline "Frontend index.html "
if (Test-Path "index.html") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

# Test 5: API client
Write-Host -NoNewline "API client (src/api/client.js) "
if (Test-Path "src\api\client.js") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

# Test 6: node_modules
Write-Host -NoNewline "Dependencies installed "
if (Test-Path "backend\node_modules") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
    Write-Host "  Run: setup.ps1 to install" -ForegroundColor Yellow
}

# Test 7: .env.example
Write-Host -NoNewline "Environment template "
if (Test-Path "backend\.env.example") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

# Test 8: .env.local
Write-Host -NoNewline "Environment configured "
if (Test-Path "backend\.env.local") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
    Write-Host "  Run: setup.ps1 to configure" -ForegroundColor Yellow
}

# Test 9: Database schema
Write-Host -NoNewline "Database schema file "
if (Test-Path "backend\migrations\001_init_schema.sql") {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

# Test 10: API routes
Write-Host -NoNewline "API routes implemented "
if ((Test-Path "backend\src\app\api\auth\route.ts") -and 
    (Test-Path "backend\src\app\api\wallet\route.ts") -and
    (Test-Path "backend\src\app\api\price\route.ts")) {
    Write-Host "[PASS]" -ForegroundColor Green
    $testsPassed++
}
else {
    Write-Host "[FAIL]" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Results: $testsPassed passed, $testsFailed failed" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "All checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Add API keys to: backend\.env.local" -ForegroundColor Gray
    Write-Host "2. Run backend:     .\start-backend.ps1" -ForegroundColor Gray
    Write-Host "3. Run frontend:    .\start-frontend.ps1" -ForegroundColor Gray
    Write-Host "4. Open browser:    http://localhost:5500" -ForegroundColor Gray
}
else {
    Write-Host "Some checks failed." -ForegroundColor Yellow
    Write-Host "Run: .\setup.ps1" -ForegroundColor Cyan
}

Write-Host ""
