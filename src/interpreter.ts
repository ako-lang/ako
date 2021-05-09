import {uid} from './helpers/id'
import * as AkoElement from './elements'
import {stdTasks, stdFunctions} from './std'
import {Task, Context, Func, Stack, UpdateStackResult, IStackOption} from './core'
import {mapArgs} from './helpers/args'

const stackOptionDefault: IStackOption = {
  autoupdate: true,
  parent: undefined,
  priority: 10
}

export class Interpreter {
  resume = false
  stacks: Map<string, Stack> = new Map<string, Stack>()
  functions: Map<string, Func> = new Map()
  tasks: Map<string, Task> = new Map()

  constructor() {
    Object.keys(stdFunctions).forEach((name) => this.registerFunction(name, stdFunctions[name]))
    Object.keys(stdTasks).forEach((name) => this.registerTask(name, stdTasks[name]))
  }

  createStack(elements, options?: Partial<IStackOption>): Stack {
    const opt = Object.assign({}, stackOptionDefault, options) as IStackOption
    const stack: Stack = {
      data: {},
      uid: uid(),
      priority: opt.priority,
      index: 0,
      elapsed: 0,
      started: false,
      done: false,
      parent: opt.parent,
      autoupdate: opt.autoupdate,
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

  addFile(name: string, ast: any): void {
    this.registerTask(name, (ctx, fn, fnData, timeRemains) => {
      if (!fnData.meta.block) {
        const args = mapArgs(ctx, [], ast, fnData.meta.args)
        const block = ctx.vm.createStack(ast, {autoupdate: false})
        for (const key in args) {
          ctx.vm.setData({vm: ctx.vm, stack: block}, key, args[key])
        }
        ctx.vm.setData({vm: ctx.vm, stack: block}, 'args', Object.values(args))
        fnData.meta.block = block.uid
      }

      const stack = ctx.vm.stacks.get(fnData.meta.block) as Stack
      const res = ctx.vm.updateStack(stack, timeRemains, true)
      if (res.done) res.result = stack.result
      return res
    })
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

  callContinue(ctx: Context): void {
    ctx.stack.continue = true
    ctx.stack.index = ctx.stack.elements.length
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
    if (!AkoElement[expr.type] || !AkoElement[expr.type].evaluate) throw new Error(`Cannot Evaluate ${expr.type}`)
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
    const stacks = [...this.stacks.values()]
    stacks.sort((a, b) => a.priority - b.priority)
    for (const entry of stacks) {
      if (!entry.autoupdate) continue
      this.updateStack(entry, timeRemains)
    }
  }

  updateStack(stack: Stack, timeRemains: number, autodelete = true): UpdateStackResult {
    stack.started = true
    let time = timeRemains

    while (stack.index < stack.elements.length && time > 0) {
      const entry = stack.elements[stack.index]
      const entryData = stack.elementsData[stack.index]
      if (!AkoElement[entry.type]) {
        throw new Error('Cannot find element: ' + entry.type)
      } else if (!AkoElement[entry.type].execute) {
        throw new Error('Cannot execute element: ' + entry.type)
      }
      const res = AkoElement[entry.type].execute({vm: this, stack}, entry, entryData, time)
      time = res.timeRemains
      if (res.done) {
        entry.done = true
        stack.index++
      }
    }
    if (stack.index >= stack.elements.length) {
      stack.done = true
      if (autodelete) this.deleteStack(stack)
    }
    return {timeRemains: time, done: stack.done}
  }

  deleteStack(stack: Stack): void {
    this.stacks.delete(stack.uid)
  }

  getState(): any {
    return [...this.stacks]
  }

  setState(data: any) {
    this.stacks = new Map(data)
    for (const stack of [...this.stacks.values()]) {
      for (let i = 0; i < stack.elements.length; i++) {
        const entry = stack.elements[i]
        const entryData = stack.elementsData[i]
        if (entry.type === 'TaskDef') {
          AkoElement.TaskDef.execute({vm: this, stack}, entry, entryData, 0.1)
          console.log('Found TaskDef', entry, entryData)
        }
      }
    }
    this.resume = true
    this.update(0.000001)
    this.resume = false
  }
}
