#!/usr/bin/env pwsh

# CryptoSolve Master Startup Script
# Launches both backend and frontend services

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CryptoSolve Platform - Master Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if backend is already running
$backendProcess = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*backend*" }
if ($backendProcess) {
    Write-Host "Backend already running (PID: $($backendProcess.Id))" -ForegroundColor Yellow
}
else {
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir' ; .\start-backend.ps1"
    Start-Sleep -Seconds 3
    Write-Host "Backend started (opening new window)" -ForegroundColor Green
}

# Check if frontend is already running
$frontendProcess = Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*5500*" }
if ($frontendProcess) {
    Write-Host "Frontend already running (PID: $($frontendProcess.Id))" -ForegroundColor Yellow
}
else {
    Write-Host "Starting frontend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir' ; .\start-frontend.ps1"
    Start-Sleep -Seconds 2
    Write-Host "Frontend started (opening new window)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both services are running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:5500" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:3000/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "Close the terminal windows to stop services." -ForegroundColor Gray
Write-Host ""
