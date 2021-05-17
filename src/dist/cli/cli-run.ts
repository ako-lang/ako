import commander from 'commander'
import ohm from 'ohm-js'
import {getGrammar} from '../../semantic'
import {Interpreter} from '../../interpreter'
import fs from 'fs'
import path from 'path'
import {listAkoFiles} from '../../helpers/folder'
import akoGrammar from '../../../ako_grammar.txt'
import {AnalyzeInfo, Analyzer} from '../../analyzer'
import {Command, getModulePath} from '../../core'
import chalk from 'chalk'
import yaml from 'js-yaml'
import {parseDep} from './helpers'

function loadAkoModule(
  grammar: ohm.Grammar,
  ASTBuilder: ohm.Semantics,
  vm: Interpreter,
  projectFolder: string,
  info: AnalyzeInfo[],
  scope: string[] = [],
  overwriteScope?: string
) {
  const packagePath = path.join(projectFolder, 'manifest.yaml')
  if (!fs.existsSync(packagePath)) return
  const mod = yaml.load(fs.readFileSync(packagePath, 'utf-8'))
  let currentScope = []
  if (scope.length > 0 || overwriteScope) {
    currentScope = [...scope, overwriteScope ? overwriteScope : mod.id]
  }

  const depsScope = new Map()
  const localScope = new Map()

  // load deps
  if (mod.deps) {
    for (const dependency of mod.deps) {
      const dep = parseDep(dependency)
      const depScope = 'scope' in dep ? dep.scope : undefined
      if (!('url' in dependency)) continue
      if (dep.url.startsWith('.')) {
        loadAkoModule(grammar, ASTBuilder, vm, path.join(projectFolder, dep.url), info, currentScope, depScope)
      } else {
        let localPath = getModulePath(dep)
        if ('path' in dep) localPath = path.join(localPath, dep.path)
        loadAkoModule(grammar, ASTBuilder, vm, localPath, info, currentScope, depScope)
      }
      depsScope.set(depScope, [...currentScope, depScope].join('.'))
    }
  }

  const cur = path.relative(__dirname, path.resolve(projectFolder))

  if (mod.functions) {
    if (!Array.isArray(mod.functions)) mod.functions = [mod.functions]
    for (const dep of mod.functions) {
      if (!fs.existsSync(path.join(projectFolder, dep))) {
        console.warn(`Cant open function ${path.join(projectFolder, dep)}. Please Check your manifest file.`)
        continue
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const functions = require('./' + path.join(cur, dep).replace(/\\/g, '/').replace('.js', ''))
      Object.keys(functions).forEach((name) => {
        vm.registerFunction([...currentScope, name].join('.'), functions[name])
        localScope.set(name, [...currentScope, name].join('.'))
      })
    }
  }

  if (mod.commands) {
    if (!Array.isArray(mod.commands)) mod.commands = [mod.commands]
    for (const dep of mod.commands) {
      if (!fs.existsSync(path.join(projectFolder, dep))) {
        console.warn(`Cant open function ${path.join(projectFolder, dep)}. Please Check your manifest file.`)
        continue
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const tasks = require('./' + path.join(cur, dep).replace(/\\/g, '/').replace('.js', ''))
      Object.keys(tasks).forEach((name) => {
        vm.registerTask([...currentScope, name].join('.'), tasks[name])
        localScope.set(name, [...currentScope, name].join('.'))
      })
    }
  }

  const paths = Object.assign({assets: './assets', code: './src'}, mod.paths)

  // load files
  const files = listAkoFiles(path.join(projectFolder, paths.code)).map((x) =>
    x.replace(path.join(projectFolder, paths.code) + '/', '').replace(/\\/g, '/')
  )

  const codes: [string, Command[]][] = []
  for (const file of files) {
    const fileId = path.basename(file).replace('.ako', '')
    const codeTxt = fs.readFileSync(file, 'utf-8')
    const match = grammar.match(codeTxt.toString())
    if (!match || match.failed()) {
      info.push({
        level: 'error',
        line: -1,
        file: file,
        message: `Critical Syntax Error`,
        sample: match.message
      })
    } else {
      const ast = ASTBuilder(match).toAST()
      const methodName = [...currentScope, fileId].join('.')

      if (vm.tasks.has(methodName)) {
        throw new Error(`Task Name Already Used : ${methodName}`)
      }

      vm.addFile(methodName, ast)
      codes.push([file, ast])
    }
  }

  const analyzer = new Analyzer(vm)
  for (const entry of codes) {
    // rewrite dependencies
    const nodes = analyzer.getNodes(entry[1], (x) => x.type === 'Task' || x.type === 'Function')
    const keyVals = [...depsScope]
    nodes.forEach((x: any) => {
      const find = keyVals.find((y) => x.name.startsWith(`${y[0]}.`))
      if (find) {
        x.name = `${find[1]}.${x.name.replace(find[0] + '.', '')}`
      } else if (localScope.has(x.name)) {
        x.name = localScope.get(x.name)
      }
    })

    // validates
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
      const line = info[i].line >= 0 ? ` - line ${info[i].line + 1}` : ''
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
  const entry = Object.assign({entry: ''}, mod)
  if (!Array.isArray(entry.entry)) entry.entry = [entry.entry]
  for (const file of entry.entry) {
    if (!file) continue
    const fileId = path.basename(file).replace('.ako', '')
    const method = [...currentScope, fileId].join('.')
    const match = grammar.match(`@${method}()`)
    const ast = ASTBuilder(match).toAST()
    vm.createStack(ast)
  }
}

/**
 * Run Module
 */
export function makeRunCommands(program: commander.Command): void {
  program
    .command('run [source]')
    .description('Execute an ako script')
    .action((source?: string) => {
      source = source !== undefined ? source : '.'
      if (!source || !fs.existsSync(source)) throw new Error(`File does not exists : ${source}`)
      if (fs.lstatSync(source).isDirectory()) source = path.join(source, 'manifest.yaml')

      // Parse code to AST
      const {grammar, ASTBuilder} = getGrammar(akoGrammar)
      const interpreter = new Interpreter()

      // Open a project
      const folder = path.dirname(source)
      const target = path.relative('.', folder)
      if (source && target) process.chdir(target)
      const modulePath = path.join('.', 'manifest.yaml')
      if (fs.existsSync(modulePath)) {
        const info: AnalyzeInfo[] = []
        loadAkoModule(grammar, ASTBuilder, interpreter, '.', info)
      } else if (fs.existsSync(source)) {
        const codeTxt = fs.readFileSync(path.resolve(source))
        const match = grammar.match(codeTxt.toString())
        if (!match || match.failed()) {
          throw new Error(`Syntax in file "${source}", ${match.message}`)
        }
        const ast = ASTBuilder(match).toAST()
        interpreter.createStack(ast)
      } else {
        console.log(chalk.bold(chalk.red(`[AKO CLI] Error ! Cannot run this code, this is not a valid Ako Module.`)))
        process.exit(1)
        return
      }

      // update interpreter with setInterval
      let last = Date.now()
      const inter = setInterval(() => {
        const dt = Date.now() - last
        interpreter.update(dt)
        last = Date.now()
        if (interpreter.stacks.size <= 0) clearInterval(inter)
      }, 20)
    })
}
