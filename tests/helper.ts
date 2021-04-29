import {toAst, Interpreter} from '../src/flavor/node'

export function runCode(code: string) {
  const ast = toAst(code)
  const vm = new Interpreter()
  const stack = vm.createStack(ast)
  vm.update(1)
  return {stack, vm}
}
