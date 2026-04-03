#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FAILED_CHECKS = []
const SKIPPED_CHECKS = []

const env = process.env

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}[pre-commit] ${message}${colors.reset}`)
}

function runCheck(name, command, condition = true) {
  if (!condition) {
    SKIPPED_CHECKS.push(name)
    return
  }

  if (env[`SKIP_${name.toUpperCase().replace(/\s/g, '_')}`]) {
    SKIPPED_CHECKS.push(name)
    return
  }

  log(`Running ${name}...`, 'info')

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd()
    })
    log(`✅ ${name} passed`, 'success')
  } catch (error) {
    log(`❌ ${name} failed`, 'error')
    FAILED_CHECKS.push(name)
  }
}

function detectProjectType() {
  const checks = []

  if (existsSync('package.json')) {
    try {
      const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
      
      if (pkg.scripts?.typecheck || pkg.scripts?.['type-check']) {
        checks.push({
          name: 'TypeScript',
          command: 'npm run typecheck',
          enabled: true
        })
      } else if (existsSync('tsconfig.json')) {
        checks.push({
          name: 'TypeScript',
          command: 'npx tsc --noEmit',
          enabled: true
        })
      }

      if (pkg.scripts?.lint) {
        checks.push({
          name: 'ESLint',
          command: 'npm run lint',
          enabled: true
        })
      } else if (existsSync('.eslintrc.js') || existsSync('.eslintrc.json')) {
        checks.push({
          name: 'ESLint',
          command: 'npx eslint .',
          enabled: true
        })
      }

      if (pkg.scripts?.test || pkg.scripts?.test) {
        checks.push({
          name: 'Tests',
          command: 'npm test',
          enabled: true
        })
      }

      if (pkg.scripts?.build) {
        checks.push({
          name: 'Build',
          command: 'npm run build',
          enabled: true
        })
      }
    } catch {
      // Ignore errors reading package.json
    }
  }

  if (existsSync('requirements.txt') || existsSync('setup.py') || existsSync('pyproject.toml')) {
    checks.push({
      name: 'Python Lint',
      command: 'python -m flake8 . || true',
      enabled: existsSync('.flake8') || existsSync('setup.cfg')
    })
  }

  if (existsSync('go.mod')) {
    checks.push({
      name: 'Go Vet',
      command: 'go vet ./...',
      enabled: true
    })
  }

  return checks
}

function main() {
  log('🔍 Pre-commit checks starting...', 'info')
  log(`📁 Working directory: ${process.cwd()}`, 'info')

  const checks = detectProjectType()

  if (checks.length === 0) {
    log('⚠️  No project configuration detected, skipping checks', 'warning')
    process.exit(0)
  }

  log(`📋 Detected ${checks.length} checks to run`, 'info')

  for (const check of checks) {
    if (check.enabled) {
      runCheck(check.name, check.command)
    }
  }

  log('\n========================================', 'info')

  if (SKIPPED_CHECKS.length > 0) {
    log(`⏭️  Skipped: ${SKIPPED_CHECKS.join(', ')}`, 'warning')
  }

  if (FAILED_CHECKS.length > 0) {
    log(`\n❌ Pre-commit checks FAILED: ${FAILED_CHECKS.join(', ')}`, 'error')
    log('\n💡 Fix the issues above and try again', 'info')
    log('💡 Or use --no-verify to skip: git commit --no-verify -m "message"', 'info')
    process.exit(1)
  }

  log('\n✅ All pre-commit checks passed!', 'success')
  process.exit(0)
}

main()
