#!/usr/bin/env pwsh
# Start Control Center (API + Dashboard) in development mode

$ErrorActionPreference = 'Stop'

Write-Host "`n🚀 AKORIS Control Center`n" -ForegroundColor Cyan

# Check pnpm
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ pnpm is not installed. Install it with: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path 'node_modules')) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    pnpm install
}

# Build packages
Write-Host "🔧 Building packages..." -ForegroundColor Yellow
pnpm build

# Start API in background
Write-Host "🔄 Starting API on http://localhost:3000 ..." -ForegroundColor Green
$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    pnpm dev:api
}

# Start Dashboard in background
Write-Host "🔄 Starting Dashboard on http://localhost:5173 ..." -ForegroundColor Green
$dashboardJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    pnpm dev:dashboard
}

Write-Host "`n✅ Control Center is running" -ForegroundColor Green
Write-Host "   API       : http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Dashboard : http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop.`n" -ForegroundColor Gray

try {
    while ($true) {
        Start-Sleep -Seconds 1
        # Check if jobs are still running
        $apiJob | Receive-Job -ErrorAction SilentlyContinue
        $dashboardJob | Receive-Job -ErrorAction SilentlyContinue
        if ($apiJob.State -eq 'Failed' -or $dashboardJob.State -eq 'Failed') {
            Write-Host "❌ A process has stopped unexpectedly." -ForegroundColor Red
            break
        }
    }
}
finally {
    Write-Host "`n🛑 Stopping..." -ForegroundColor Yellow
    Stop-Job $apiJob -ErrorAction SilentlyContinue
    Stop-Job $dashboardJob -ErrorAction SilentlyContinue
    Remove-Job $apiJob -ErrorAction SilentlyContinue
    Remove-Job $dashboardJob -ErrorAction SilentlyContinue
    Write-Host "✅ Stopped. Goodbye!`n" -ForegroundColor Green
}
