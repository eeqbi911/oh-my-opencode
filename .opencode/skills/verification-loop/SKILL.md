---
name: verification-loop
description: Continuous verification workflow - build, test, lint, typecheck, and security scan in a loop until all checks pass. Use before commits, PRs, or deployments.
origin: oh-my-opencode
---

# Verification Loop Skill

## When to Activate

- Before commits
- Before opening PRs
- Before deployments
- After implementing features
- During code reviews

## The Verification Loop

```
┌─────────────────────────────────────────┐
│           Start Verification            │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         1. Type Check (tsc)             │
└─────────────────┬───────────────────────┘
                  │ FAIL → Fix → Retry
                  │ PASS
                  ▼
┌─────────────────────────────────────────┐
│         2. Lint (eslint)               │
└─────────────────┬───────────────────────┘
                  │ FAIL → Fix → Retry
                  │ PASS
                  ▼
┌─────────────────────────────────────────┐
│         3. Unit Tests (vitest/jest)    │
└─────────────────┬───────────────────────┘
                  │ FAIL → Fix → Retry
                  │ PASS
                  ▼
┌─────────────────────────────────────────┐
│         4. Build (tsc/vite)            │
└─────────────────┬───────────────────────┘
                  │ FAIL → Fix → Retry
                  │ PASS
                  ▼
┌─────────────────────────────────────────┐
│         5. Security Scan               │
└─────────────────┬───────────────────────┘
                  │ ISSUES → Fix → Retry
                  │ PASS
                  ▼
┌─────────────────────────────────────────┐
│         6. Coverage Check             │
└─────────────────┬───────────────────────┘
                  │ < threshold → Add tests
                  │ >= threshold
                  ▼
┌─────────────────────────────────────────┐
│         ✅ All Checks Passed           │
└─────────────────────────────────────────┘
```

## Verification Commands

### TypeScript Projects

```bash
# 1. Type check
npm run typecheck

# 2. Lint
npm run lint

# 3. Tests
npm test

# 4. Build
npm run build

# 5. Security
npm audit

# 6. Coverage
npm test -- --coverage
```

### Full Verification Script

```bash
#!/bin/bash
set -e

echo "🔍 Starting verification loop..."

echo "📝 Type checking..."
npm run typecheck

echo "📏 Linting..."
npm run lint

echo "🧪 Testing..."
npm test

echo "🏗️ Building..."
npm run build

echo "🔒 Security scan..."
npm audit --audit-level=high

echo "📊 Coverage check..."
npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'

echo "✅ All checks passed!"
```

## Thresholds

| Check | Minimum | Target |
|-------|---------|--------|
| Test Coverage | 70% | 80% |
| Lint Errors | 0 | 0 |
| Type Errors | 0 | 0 |
| Security Vulnerabilities | 0 Critical | 0 High |
| Build Warnings | 0 | 0 |

## CI Integration

```yaml
# .github/workflows/verify.yml
name: Verify
on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
```

## Verification in Editor

Configure editor to run checks on save:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Auto-fix Commands

```bash
# Fix auto-fixable lint errors
npm run lint -- --fix

# Auto-format code
npm run format

# Auto-fix TypeScript errors (if possible)
npm run typecheck -- --noEmit false

# Update dependencies
npm update
```

## Failed Check Response

| Check | On Failure |
|-------|-----------|
| TypeScript | Fix type errors first |
| ESLint | Run `lint --fix`, review remaining |
| Tests | Write/update tests to pass |
| Build | Check import/export issues |
| Security | Address vulnerabilities immediately |
| Coverage | Add tests for uncovered code |

## Verification Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] `npm audit` has no critical issues
- [ ] Coverage meets threshold
- [ ] No console.log/debugger left
- [ ] No commented-out code
