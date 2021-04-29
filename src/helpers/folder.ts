import fs from 'fs'

export function listAkoFiles(folder: string) {
  const files = fs.readdirSync(folder)
  return files.filter((x) => x.endsWith('.ako'))
}
