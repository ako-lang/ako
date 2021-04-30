const fs = require('fs')

let code = fs.readFileSync('./dist/ako-cli.js')

code = `#!/usr/bin/env node
/**
 * AKO Language CLI !
 */
${code}`
fs.writeFileSync('./dist/ako-cli.js', code)
