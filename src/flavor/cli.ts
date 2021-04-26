import { getGrammar } from '../semantic'
import { Interpreter } from '../interpreter'
import fs from 'fs'
import path from 'path'

// Get file content
const args = process.argv.slice(2)
const file = args.shift()
if (!fs.existsSync(file)) {
    throw new Error(`File does not exists : ${file}`)
}
const codeTxt = fs.readFileSync(path.resolve(file))

// Parse code to AST
const { grammar, ASTBuilder } = getGrammar()
const match = grammar.match(codeTxt.toString())
if (!match) throw new Error(`Syntax Error with file ${file}`)
const ast = ASTBuilder(match).toAST()

// Create Interpreter
const vm = new Interpreter()

let counter = 10000
vm.createStack(ast);
(async () => {
    while (vm.stacks.size > 0 && counter > 0) {
        vm.update(16)
        await new Promise((resolve) => setTimeout(resolve, 16))
        counter -= 16
    }
    console.log(vm)
})();
