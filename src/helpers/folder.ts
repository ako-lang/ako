import fs from 'fs'
import path from 'path'

export function listAkoFiles(folder: string): string[] {
  let files = fs.readdirSync(folder)
  files = files.map((x) => path.join(folder, x))
  for (const file of files) {
    if (fs.statSync(file).isDirectory()) {
      files = [...files, ...listAkoFiles(file)] as string[]
    }
  }
  return files.filter((x) => x.endsWith('.ako'))
}
