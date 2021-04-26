const fs = require('fs')

let code = fs.readFileSync('./dist/ako.js')

code = `#!/usr/bin/env node
/**
 * AKO Language CLI !
 */
${code}`
fs.writeFileSync('./dist/ako.js', code)