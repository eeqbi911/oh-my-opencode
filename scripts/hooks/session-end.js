const log = (message) => console.log(`[session-end] ${message}`)

export async function SessionEnd(input) {
  log('Session ending, saving state...')
  
  try {
    const { appendFileSync, existsSync, mkdirSync } = await import('fs')
    
    const historyDir = '.opencode'
    if (!existsSync(historyDir)) {
      mkdirSync(historyDir, { recursive: true })
    }
    
    const historyFile = `${historyDir}/session-history.jsonl`
    const entry = {
      timestamp: new Date().toISOString(),
      duration: process.env.SESSION_DURATION || 'unknown'
    }
    
    appendFileSync(historyFile, JSON.stringify(entry) + '\n')
    log('Session state saved')
  } catch (err) {
    log('Could not save session state')
  }
  
  return input
}
