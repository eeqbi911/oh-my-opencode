#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DANGEROUS_PATTERNS = [
  {
    pattern: /rm\s+-rf\s+(\/|sudo)/i,
    message: 'Root deletion blocked - this could destroy your system'
  },
  {
    pattern: /curl\s+\|\s*sh/i,
    message: 'Pipe to shell blocked - potential security risk'
  },
  {
    pattern: /wget.*(-O-|pipe)/i,
    message: 'Suspicious download pattern detected'
  },
  {
    pattern: /;\s*rm\s+/i,
    message: 'Command chaining with rm detected'
  },
  {
    pattern: />\s*\/dev\/null\s*2>&1\s*&/i,
    message: 'Background process hiding output detected'
  },
  {
    pattern: /fork\s*\(\s*\)/i,
    message: 'Fork bomb pattern detected'
  },
  {
    pattern: /:()\s*\{\s*:\|\:\s*&\s*\}\s*:/i,
    message: 'Fork bomb pattern detected'
  }
]

const SUSPICIOUS_PATTERNS = [
  {
    pattern: /chmod\s+-R\s+777/i,
    message: 'World-writable permissions detected'
  },
  {
    pattern: /export\s+PASSWORD/i,
    message: 'Password export detected'
  },
  {
    pattern: /\.\/([a-zA-Z0-9_-]+)\s+[^>\s]+/i,
    message: 'Executing local script from variable'
  }
]

export async function PreBashCheck(input) {
  const command = (input.args?.command || '').trim()

  if (!command) {
    return input
  }

  const warnings = []
  const blocks = []

  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      blocks.push(`🔴 BLOCKED: ${message}`)
      console.error(`[pre-bash] 🔴 SECURITY: ${message}`)
      console.error(`[pre-bash] Command: ${command.substring(0, 100)}...`)
    }
  }

  for (const { pattern, message } of SUSPICIOUS_PATTERNS) {
    if (pattern.test(command)) {
      warnings.push(`🟡 WARNING: ${message}`)
      console.warn(`[pre-bash] 🟡 WARNING: ${message}`)
    }
  }

  if (blocks.length > 0) {
    console.error('[pre-bash] 🔴 Command blocked by security hook')
    return {
      ...input,
      blocked: true,
      blockReason: blocks.join('; ')
    }
  }

  if (warnings.length > 0) {
    console.warn(`[pre-bash] Warnings: ${warnings.join('; ')}`)
  }

  return {
    ...input,
    warnings: warnings.join('; ')
  }
}

export async function logSecurityEvent(event) {
  const logDir = path.join(process.env.HOME || '', '.opencode', 'logs')
  const logFile = path.join(logDir, 'security.log')

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const entry = {
      timestamp: new Date().toISOString(),
      event,
      hash: crypto.createHash('sha256').update(JSON.stringify(event)).digest('hex').substring(0, 8)
    }

    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n')
  } catch (err) {
    console.error('[pre-bash] Could not log security event:', err.message)
  }
}
