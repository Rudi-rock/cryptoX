#!/usr/bin/env pwsh

# CryptoSolve Automated Setup Script

Write-Host ""
Write-Host "Starting CryptoSolve Setup..." -ForegroundColor Cyan
Write-Host ""

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Verify we're in the right location
if (-not (Test-Path "$scriptDir\backend\package.json")) {
    Write-Host "Error: This script must be run from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Checking npm..." -ForegroundColor Yellow
npm -v | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host "OK: npm is installed" -ForegroundColor Green

# Step 2: Install backend dependencies
Write-Host ""
Write-Host "Step 2: Installing backend dependencies..." -ForegroundColor Yellow
Push-Location "$scriptDir\backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "OK: Dependencies installed" -ForegroundColor Green

# Step 3: Create .env.local if it doesn't exist
Write-Host ""
Write-Host "Step 3: Setting up environment variables..." -ForegroundColor Yellow
$envFile = "$scriptDir\backend\.env.local"
if (-not (Test-Path $envFile)) {
    Copy-Item "$scriptDir\backend\.env.example" $envFile
    Write-Host "OK: .env.local created" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: You need to fill in API keys in:" -ForegroundColor Red
    Write-Host "  backend\.env.local" -ForegroundColor Gray
} else {
    Write-Host "OK: .env.local already exists" -ForegroundColor Green
}

# Step 4: Generate JWT_SECRET if not set
Write-Host ""
Write-Host "Step 4: Configuring JWT secret..." -ForegroundColor Yellow
$envContent = Get-Content $envFile -Raw
if ($envContent -match "JWT_SECRET=your_jwt_secret") {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes("$(Get-Random)$(Get-Date)$(Get-Random)")
    $jwtSecret = [Convert]::ToBase64String($bytes).Substring(0, 32)
    $envContent = $envContent -replace "JWT_SECRET=your_jwt_secret.*", "JWT_SECRET=$jwtSecret"
    Set-Content -Path $envFile -Value $envContent
    Write-Host "OK: JWT_SECRET generated" -ForegroundColor Green
} else {
    Write-Host "OK: JWT_SECRET already configured" -ForegroundColor Green
}

# Step 5: Create start scripts
Write-Host ""
Write-Host "Step 5: Creating start scripts..." -ForegroundColor Yellow

$startBackendScript = @"
# CryptoSolve Backend Starter
Write-Host ""
Write-Host "Starting backend..." -ForegroundColor Cyan
Write-Host "Backend URL: http://localhost:3000/api" -ForegroundColor Yellow
Write-Host ""

Set-Location "backend"
npm run dev
"@

$startFrontendScript = @"
# CryptoSolve Frontend Starter
Write-Host ""
Write-Host "Starting frontend..." -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:5500" -ForegroundColor Yellow
Write-Host ""

python -m http.server 5500
"@

Set-Content -Path "$scriptDir\start-backend.ps1" -Value $startBackendScript
Set-Content -Path "$scriptDir\start-frontend.ps1" -Value $startFrontendScript
Write-Host "OK: Start scripts created" -ForegroundColor Green

# Final summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Edit API keys:" -ForegroundColor Gray
Write-Host "   backend\.env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start backend (Terminal 1):" -ForegroundColor Gray
Write-Host "   .\start-backend.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start frontend (Terminal 2):" -ForegroundColor Gray
Write-Host "   .\start-frontend.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open browser:" -ForegroundColor Gray
Write-Host "   http://localhost:5500" -ForegroundColor Gray
Write-Host ""
