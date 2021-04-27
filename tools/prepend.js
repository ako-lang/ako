const fs = require('fs')

let code = fs.readFileSync('./dist/node/ako.js')

code = `#!/usr/bin/env node
/**
 * AKO Language CLI !
 */
${code}`
fs.writeFileSync('./dist/node/ako.js', code)