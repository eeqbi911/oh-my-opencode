#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SESSION_FILE = path.join(process.env.HOME || '', '.opencode', 'session-history.jsonl')

function ensureDir() {
  const dir = path.dirname(SESSION_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function detectProjectType() {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      return {
        type: 'node',
        name: pkg.name || 'unknown',
        hasTests: !!(pkg.scripts?.test),
        hasTypeScript: !!(pkg.devDependencies?.typescript || pkg.dependencies?.typescript),
        hasESLint: !!(pkg.devDependencies?.eslint || pkg.dependencies?.eslint)
      }
    }

    const reqPath = path.join(process.cwd(), 'requirements.txt')
    if (fs.existsSync(reqPath)) {
      return { type: 'python', name: path.basename(process.cwd()) }
    }

    const goPath = path.join(process.cwd(), 'go.mod')
    if (fs.existsSync(goPath)) {
      return { type: 'go', name: path.basename(process.cwd()) }
    }

    return { type: 'unknown', name: path.basename(process.cwd()) }
  } catch {
    return { type: 'unknown', name: 'unknown' }
  }
}

export async function SessionStart(input) {
  const startTime = Date.now()
  const hostname = os.hostname()
  const projectInfo = detectProjectType()

  console.log('[session-start] 🚀 Session starting...')
  console.log(`[session-start] 📁 Project: ${projectInfo.name} (${projectInfo.type})`)

  if (projectInfo.hasTypeScript) {
    console.log('[session-start] 📝 TypeScript detected')
  }
  if (projectInfo.hasTests) {
    console.log('[session-start] 🧪 Tests available')
  }
  if (projectInfo.hasESLint) {
    console.log('[session-start] ✅ ESLint configured')
  }

  const context = {
    startTime,
    hostname,
    project: projectInfo,
    cwd: process.cwd(),
    user: os.userInfo().username
  }

  return {
    ...input,
    sessionContext: context
  }
}

export async function SessionEnd(input) {
  const endTime = Date.now()
  const duration = input?.sessionContext?.startTime
    ? endTime - input.sessionContext.startTime
    : 0

  console.log('[session-end] 💾 Saving session state...')

  try {
    ensureDir()

    const entry = {
      timestamp: new Date().toISOString(),
      duration: Math.round(duration / 1000),
      project: input?.sessionContext?.project?.name || 'unknown',
      cwd: input?.sessionContext?.cwd || process.cwd()
    }

    fs.appendFileSync(SESSION_FILE, JSON.stringify(entry) + '\n')

    const durationStr = duration > 60000
      ? `${Math.round(duration / 60000)}min`
      : `${Math.round(duration / 1000)}s`

    console.log(`[session-end] ✅ Session saved (${durationStr})`)
  } catch (err) {
    console.error('[session-end] ❌ Could not save session state:', err.message)
  }

  return input
}
