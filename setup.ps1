#!/usr/bin/env pwsh

# CryptoSolve Automated Setup Script
# This script sets up the complete backend and frontend environment

Write-Host "🚀 CryptoSolve Complete Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Verify we're in the right location
if (-not (Test-Path "$scriptDir\backend\package.json")) {
    Write-Host "❌ Error: This script must be run from the project root directory" -ForegroundColor Red
    Write-Host "📍 Current location: $scriptDir" -ForegroundColor Yellow
    exit 1
}

# Colors for output
$success = @{ ForegroundColor = "Green" }
$error_color = @{ ForegroundColor = "Red" }
$warning = @{ ForegroundColor = "Yellow" }
$info = @{ ForegroundColor = "Cyan" }

# Step 1: Check Node.js and npm
Write-Host "Step 1: Checking dependencies..." @info
$nodeVersion = npm -v 2>&1 | Select-Object -First 1
if ($null -eq $nodeVersion) {
    Write-Host "❌ npm is not installed. Please install Node.js first: https://nodejs.org" @error_color
    exit 1
}
Write-Host "✓ npm version: $nodeVersion" @success

# Step 2: Install backend dependencies
Write-Host "`nStep 2: Installing backend dependencies..." @info
Push-Location "$scriptDir\backend"
Write-Host "📦 Running: npm install" @warning
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" @error_color
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "✓ Backend dependencies installed" @success

# Step 3: Create .env.local if it doesn't exist
Write-Host "`nStep 3: Setting up environment variables..." @info
$envFile = "$scriptDir\backend\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "📝 Creating .env.local from .env.example" @warning
    Copy-Item "$scriptDir\backend\.env.example" $envFile
    Write-Host "✓ .env.local created" @success
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: You need to fill in API keys in: $envFile" @warning
    Write-Host ""
    Write-Host "Required API keys:" @info
    Write-Host "  • Supabase: https://supabase.com" -ForegroundColor Gray
    Write-Host "  • Tatum.io: https://tatum.io" -ForegroundColor Gray
    Write-Host "  • Cashfree: https://cashfree.com" -ForegroundColor Gray
    Write-Host "  • HyperVerge: https://hyperverge.co" -ForegroundColor Gray
    Write-Host ""
    Write-Host "For testing without API keys, use dummy values in .env.local" @warning
} else {
    Write-Host "✓ .env.local already exists" @success
}

# Step 4: Generate JWT_SECRET if not set
Write-Host "`nStep 4: Configuring JWT secret..." @info
$envContent = Get-Content $envFile -Raw
if ($envContent -match "JWT_SECRET=your_jwt_secret") {
    Write-Host "📝 Generating secure JWT_SECRET..." @warning
    # Generate a random string (base64)
    $bytes = [System.Text.Encoding]::UTF8.GetBytes("$(Get-Random)$(Get-Date)$(Get-Random)")
    $jwtSecret = [Convert]::ToBase64String($bytes).Substring(0, 32)
    $envContent = $envContent -replace "JWT_SECRET=your_jwt_secret.*", "JWT_SECRET=$jwtSecret"
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✓ JWT_SECRET generated: $($jwtSecret.Substring(0, 10))..." @success
} else {
    Write-Host "✓ JWT_SECRET already configured" @success
}

# Step 5: Create start scripts
Write-Host "`nStep 5: Creating start scripts..." @info

$startBackendScript = @"
#!/usr/bin/env pwsh
# Start CryptoSolve Backend

Write-Host "`n🚀 Starting CryptoSolve Backend..." -ForegroundColor Cyan
Write-Host "Backend will run at: http://localhost:3000/api" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

Set-Location "backend"
npm run dev
"@

$startFrontendScript = @"
#!/usr/bin/env pwsh
# Start CryptoSolve Frontend

Write-Host "`n🚀 Starting CryptoSolve Frontend..." -ForegroundColor Cyan
Write-Host "Frontend will run at: http://localhost:5500" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

python -m http.server 5500
"@

Set-Content -Path "$scriptDir\start-backend.ps1" -Value $startBackendScript
Set-Content -Path "$scriptDir\start-frontend.ps1" -Value $startFrontendScript
Write-Host "✓ Start scripts created" @success

# Step 6: Display next steps
Write-Host ""
Write-Host ("=" * 50) @info
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host ("=" * 50) @info
Write-Host ""

Write-Host "📋 NEXT STEPS:" @info
Write-Host ""
Write-Host "1️⃣  CONFIGURE API KEYS" @warning
Write-Host "   Edit: $envFile" -ForegroundColor Gray
Write-Host "   Add your Supabase, Tatum, Cashfree, HyperVerge keys" -ForegroundColor Gray
Write-Host "   For testing without keys, just leave dummy values" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  SET UP SUPABASE DATABASE" @warning
Write-Host "   - Go to: https://supabase.com and create a project" -ForegroundColor Gray
Write-Host "   - Run the SQL from: backend/migrations/001_init_schema.sql" -ForegroundColor Gray
Write-Host "   - Copy Project URL and keys to .env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  START THE BACKEND" @warning
Write-Host "   Run: .\start-backend.ps1" -ForegroundColor Gray
Write-Host "   Or:  cd backend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  START THE FRONTEND (in another terminal)" @warning
Write-Host "   Run: .\start-frontend.ps1" -ForegroundColor Gray
Write-Host "   Or:  python -m http.server 5500" -ForegroundColor Gray
Write-Host ""
Write-Host "5️⃣  OPEN IN BROWSER" @warning
Write-Host "   Frontend: http://localhost:5500" -ForegroundColor Gray
Write-Host "   API: http://localhost:3000/api" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 DOCUMENTATION:" @info
Write-Host "   • QUICKSTART.md - 15-minute setup" -ForegroundColor Gray
Write-Host "   • SETUP_GUIDE.md - Complete guide" -ForegroundColor Gray
Write-Host "   • backend/API_DOCUMENTATION.md - API reference" -ForegroundColor Gray
Write-Host "   • backend/ENV_VARIABLES.md - Configuration help" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 QUICK TEST:" @warning
Write-Host "   After backend starts, try:" -ForegroundColor Gray
Write-Host "   curl http://localhost:3000/api/price" -ForegroundColor Gray
Write-Host ""

Write-Host ("=" * 50) @info
Write-Host "🎉 You're ready to go! Start the backend and frontend above." -ForegroundColor Green
Write-Host ("=" * 50) @info
