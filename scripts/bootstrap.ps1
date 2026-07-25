# AKORIS Bootstrap Script
# Usage: powershell -ExecutionPolicy Bypass -File scripts/bootstrap.ps1

Write-Host "=== AKORIS Bootstrap ===" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "Node.js is not installed. Please install Node.js >= 18" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Node.js $nodeVersion"

$pnpmVersion = pnpm --version 2>$null
if (-not $pnpmVersion) {
    Write-Host "pnpm is not installed. Install with: npm install -g pnpm" -ForegroundColor Yellow
    npm install -g pnpm
    $pnpmVersion = pnpm --version
}
Write-Host "[OK] pnpm v$pnpmVersion"

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Build packages
Write-Host ""
Write-Host "Building packages..." -ForegroundColor Yellow
pnpm build

Write-Host ""
Write-Host "=== AKORIS ready ===" -ForegroundColor Green
Write-Host ""
Write-Host "Try: node packages/cli/dist/index.js status" -ForegroundColor Cyan
