import {uid} from './helpers/id'
import * as AkoElement from './elements'
import {stdTasks, stdFunctions} from './std'
import {Task, Context, Func, Stack, UpdateStackResult} from './core'

export class Interpreter {
  stacks: Map<string, Stack> = new Map<string, Stack>()
  functions: Map<string, Func> = new Map()
  tasks: Map<string, Task> = new Map()

  constructor() {
    Object.keys(stdFunctions).forEach((name) => this.registerFunction(name, stdFunctions[name]))
    Object.keys(stdTasks).forEach((name) => this.registerTask(name, stdTasks[name]))
  }

  createStack(elements, parent?: string): Stack {
    const stack: Stack = {
      data: {},
      uid: uid(),
      index: 0,
      elapsed: 0,
      started: false,
      done: false,
      parent,
      child: undefined,
      elements,
      elementsData: elements.map((x) => {
        return {
          uid: uid(),
          done: false
        }
      })
    }
    this.stacks.set(stack.uid, stack)
    return stack
  }

  registerFunction(name: string, method: Func): void {
    this.functions.set(name, method)
  }

  callFunction(name: string, ...args: any): any {
    const fn = this.functions.get(name)
    if (!fn) throw new Error(`Unknown Function ${name}`)
    return fn(...args)
  }

  registerTask(name: string, method: Task): void {
    this.tasks.set(name, method)
  }

  callReturn(ctx: Context, val: any): void {
    ctx.stack.result = val
    ctx.stack.index = ctx.stack.elements.length
  }

  callTask(ctx: Context, entry: any, entryData: any, timeRemains: number): UpdateStackResult {
    const fn = this.tasks.get(entryData.meta.fn)
    if (!fn) throw new Error(`Unknown Task ${entryData.meta.fn}`)
    return fn(ctx, entry, entryData, timeRemains)
  }

  evaluate(ctx: Context, expr, resolveSymbol = false): any {
    if (!expr || !expr.type) return expr
    return AkoElement[expr.type].evaluate(ctx, expr, resolveSymbol)
  }

  hasData(ctx: Context, key: string): boolean {
    if (['$', 'args'].includes(key)) return true
    else if (ctx.stack.parent) return key in ctx.vm.stacks.get(ctx.stack.parent).data
    return key in ctx.stack.data
  }

  getData(ctx: Context, key: string): any {
    if (ctx.stack.parent && !['$', 'args'].includes(key)) {
      return ctx.vm.stacks.get(ctx.stack.parent).data[key]
    }
    return ctx.stack.data[key]
  }

  setData(ctx: Context, key: string, value: any): any {
    if (ctx.stack.parent && !['$', 'args'].includes(key)) {
      return (ctx.vm.stacks.get(ctx.stack.parent).data[key] = value)
    }
    ctx.stack.data[key] = value
  }

  update(timeRemains: number): void {
    for (const entry of this.stacks.values()) {
      if (entry.parent) continue
      this.updateStack(entry, timeRemains)
    }
  }

  updateStack(stack: Stack, timeRemains: number, autodelete = true): UpdateStackResult {
    stack.started = true

    while (stack.index < stack.elements.length && timeRemains > 0) {
      const entry = stack.elements[stack.index]
      const entryData = stack.elementsData[stack.index]
      if (!AkoElement[entry.type]) {
        throw new Error('Cannot find element: ' + entry.type)
      } else if (!AkoElement[entry.type].execute) {
        throw new Error('Cannot execute element: ' + entry.type)
      }
      const res = AkoElement[entry.type].execute({vm: this, stack}, entry, entryData, timeRemains)
      timeRemains = res.timeRemains
      if (res.done) {
        entry.done = true
        stack.index++
      }
    }
    if (stack.index >= stack.elements.length) {
      stack.done = true
      if (autodelete) this.stacks.delete(stack.uid)
    }
    return {timeRemains, done: stack.done}
  }
}
