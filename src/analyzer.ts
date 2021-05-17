import {Command, Context, isObject, isString} from './core'
import * as AkoElement from './elements'
import {Interpreter} from './interpreter'

declare type CommandDebug = Command & {debug: {line: number; sample: string}}
const iterate = (elements: Command[], nodes: Command[], filter: (x: Command) => boolean): Command[] => {
  for (const elem of elements) {
    if (filter(elem)) nodes.push(elem)

    for (const key of Object.keys(elem)) {
      if (Array.isArray(elem[key])) {
        iterate(elem[key], nodes, filter)
      } else if (isObject(elem[key]) && 'type' in elem[key]) {
        iterate([elem[key]], nodes, filter)
      }
    }
  }
  return nodes
}

export interface AnalyzeInfo {
  level: 'notice' | 'warning' | 'error'
  line: number
  sample_before?: string
  sample_after?: string
  sample?: string
  message: string
  file?: string
}

export class Analyzer {
  interpreter: Interpreter

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter
  }

  getNodes(ast: Command[], filter: (x: Command) => boolean): Command[] {
    return iterate(ast, [], filter)
  }

  private validateVariable(ast: Command[], ctx: Context, info: AnalyzeInfo[]) {
    const variables = new Set<string>(['args', '$'])

    // check normal assignment
    const assignNodes = this.getNodes(ast, (x) => x.type === 'Assign')
    const assignTaskNodes = this.getNodes(ast, (x) => x.type === 'AssignTask')
    const nodes = [...assignNodes, ...assignTaskNodes]
    for (const node of nodes) {
      const key = this.interpreter.evaluate(ctx, (node as any).symbol, false)
      variables.add(key.value)
    }

    // assignment in foreach loop
    const assignForeachNodes = this.getNodes(ast, (x) => x.type === 'LoopFor')
    for (const node of assignForeachNodes) {
      const item = this.interpreter.evaluate(ctx, (node as any).item, false)
      variables.add(item)

      if ((node as any).index) {
        const index = this.interpreter.evaluate(ctx, (node as any).index, false)
        variables.add(index)
      }
    }

    // assignment of args through metadata
    const assignInlineArgs = this.getNodes(ast, (x) => x.type === 'Metadata' && (x as any).key === 'Args').map((x: any) =>
      x.value.value.map((y) => ctx.vm.evaluate(ctx, y, true))
    )
    if (assignInlineArgs && assignInlineArgs.length > 0) assignInlineArgs[0].forEach((x) => variables.add(x.name))

    // assignment of args through taskdef
    const taskDefs = this.getNodes(ast, (x) => x.type === 'TaskDef')
    for (const taskdef of taskDefs) {
      const args = (taskdef as any).args
      if (args.length === 0) continue
      const argNames = args.map((x) => ctx.vm.evaluate(ctx, x, true)).map((x) => (isString(x) ? x : x.name))
      argNames.forEach((x) => variables.add(x))
    }

    // Check Variable
    const allVariables = this.getNodes(ast, (x) => x.type === 'Symbol')
    for (const variable of allVariables) {
      const key = this.interpreter.evaluate(ctx, variable, false)
      if (!variables.has(key.value)) {
        const val = variable as CommandDebug
        info.push(
          Object.assign(
            {},
            {
              level: 'error',
              message: `Usage of unknown Variable '${key.value}'`
            },
            val.debug
          ) as unknown as AnalyzeInfo
        )
      }
    }
  }

  private validateFunction(ast: Command[], ctx: Context, info: AnalyzeInfo[]) {
    const functions = this.getNodes(ast, (x) => x.type === 'Function')
    const existing = new Set(this.interpreter.functions.keys())

    for (const func of functions) {
      const name = AkoElement.Function.name(ctx, func)
      if (!existing.has(name)) {
        const debug = (func as CommandDebug).debug
        info.push(
          Object.assign(
            {},
            {
              level: 'error',
              message: `Usage of unknown Function '${name}'`
            },
            debug
          ) as unknown as AnalyzeInfo
        )
      }
    }
  }

  private validateTask(ast: Command[], ctx: Context, info: AnalyzeInfo[]) {
    const taskDef = this.getNodes(ast, (x) => x.type === 'TaskDef')
    const tasks = this.getNodes(ast, (x) => x.type === 'Task')

    const existing = new Set(this.interpreter.tasks.keys())
    for (const task of taskDef) {
      const name = AkoElement.Task.name(ctx, task)
      existing.add(name)
    }

    for (const task of tasks) {
      const name = AkoElement.Task.name(ctx, task)
      if (!existing.has(name)) {
        const debug = (task as CommandDebug).debug
        info.push(
          Object.assign(
            {},
            {
              level: 'error',
              message: `Usage of unknown Task '${name}'`
            },
            debug
          ) as unknown as AnalyzeInfo
        )
      }
    }
  }

  validate(ast: Command[]) {
    const fakeCtx = {vm: this.interpreter, stack: undefined}
    const info: AnalyzeInfo[] = []
    this.validateVariable(ast, fakeCtx, info)
    this.validateFunction(ast, fakeCtx, info)
    this.validateTask(ast, fakeCtx, info)

    return info
  }
}
