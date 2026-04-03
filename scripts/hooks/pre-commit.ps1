#!/usr/bin/env pwsh

param(
    [switch]$SkipTypecheck,
    [switch]$SkipLint,
    [switch]$SkipTest,
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

Write-Host "[pre-commit] 🔍 Pre-commit checks starting..." -ForegroundColor Cyan
Write-Host "[pre-commit] 📁 Working directory: $PWD" -ForegroundColor Cyan

$FailedChecks = @()
$SkippedChecks = @()

function Test-Command($name, $command) {
    if (command -v ($command -split ' ')[0] 2>$null) {
        return $true
    }
    return $false
}

function Run-Check($name, $command, $enabled) {
    if (-not $enabled) {
        $SkippedChecks += $name
        return
    }

    $envVar = "SKIP_$($name.ToUpper().Replace(' ', '_'))"
    if (Get-Variable -Name $envVar -ErrorAction SilentlyContinue) {
        if ((Get-Variable -Name $envVar).Value) {
            $SkippedChecks += $name
            return
        }
    }

    Write-Host "[pre-commit] Running $name..." -ForegroundColor Yellow

    try {
        Invoke-Expression $command
        Write-Host "[pre-commit] ✅ $name passed" -ForegroundColor Green
    }
    catch {
        Write-Host "[pre-commit] ❌ $name failed" -ForegroundColor Red
        $FailedChecks += $name
    }
}

# TypeScript check
if ((Test-Path "tsconfig.json") -and -not $SkipTypecheck) {
    if (Test-Command "TypeScript" "tsc") {
        Run-Check "TypeScript" "npm run typecheck" $true
    }
}
else {
    $SkippedChecks += "TypeScript"
}

# ESLint check
if ((Test-Path ".eslintrc.js") -or (Test-Path ".eslintrc.json") -or (Test-Path ".eslintrc")) {
    if (-not $SkipLint) {
        if (Test-Command "ESLint" "eslint") {
            Run-Check "ESLint" "npm run lint" $true
        }
    }
}
else {
    $SkippedChecks += "ESLint"
}

# Test check
if ((Test-Path "package.json") -and (Get-Content "package.json" | Select-String '"test"') -and -not $SkipTest) {
    if (Test-Command "Tests" "npm") {
        Run-Check "Tests" "npm test" $true
    }
}
else {
    $SkippedChecks += "Tests"
}

# Build check
if ((Test-Path "package.json") -and (Get-Content "package.json" | Select-String '"build"') -and -not $SkipBuild) {
    if (Test-Command "Build" "npm") {
        Run-Check "Build" "npm run build" $true
    }
}
else {
    $SkippedChecks += "Build"
}

Write-Host ""
Write-Host "[pre-commit] ========================================" -ForegroundColor Cyan

if ($SkippedChecks.Count -gt 0) {
    Write-Host "[pre-commit] ⏭️  Skipped: $($SkippedChecks -join ', ')" -ForegroundColor Yellow
}

if ($FailedChecks.Count -gt 0) {
    Write-Host "[pre-commit] ❌ Pre-commit checks FAILED: $($FailedChecks -join ', ')" -ForegroundColor Red
    Write-Host "[pre-commit] 💡 Fix the issues above and try again" -ForegroundColor Cyan
    Write-Host "[pre-commit] 💡 Or skip with --no-verify: git commit --no-verify -m 'message'" -ForegroundColor Cyan
    exit 1
}

Write-Host "[pre-commit] ✅ All pre-commit checks passed!" -ForegroundColor Green
exit 0
