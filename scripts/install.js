#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const CONFIG_DIR = process.platform === 'win32'
  ? path.join(process.env.APPDATA || '', 'opencode')
  : path.join(process.env.HOME || '', '.config', 'opencode')

const SKILLS_DIR = path.join(CONFIG_DIR, 'skills')
const RULES_DIR = path.join(CONFIG_DIR, 'rules')
const HOOKS_DIR = path.join(CONFIG_DIR, 'hooks')

const SCRIPTS_DIR = path.join(rootDir, 'scripts', 'hooks')

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    log(`Created directory: ${dir}`, 'info')
  }
}

function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    log(`Copied: ${path.basename(src)}`, 'success')
  }
}

function copyDir(src, dest, options = {}) {
  const { recursive = false, filter = () => true } = options
  
  if (!fs.existsSync(src)) return
    
  ensureDir(dest)
  
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      if (recursive) {
        copyDir(srcPath, destPath, { recursive: true, filter })
      }
    } else if (filter(entry.name)) {
      copyFile(srcPath, destPath)
    }
  }
}

function installSkills() {
  log('\n📦 Installing Skills...', 'info')
  ensureDir(SKILLS_DIR)
  
  const skillsSrc = path.join(rootDir, '.opencode', 'skills')
  const skills = fs.readdirSync(skillsSrc)
  
  for (const skill of skills) {
    const skillPath = path.join(skillsSrc, skill)
    if (fs.statSync(skillPath).isDirectory()) {
      const destDir = path.join(SKILLS_DIR, skill)
      copyDir(skillPath, destDir, { recursive: true })
      log(`Installed skill: ${skill}`, 'success')
    }
  }
}

function installRules() {
  log('\n📐 Installing Rules...', 'info')
  ensureDir(RULES_DIR)
  
  const rulesSrc = path.join(rootDir, 'rules')
  
  const ruleTypes = fs.readdirSync(rulesSrc)
  
  for (const type of ruleTypes) {
    const typePath = path.join(rulesSrc, type)
    if (fs.statSync(typePath).isDirectory()) {
      const destDir = path.join(RULES_DIR, type)
      copyDir(typePath, destDir, { recursive: true })
      log(`Installed rules: ${type}`, 'success')
    }
  }
}

function installHooks() {
  log('\n🪝 Installing Hooks...', 'info')
  ensureDir(HOOKS_DIR)
  
  const hooksConfig = path.join(rootDir, 'hooks', 'hooks.json')
  const destHooks = path.join(HOOKS_DIR, 'hooks.json')
  copyFile(hooksConfig, destHooks)
  
  ensureDir(SCRIPTS_DIR)
  log('Hooks installed', 'success')
}

function createOpencodeConfig() {
  log('\n⚙️ Creating OpenCode config...', 'info')
  
  const configDest = path.join(CONFIG_DIR, 'opencode.json')
  const localConfig = path.join(rootDir, '.opencode', 'opencode.json')
  
  if (fs.existsSync(localConfig)) {
    if (!fs.existsSync(configDest)) {
      fs.copyFileSync(localConfig, configDest)
      log('OpenCode config created', 'success')
    } else {
      log('OpenCode config already exists, skipping', 'warning')
    }
  }
}

function printInstructions() {
  log('\n✅ oh-my-opencode installed successfully!', 'success')
  log('\n📖 Usage:', 'info')
  log('  1. Skills are installed to ~/.config/opencode/skills/', 'info')
  log('  2. Rules are installed to ~/.config/opencode/rules/', 'info')
  log('  3. Hooks are configured in ~/.config/opencode/hooks.json', 'info')
  log('\n🔧 Available Skills:', 'info')
  log('  - tdd-workflow       Test-driven development', 'info')
  log('  - code-review        Code review checklist', 'info')
  log('  - security-review    Security analysis', 'info')
  log('  - backend-patterns   Backend architecture', 'info')
  log('  - frontend-patterns  Frontend patterns', 'info')
  log('  - git-workflow       Git conventions', 'info')
  log('  - search-first       Research-first workflow', 'info')
  log('  - verification-loop  CI/CD verification', 'info')
}

function main() {
  log('🚀 oh-my-opencode installer', 'info')
  log('========================', 'info')
  
  try {
    installSkills()
    installRules()
    installHooks()
    createOpencodeConfig()
    printInstructions()
  } catch (error) {
    log(`\n❌ Installation failed: ${error.message}`, 'error')
    process.exit(1)
  }
}

main()
