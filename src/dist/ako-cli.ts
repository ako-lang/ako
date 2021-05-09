import {getGrammar} from '../semantic'
import {Interpreter} from '../interpreter'
import fs from 'fs'
import path from 'path'
import {listAkoFiles} from '../helpers/folder'
import akoGrammar from '../../ako_grammar.txt'

function loadAkoModule(vm: Interpreter, projectFolder: string) {
  const packagePath = path.join(projectFolder, 'module.json')
  if (!fs.existsSync(packagePath)) return
  const mod = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  const namespace = mod.namespace ? mod.namespace : ''
  console.log('package', mod)

  // load deps
  if (mod.deps) {
    for (const dep of mod.deps) {
      loadAkoModule(vm, path.join(projectFolder, dep))
    }
  }

  // load files
  const files = listAkoFiles(projectFolder)
  for (const file of files) {
    const fileId = file.replace('.ako', '')
    const codeTxt = fs.readFileSync(path.join(projectFolder, file), 'utf-8')
    const match = grammar.match(codeTxt.toString())
    if (match.failed()) throw new Error(`Syntax in file "${file}", ${match.message}`)
    if (!match) throw new Error(`Syntax Error with file ${path.join(projectFolder, file)}`)
    const ast = ASTBuilder(match).toAST()
    const methodName = namespace ? `${namespace}.${fileId}` : fileId

    console.log(`Register method : ${methodName}`)
    if (vm.tasks.has(methodName)) {
      throw new Error(`Task Name Already Used : ${methodName}`)
    }

    vm.addFile(methodName, ast)
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
if (fs.lstatSync(argFile).isDirectory()) argFile = path.join(argFile, 'module.json')

// Parse code to AST
const {grammar, ASTBuilder} = getGrammar(akoGrammar)
const interpreter = new Interpreter()

// Open a project
const folder = path.dirname(argFile)
const modulePath = path.join(folder, 'module.json')
if (fs.existsSync(modulePath)) {
  loadAkoModule(interpreter, folder)
} else {
  const codeTxt = fs.readFileSync(path.resolve(argFile))
  const match = grammar.match(codeTxt.toString())
  if (match.failed()) throw new Error(`Syntax in file "${argFile}", ${match.message}`)
  if (!match) throw new Error(`Syntax Error with file ${argFile}`)
  const ast = ASTBuilder(match).toAST()
  interpreter.createStack(ast)
}

let counter = 10000
;(async () => {
  while (interpreter.stacks.size > 0 && counter > 0) {
    interpreter.update(16)
    await new Promise((resolve) => setTimeout(resolve, 16))
    counter -= 16
  }
  // console.log(vm)
})()
