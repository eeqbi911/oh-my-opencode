#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FORMATTABLE_EXTENSIONS = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.json': 'json',
  '.md': 'markdown',
  '.css': 'css',
  '.scss': 'scss',
  '.html': 'html'
}

const LOG_FILE = path.join(process.env.HOME || '', '.opencode', 'logs', 'file-edits.jsonl')

function ensureLogDir() {
  const logDir = path.dirname(LOG_FILE)
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
}

function logEdit(filePath, action) {
  try {
    ensureLogDir()
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      file: filePath,
      ext: path.extname(filePath)
    }
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n')
  } catch (err) {
    // Silently fail - logging should not break editing
  }
}

export async function PostEdit(input, output) {
  const filePath = output?.args?.filePath || ''
  const action = input?.action || 'edit'

  if (!filePath) {
    return output
  }

  const ext = path.extname(filePath).toLowerCase()
  const type = FORMATTABLE_EXTENSIONS[ext]

  if (type) {
    logEdit(filePath, action)

    const relativePath = path.relative(process.cwd(), filePath)

    if (action === 'Write') {
      console.log(`[post-edit] 📄 Created: ${relativePath}`)
    } else if (action === 'Edit') {
      console.log(`[post-edit] ✏️  Modified: ${relativePath}`)
    }

    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      console.log(`[post-edit] 💡 Run 'npm run lint -- --fix' to auto-fix formatting`)
    }
  }

  return output
}

export async function PreEdit(input) {
  const filePath = input?.args?.filePath || ''

  if (!filePath) {
    return input
  }

  const ext = path.extname(filePath).toLowerCase()

  if (ext === '.env') {
    console.warn('[pre-edit] ⚠️  Editing .env file - ensure no secrets are committed')
  }

  return input
}
