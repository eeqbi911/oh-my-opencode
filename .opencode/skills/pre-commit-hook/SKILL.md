---
name: pre-commit-hook
description: Pre-commit automation - runs lint, typecheck, and tests before commits. Use when git hooks are configured.
origin: oh-my-opencode
---

# Pre-Commit Hook Automation

## Overview

Automatically runs verification checks before git commits are accepted:
- Type checking (TypeScript)
- Linting
- Tests
- Format verification

## Hook Implementation

### Bash Script (.git/hooks/pre-commit)

```bash
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Track failures
FAILED=0

# Check if files need typecheck
if [ -f "tsconfig.json" ]; then
  echo -e "\n${YELLOW}📝 Type checking...${NC}"
  if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Type check passed${NC}"
  else
    echo -e "${RED}❌ Type check failed${NC}"
    npm run typecheck
    FAILED=1
  fi
fi

# Check if files need lint
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
  echo -e "\n${YELLOW}📏 Linting...${NC}"
  if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Lint passed${NC}"
  else
    echo -e "${RED}❌ Lint failed${NC}"
    npm run lint
    FAILED=1
  fi
fi

# Run tests if they exist
if [ -f "package.json" ] && grep -q '"test"' package.json; then
  echo -e "\n${YELLOW}🧪 Running tests...${NC}"
  if npm test > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Tests passed${NC}"
  else
    echo -e "${RED}❌ Tests failed${NC}"
    FAILED=1
  fi
fi

# Check for secrets
if [ -f ".git/hooks/pre-commit" ]; then
  echo -e "\n${YELLOW}🔒 Checking for secrets...${NC}"
  if command -v gitLeaks &> /dev/null; then
    if gitLeaks --path . --fail > /dev/null 2>&1; then
      echo -e "${GREEN}✅ No secrets detected${NC}"
    else
      echo -e "${RED}❌ Secrets detected!${NC}"
      gitLeaks --path .
      FAILED=1
    fi
  fi
fi

# Summary
echo -e "\n${YELLOW}========================================${NC}"
if [ $FAILED -eq 1 ]; then
  echo -e "${RED}❌ Pre-commit check FAILED${NC}"
  echo -e "${RED}Please fix the issues above and try again${NC}"
  exit 1
else
  echo -e "${GREEN}✅ All pre-commit checks passed!${NC}"
  exit 0
fi
```

### Node.js Script (scripts/hooks/pre-commit.js)

```javascript
import { execSync } from 'child_process'
import { existsSync } from 'fs'

const CHECKS = [
  {
    name: 'TypeScript',
    test: () => existsSync('tsconfig.json'),
    run: () => execSync('npm run typecheck', { stdio: 'inherit' })
  },
  {
    name: 'ESLint',
    test: () => existsSync('.eslintrc.js') || existsSync('.eslintrc.json'),
    run: () => execSync('npm run lint', { stdio: 'inherit' })
  },
  {
    name: 'Tests',
    test: () => {
      const pkg = existsSync('package.json')
      return pkg
    },
    run: () => execSync('npm test', { stdio: 'inherit' })
  }
]

let failed = false

for (const check of CHECKS) {
  if (check.test()) {
    console.log(`🔍 Running ${check.name}...`)
    try {
      check.run()
      console.log(`✅ ${check.name} passed`)
    } catch {
      console.log(`❌ ${check.name} failed`)
      failed = true
    }
  }
}

if (failed) {
  console.log('\n❌ Pre-commit checks failed!')
  process.exit(1)
}

console.log('\n✅ All pre-commit checks passed!')
```

### PowerShell Script (scripts/hooks/pre-commit.ps1)

```powershell
#!/usr/bin/env pwsh

Write-Host "🔍 Running pre-commit checks..." -ForegroundColor Cyan

$Failed = $false

# Type check
if (Test-Path tsconfig.json) {
    Write-Host "📝 Running TypeScript check..." -ForegroundColor Yellow
    try {
        npm run typecheck
        Write-Host "✅ Type check passed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Type check failed" -ForegroundColor Red
        $Failed = $true
    }
}

# Lint
if ((Test-Path .eslintrc.js) -or (Test-Path .eslintrc.json)) {
    Write-Host "📏 Running ESLint..." -ForegroundColor Yellow
    try {
        npm run lint
        Write-Host "✅ Lint passed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Lint failed" -ForegroundColor Red
        $Failed = $true
    }
}

# Tests
if (Test-Path package.json) {
    Write-Host "🧪 Running Tests..." -ForegroundColor Yellow
    try {
        npm test
        Write-Host "✅ Tests passed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Tests failed" -ForegroundColor Red
        $Failed = $true
    }
}

if ($Failed) {
    Write-Host "`n❌ Pre-commit checks failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ All pre-commit checks passed!" -ForegroundColor Green
exit 0
```

## Installation

### Automatic (via npm script)

Add to `package.json`:

```json
{
  "scripts": {
    "precommit": "node scripts/hooks/pre-commit.js",
    "commit": "npm run precommit && git commit"
  }
}
```

### Manual Installation

```bash
# Install git hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
node scripts/hooks/pre-commit.js
EOF
chmod +x .git/hooks/pre-commit
```

### Using Husky (recommended)

```bash
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run typecheck && npm run lint && npm test"
```

## Configuration

### Skip Checks (emergency)

```bash
# Skip all pre-commit checks
git commit --no-verify -m "Emergency fix"

# Skip specific checks
SKIP_LINT=1 git commit -m "Quick fix"
```

### Environment Variables

| Variable | Effect |
|----------|--------|
| `SKIP_TYPECHECK` | Skip TypeScript check |
| `SKIP_LINT` | Skip ESLint |
| `SKIP_TESTS` | Skip tests |
| `SKIP_SECRETS` | Skip secrets detection |

## Integration with oh-my-opencode

This hook is automatically configured when you install oh-my-opencode hooks:

```json
// hooks/hooks.json
{
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "node ${OPENCODE_PLUGIN_ROOT}/scripts/hooks/pre-bash.js"
        }
      ]
    }
  ]
}
```

## Flow

```
git commit
    ↓
pre-commit hook triggered
    ↓
Run checks in parallel or sequence
    ↓
All pass → commit succeeds ✅
    ↓
Any fail → commit rejected ❌
    ↓
Fix issues → retry
```
