const log = (message) => console.log(`[session-start] ${message}`)

export async function SessionStart(input) {
  log('Session starting...')
  
  const projectContext = {
    packageJson: null,
    hasTests: false,
    hasTypeScript: false
  }
  
  try {
    const { readFileSync, existsSync } = await import('fs')
    const packagePath = 'package.json'
    
    if (existsSync(packagePath)) {
      const content = readFileSync(packagePath, 'utf-8')
      const pkg = JSON.parse(content)
      projectContext.packageJson = pkg.name
      projectContext.hasTests = !!(pkg.scripts?.test)
      projectContext.hasTypeScript = pkg.devDependencies?.typescript || pkg.dependencies?.typescript
      log(`Project: ${pkg.name}`)
    }
  } catch (err) {
    log('Could not read project context')
  }
  
  return input
}
