#!/usr/bin/env pwsh

$ErrorActionPreference = "Stop"

$RootDir = $PSScriptRoot | Split-Path

$ConfigDir = if ($IsWindows) {
    Join-Path $env:APPDATA "opencode"
} else {
    Join-Path $HOME ".config/opencode"
}

$SkillsDir = Join-Path $ConfigDir "skills"
$RulesDir = Join-Path $ConfigDir "rules"
$HooksDir = Join-Path $ConfigDir "hooks"
$ScriptsDir = Join-Path $RootDir "scripts"

function Write-Status($Message, $Type = "Info") {
    $Colors = @{
        "Info"    = "Cyan"
        "Success" = "Green"
        "Warning" = "Yellow"
        "Error"   = "Red"
    }
    Write-Host $Message -ForegroundColor $Colors[$Type]
}

function Ensure-Directory($Path) {
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Status "Created: $Path"
    }
}

function Copy-File($Src, $Dest) {
    if (Test-Path $Src) {
        Copy-Item $Src $Dest -Force
        $Name = Split-Path $Src -Leaf
        Write-Status "Copied: $Name" "Success"
    }
}

function Copy-Directory($Src, $Dest) {
    if (-not (Test-Path $Src)) { return }

    Ensure-Directory $Dest

    $Items = Get-ChildItem $Src -Recurse
    foreach ($Item in $Items) {
        $RelativePath = $Item.FullName.Substring($Src.Length + 1)
        $DestPath = Join-Path $Dest $RelativePath

        if ($Item.PSIsContainer) {
            Ensure-Directory $DestPath
        } else {
            $DestDir = Split-Path $DestPath -Parent
            Ensure-Directory $DestDir
            Copy-Item $Item.FullName $DestPath -Force
            Write-Status "Copied: $($Item.Name)" "Success"
        }
    }
}

function Install-Skills {
    Write-Status "`n📦 Installing Skills..." "Info"
    Ensure-Directory $SkillsDir

    $SkillsSrc = Join-Path $RootDir ".opencode/skills"
    $SkillNames = Get-ChildItem $SkillsSrc -Directory

    foreach ($Skill in $SkillNames) {
        $DestDir = Join-Path $SkillsDir $Skill.Name
        Copy-Directory $Skill.FullName $DestDir
        Write-Status "Installed skill: $($Skill.Name)" "Success"
    }
}

function Install-Rules {
    Write-Status "`n📐 Installing Rules..." "Info"
    Ensure-Directory $RulesDir

    $RulesSrc = Join-Path $RootDir "rules"
    $RuleTypes = Get-ChildItem $RulesSrc -Directory

    foreach ($Type in $RuleTypes) {
        $DestDir = Join-Path $RulesDir $Type.Name
        Copy-Directory $Type.FullName $DestDir
        Write-Status "Installed rules: $($Type.Name)" "Success"
    }
}

function Install-Hooks {
    Write-Status "`n🪝 Installing Hooks..." "Info"
    Ensure-Directory $HooksDir

    $HooksConfig = Join-Path $RootDir "hooks/hooks.json"
    $DestHooks = Join-Path $HooksDir "hooks.json"
    Copy-File $HooksConfig $DestHooks

    $HookScripts = Join-Path $ScriptsDir "hooks"
    if (Test-Path $HookScripts) {
        Copy-Directory $HookScripts $HooksDir
    }

    Write-Status "Hooks installed" "Success"
}

function New-OpencodeConfig {
    Write-Status "`n⚙️ Creating OpenCode config..." "Info"

    $ConfigDest = Join-Path $ConfigDir "opencode.json"
    $LocalConfig = Join-Path $RootDir ".opencode/opencode.json"

    if ((Test-Path $LocalConfig) -and (-not (Test-Path $ConfigDest))) {
        Copy-File $LocalConfig $ConfigDest
        Write-Status "OpenCode config created" "Success"
    } else {
        Write-Status "OpenCode config already exists, skipping" "Warning"
    }
}

function Show-Instructions {
    Write-Status "`n✅ oh-my-opencode installed successfully!" "Success"
    Write-Status "`n📖 Usage:" "Info"
    Write-Status "  1. Skills installed to: $SkillsDir" "Info"
    Write-Status "  2. Rules installed to: $RulesDir" "Info"
    Write-Status "  3. Hooks installed to: $HooksDir" "Info"

    Write-Status "`n🔧 Available Skills:" "Info"
    $Skills = @(
        @{ Name = "tdd-workflow"; Desc = "Test-driven development" },
        @{ Name = "code-review"; Desc = "Code review checklist" },
        @{ Name = "security-review"; Desc = "Security analysis" },
        @{ Name = "backend-patterns"; Desc = "Backend architecture" },
        @{ Name = "frontend-patterns"; Desc = "Frontend patterns" },
        @{ Name = "git-workflow"; Desc = "Git conventions" },
        @{ Name = "search-first"; Desc = "Research-first workflow" },
        @{ Name = "verification-loop"; Desc = "CI/CD verification" }
    )

    foreach ($Skill in $Skills) {
        Write-Host "  - $($Skill.Name)`t$($Skill.Desc)" -ForegroundColor Cyan
    }
}

function Main {
    Write-Status "🚀 oh-my-opencode installer (PowerShell)" "Info"
    Write-Status ("=" * 40) "Info"

    try {
        Install-Skills
        Install-Rules
        Install-Hooks
        New-OpencodeConfig
        Show-Instructions
    } catch {
        Write-Status "`n❌ Installation failed: $_" "Error"
        exit 1
    }
}

Main
