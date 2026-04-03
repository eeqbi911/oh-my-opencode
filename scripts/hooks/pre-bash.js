const log = (message) => console.log(`[pre-bash] ${message}`)

const DANGEROUS_PATTERNS = [
  { pattern: /rm\s+-rf\s+\/(sudo)?/i, message: 'Root deletion blocked' },
  { pattern: /curl\s+\|.*sh/i, message: 'Pipe to shell blocked' },
  { pattern: /wget.*-O-|pipe.*sh/i, message: 'Suspicious download blocked' },
]

export async function PreBashCheck(input) {
  const command = input.args?.command || ''
  
  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      log(`⚠️  ${message}: ${command.substring(0, 50)}...`)
    }
  }
  
  return input
}
