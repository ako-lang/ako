import {getGrammar} from '../semantic'
import {Interpreter} from '../interpreter'
import fs from 'fs'
import path from 'path'
import {listAkoFiles} from '../helpers/folder'
import akoGrammar from '../../ako_grammar.txt'
import {AnalyzeInfo, Analyzer} from '../analyzer'
import {Command} from '../core'
import chalk from 'chalk'

function loadAkoModule(vm: Interpreter, projectFolder: string, info: AnalyzeInfo[]) {
  const packagePath = path.join(projectFolder, 'manifest.json')
  if (!fs.existsSync(packagePath)) return
  const mod = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  const namespace = mod.namespace ? mod.namespace : ''

  // load deps
  if (mod.deps) {
    for (const dep of mod.deps) {
      loadAkoModule(vm, path.join(projectFolder, dep), info)
    }
  }

  // load files
  const files = listAkoFiles(projectFolder)
  const codes: [string, Command[]][] = []
  for (const file of files) {
    const fileId = file.replace('.ako', '')
    const codeTxt = fs.readFileSync(path.join(projectFolder, file), 'utf-8')
    const match = grammar.match(codeTxt.toString())
    if (!match || match.failed()) {
      info.push({
        level: 'error',
        line: -1,
        file: path.join(projectFolder, file),
        message: `Critical Syntax Error`,
        sample: match.message
      })
    } else {
      const ast = ASTBuilder(match).toAST()
      const methodName = namespace ? `${namespace}.${fileId}` : fileId

      if (vm.tasks.has(methodName)) {
        throw new Error(`Task Name Already Used : ${methodName}`)
      }

      vm.addFile(methodName, ast)
      codes.push([path.join(projectFolder, file), ast])
    }
  }

  const analyzer = new Analyzer(interpreter)
  for (const entry of codes) {
    const errors = analyzer.validate(entry[1])
    errors.forEach((x) => (x.file = entry[0]))
    info = [...info, ...errors]
  }

  if (info.some((x) => x.level === 'error')) {
    console.log(chalk.bold(chalk.red(`[AKO CLI] Found ${info.length} Errors in the code:`)))
    for (let i = 0; i < info.length; i++) {
      const num = chalk.cyanBright(`${i + 1}`)
      const level =
        info[i].level === 'error' ? chalk.red(`[${info[i].level.toUpperCase()}]`) : chalk.yellow(`[${info[i].level.toUpperCase()}]`)
      const line = info[i].line >= 0 ? ` - line ${info[i].line}` : ''
      const location = chalk.green(`(Location: ${info[i].file}${line})`)
      const code =
        (info[i].sample_before ? info[i].sample_before : '') +
        chalk.bold(info[i].sample) +
        (info[i].sample_after ? info[i].sample_after : '')
      console.log(`- ${level} ${num} : ${info[i].message} ${location}`)
      console.log(chalk.gray('  ... ') + code.split('\n').join('\n  ') + chalk.gray(' ...'))
      console.log(' ')
    }
    process.exit(1)
  }

  // execute entry point
  if (mod.entry) {
    for (const file of mod.entry) {
      const fileId = file.replace('.ako', '')
      const method = namespace ? `${namespace}.${fileId}` : fileId
      const match = grammar.match(`@${method}()`)
      const ast = ASTBuilder(match).toAST()
      // console.log('Create Stack >', fileId)
      vm.createStack(ast)
    }
  }
}

// Get file content
const args = process.argv.slice(2)
let argFile = args.shift()
if (!argFile || !fs.existsSync(argFile)) throw new Error(`File does not exists : ${argFile}`)
if (fs.lstatSync(argFile).isDirectory()) argFile = path.join(argFile, 'manifest.json')

// Parse code to AST
const {grammar, ASTBuilder} = getGrammar(akoGrammar)
const interpreter = new Interpreter()

// Open a project
const folder = path.dirname(argFile)
const modulePath = path.join(folder, 'manifest.json')
if (fs.existsSync(modulePath)) {
  const info: AnalyzeInfo[] = []
  loadAkoModule(interpreter, folder, info)
} else {
  const codeTxt = fs.readFileSync(path.resolve(argFile))
  const match = grammar.match(codeTxt.toString())
  if (match.failed()) throw new Error(`Syntax in file "${argFile}", ${match.message}`)
  if (!match) throw new Error(`Syntax Error with file ${argFile}`)
  const ast = ASTBuilder(match).toAST()
  interpreter.createStack(ast)
}

// update interpreter with setInterval
let last = Date.now()
const inter = setInterval(() => {
  const dt = Date.now() - last
  interpreter.update(dt)
  last = Date.now()
  if (interpreter.stacks.size <= 0) clearInterval(inter)
}, 20)
