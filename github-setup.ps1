#!/usr/bin/env pwsh

# Interactive GitHub Setup Guide for CryptoSolve

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CryptoSolve - GitHub Setup Wizard" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Git
Write-Host "Step 1: Checking Git installation..." -ForegroundColor Yellow
git --version | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git is not installed!" -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Gray
    exit 1
}
Write-Host "OK: Git is installed" -ForegroundColor Green

# Step 2: Get GitHub username and repo name
Write-Host ""
Write-Host "Step 2: GitHub Repository Details" -ForegroundColor Yellow
$username = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter repository name (default: cryptosolve)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "cryptosolve"
}

Write-Host ""
Write-Host "Creating repository at: https://github.com/$username/$repoName" -ForegroundColor Gray
Write-Host "If you haven't created it yet, go to: https://github.com/new" -ForegroundColor Yellow

$created = Read-Host "Have you created the repository? (y/n)"
if ($created -ne "y") {
    Write-Host ""
    Write-Host "Instructions:" -ForegroundColor Yellow
    Write-Host "1. Go to https://github.com/new" -ForegroundColor Gray
    Write-Host "2. Repository name: $repoName" -ForegroundColor Gray
    Write-Host "3. Choose Public or Private" -ForegroundColor Gray
    Write-Host "4. Do NOT initialize with README" -ForegroundColor Gray
    Write-Host "5. Click 'Create repository'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After creating, run this script again." -ForegroundColor Cyan
    exit 0
}

# Step 3: Configure Git
Write-Host ""
Write-Host "Step 3: Configuring Git..." -ForegroundColor Yellow
$gitName = Read-Host "Enter your name for Git commits (if not already set)"
$gitEmail = Read-Host "Enter your email for Git commits (if not already set)"

if (-not [string]::IsNullOrWhiteSpace($gitName)) {
    git config --global user.name "$gitName"
}
if (-not [string]::IsNullOrWhiteSpace($gitEmail)) {
    git config --global user.email "$gitEmail"
}
Write-Host "OK: Git configured" -ForegroundColor Green

# Step 4: Initialize repo
Write-Host ""
Write-Host "Step 4: Initializing repository..." -ForegroundColor Yellow
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check if .git already exists
if (Test-Path ".git") {
    Write-Host "Repository already initialized" -ForegroundColor Green
}
else {
    git init
    Write-Host "Repository initialized" -ForegroundColor Green
}

# Step 5: Add files
Write-Host ""
Write-Host "Step 5: Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "Files staged" -ForegroundColor Green

# Step 6: Create commit
Write-Host ""
Write-Host "Step 6: Creating initial commit..." -ForegroundColor Yellow
$commitMsg = "Initial commit: CryptoSolve platform - 10 API endpoints, Supabase, full frontend, and automation"
git commit -m "$commitMsg"
Write-Host "Commit created" -ForegroundColor Green

# Step 7: Add remote
Write-Host ""
Write-Host "Step 7: Connecting to GitHub..." -ForegroundColor Yellow
$repoUrl = "https://github.com/$username/$repoName.git"
git remote add origin $repoUrl
Write-Host "Remote added: $repoUrl" -ForegroundColor Green

# Step 8: Rename branch
Write-Host ""
Write-Host "Step 8: Setting up main branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "Branch set to main" -ForegroundColor Green

# Step 9: Push
Write-Host ""
Write-Host "Step 9: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This will prompt for authentication if needed." -ForegroundColor Gray
Write-Host ""

$push = Read-Host "Ready to push? (y/n)"
if ($push -eq "y") {
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "SUCCESS! Repository pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Your repository: https://github.com/$username/$repoName" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Deploy to Vercel:" -ForegroundColor Gray
        Write-Host "   vercel" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "2. Or use Docker:" -ForegroundColor Gray
        Write-Host "   docker-compose up" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "3. Or deploy to your server:" -ForegroundColor Gray
        Write-Host "   git clone https://github.com/$username/$repoName.git" -ForegroundColor Cyan
        Write-Host ""
    }
    else {
        Write-Host "Push failed!" -ForegroundColor Red
        Write-Host "Make sure your GitHub credentials are set up." -ForegroundColor Gray
    }
}
else {
    Write-Host "Push cancelled." -ForegroundColor Yellow
    Write-Host "To push later, run:" -ForegroundColor Gray
    Write-Host "git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""
