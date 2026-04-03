const log = (message) => console.log(`[post-edit] ${message}`)

export async function PostEdit(input, output) {
  const filePath = output?.args?.filePath || ''
  
  if (!filePath) return output
  
  const ext = filePath.split('.').pop()
  const FORMATTABLE = ['ts', 'tsx', 'js', 'jsx', 'json']
  
  if (FORMATTABLE.includes(ext)) {
    log(`File modified: ${filePath}`)
  }
  
  return output
}
