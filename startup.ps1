#!/usr/bin/env pwsh

# Auto-Start Script for CryptoSolve
# This script can be scheduled to run automatically

Write-Host ""
Write-Host "CryptoSolve - Automatic Startup" -ForegroundColor Green
Write-Host ""

# Get the directory where the script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if services are already running
function IsServiceRunning {
    param([string]$name)
    
    switch ($name) {
        "backend" {
            $processes = Get-Process node -ErrorAction SilentlyContinue
            return ($processes -ne $null)
        }
        "frontend" {
            $processes = Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*5500*" }
            return ($processes -ne $null)
        }
    }
    return $false
}

# Start backend if not running
if (-not (IsServiceRunning "backend")) {
    Write-Host "Starting backend service..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir' ; .\start-backend.ps1"
}
else {
    Write-Host "Backend is already running" -ForegroundColor Green
}

# Wait a bit
Start-Sleep -Seconds 3

# Start frontend if not running
if (-not (IsServiceRunning "frontend")) {
    Write-Host "Starting frontend service..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir' ; .\start-frontend.ps1"
}
else {
    Write-Host "Frontend is already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "Services started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5500" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:3000/api" -ForegroundColor Yellow
Write-Host ""
