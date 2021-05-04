import {toAst, Interpreter} from '../src/dist/ako-node'

export function createInterpreter() {
  return new Interpreter()
}

export function runFileCode(name: string, code: string, vm?: Interpreter) {
  const ast = toAst(code)
  if (!vm) vm = createInterpreter()
  vm.addFile(name, ast)
  return vm
}

export function runCode(code: string, vm?: Interpreter) {
  const ast = toAst(code)
  if (!vm) vm = createInterpreter()
  const stack = vm.createStack(ast)
  vm.update(1)
  return {stack, vm}
}
