const fs = require('fs')
const path = require('path')

const file = process.argv[2]

if (!fs.existsSync('dist')) fs.mkdirSync('dist')
fs.writeFileSync(path.join('dist', `${file}.d.ts`), `export * from '../typings/src/dist/${file}'`)
