const { build } = require("esbuild");

const mode = process.argv[2]

let options = {
  input: "",
  output: "",
  target: undefined,
  platform: undefined,
  mode: undefined,
  format: undefined,
  banner: undefined
}

switch (mode) {
  case 'cli':
    options.input = './src/dist/ako-cli.ts'
    options.output = './dist/ako-cli.js'
    options.platform = 'node'
    options.mode = 'node'
    break;
  case 'node':
    options.input = './src/dist/ako-node.ts'
    options.output = 'dist/ako-node.js'
    options.platform = 'node'
    options.banner = { js: '//[AKO_Node][website:https://github.com/ako-lang/ako]' }
    options.mode = 'node'
    break;
  case 'web':
    options.input = './src/dist/ako-web.ts'
    options.output = 'dist/ako-web.js'
    options.target = 'es2018'
    options.format = 'esm'
    options.banner = { js: '//[AKO_Node][website:https://github.com/ako-lang/ako]' }
    options.mode = 'web'
    break;
  case 'web-light':
    options.input = './src/dist/ako-weblight.ts'
    options.output = './dist/ako-weblight.js'
    options.target = 'es2018'
    options.format = 'esm'
    options.banner = { js: '//[AKO_Node][website:https://github.com/ako-lang/ako]' }
    options.mode = 'web'
    break;
  default:
    throw new Error(`Unknown Mode ${mode}`)
}

const define = {
  "process.env.ISNODE": options.mode === 'node',
  "process.env.ISWEB": options.mode === 'web'
};

const esOptions = {
  entryPoints: [options.input],
  outfile: options.output,
  bundle: true,
  minify: true,
  define
}
if (options.target) esOptions.target = options.target
if (options.platform) esOptions.platform = options.platform
if (options.format) esOptions.format = options.format
if (options.banner) esOptions.banner = options.banner

console.log(`BUILD`, esOptions)

build(esOptions).then(() => {
  console.log('BUILD Complete !')
}).catch((err) => {
  console.error(err)
  process.exit(1)
});
