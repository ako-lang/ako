import { getGrammar } from '../semantic'
import { Interpreter } from '../interpreter'
import fs from 'fs'
import path from 'path'
import { listAkoFiles } from '../helpers/folder'
import { Stack } from '../core'

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
        if (!match) throw new Error(`Syntax Error with file ${path.join(projectFolder, file)}`)
        const ast = ASTBuilder(match).toAST()
        const methodName = namespace ? `${namespace}.${fileId}` : fileId

        console.log(`Register method : ${methodName}`)
        if (vm.tasks.has(methodName)) {
            throw new Error(`Task Name Already Used : ${methodName}`)
        }
        vm.registerTask(methodName, (ctx, _, fnData, timeRemains) => {
            if (!fnData.meta.block) {
                // console.log(`Create Stack ${methodName}`, fn, fnData)
                const block = ctx.vm.createStack(ast, undefined)
                ctx.vm.setData({ vm: ctx.vm, stack: block }, 'args', fnData.meta.args || [])
                fnData.meta.block = block.uid
            }

            const stack = ctx.vm.stacks.get(fnData.meta.block) as Stack
            const res = ctx.vm.updateStack(stack, timeRemains, true)
            if (res.done) res.result = stack.result
            return res
        })
    }

    // execute entry point
    if (mod.entry) {
        for (const file of mod.entry) {
            const fileId = file.replace('.ako', '')
            const method = namespace ? `${namespace}.${fileId}` : fileId
            const match = grammar.match(`@${method}()`)
            const ast = ASTBuilder(match).toAST()
            console.log('Create Stack >', fileId)
            vm.createStack(ast)
        }
    }
}

// Get file content
const args = process.argv.slice(2)
let file = args.shift()
if (!file || !fs.existsSync(file)) throw new Error(`File does not exists : ${file}`)
if (fs.lstatSync(file).isDirectory()) file = path.join(file, 'module.json')

// Parse code to AST
const { grammar, ASTBuilder } = getGrammar()
const vm = new Interpreter()

// Open a project
const projectFolder = path.dirname(file)
const modulePath = path.join(projectFolder, 'module.json')
if (fs.existsSync(modulePath)) {
    loadAkoModule(vm, projectFolder)
} else {
    const codeTxt = fs.readFileSync(path.resolve(file))
    const match = grammar.match(codeTxt.toString())
    if (!match) throw new Error(`Syntax Error with file ${file}`)
    const ast = ASTBuilder(match).toAST()
    vm.createStack(ast)
}

let counter = 10000;
(async () => {
    while (vm.stacks.size > 0 && counter > 0) {
        vm.update(16)
        await new Promise((resolve) => setTimeout(resolve, 16))
        counter -= 16
    }
    // console.log(vm)
})();
