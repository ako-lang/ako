import {Context} from 'node:vm'
import {mapArgs} from '../helpers/args'

export const Metadata = {
  create: (key: any, value: any) => {
    return {type: 'Metadata', key: key.value ? key.value : key, value}
  },
  execute: (ctx, entry, entryData, timeRemains) => {
    return {timeRemains, done: true}
  }
}

export const AssignTask = {
  create: (operator, symbol, command) => {
    return {type: 'AssignTask', operator, symbol, command}
  },
  execute: (ctx, entry, entryData, timeRemains) => {
    const variable = ctx.vm.evaluate(ctx, entry.symbol)

    const res = Task.execute(ctx, entry.command, entryData, timeRemains)
    if (res.done) {
      if ('result' in res) {
        ctx.vm.setData(ctx, variable.value, res.result)
      } else {
        ctx.vm.setData(ctx, variable.value, ctx.vm.getData(ctx, '$'))
      }
    }
    return res
  }
}

export const Args = {
  create: (index, value) => {
    if (value.type === 'Args') return value
    return {type: 'Args', index, value}
  },
  evaluate: (ctx, entry) => entry
}

export const NamedArgs = {
  create: (name, value) => {
    if (value.type === 'NamedArgs') return value
    return {type: 'NamedArgs', name, value}
  },
  evaluate: (ctx, entry) => entry
}

const evalArgs = (ctx, args) => {
  let i = -1
  return args.map((x) => {
    if (x.type === 'KeyValue') {
      return NamedArgs.create(ctx.vm.evaluate(ctx, x.symbol, true), ctx.vm.evaluate(ctx, x.value, true))
    }
    i = i + 1
    return Args.create(i, ctx.vm.evaluate(ctx, x, true))
  })
}

export const Task = {
  create: (namespace, name, args, skip) => {
    return {type: 'Task', namespace, name, args, skip}
  },
  name: (ctx, entry) => {
    let fn = ctx.vm.evaluate(ctx, entry.name)
    if (entry.namespace && entry.namespace.length > 0) {
      const namespace = ctx.vm.evaluate(ctx, entry.namespace[0], true)
      fn = `${namespace}.${fn}`
    }
    return fn
  },
  execute: (ctx, entry, entryData, timeRemains) => {
    if (entry.skip) {
      entry.args = evalArgs(ctx, entry.args)
      const stack = ctx.vm.createStack([{...entry, skip: false}], {
        autoupdate: true,
        priority: 1
      })
      ctx.vm.updateStack(stack, timeRemains, true)
      return {
        timeRemains,
        done: true,
        result: {
          type: 'RunningTask',
          id: stack.uid
        }
      }
    }

    if (!entryData.meta) {
      const fn = Task.name(ctx, entry)
      const args = evalArgs(ctx, entry.args)
      entryData.meta = {fn, args}
    }

    const res = ctx.vm.callTask(ctx, entry, entryData, timeRemains)
    if (res.done && 'result' in res) ctx.vm.setData(ctx, '$', res.result)
    return res
  }
}

export const TaskDef = {
  create: (name, args, block) => {
    return {type: 'TaskDef', name, args: args[0] ? args[0].value : [], block}
  },
  execute: (ctx, entry, entryData, timeRemains) => {
    ctx.vm.registerTask(entry.name.value, (ctx2, entry2, entryData2, time) => {
      if (!entryData2.meta.block) {
        const args = mapArgs(ctx, entry.args, entry.block.statements, entryData2.meta.args || [])
        const block = ctx2.vm.createStack(entry.block.statements, {
          autoupdate: false
        })
        for (const key in args) {
          ctx2.vm.setData({vm: ctx2.vm, stack: block}, key, args[key])
        }
        ctx2.vm.setData({vm: ctx2.vm, stack: block}, 'args', Object.values(args))
        entryData2.meta.block = block.uid
      }

      const stack = ctx2.vm.stacks.get(entryData2.meta.block)
      const res = ctx2.vm.updateStack(stack, time)
      if (res.done) res.result = stack.result
      return res
    })
    return {timeRemains, done: true}
  }
}

export const Function = {
  create: (namespace, name, args) => {
    return {type: 'Function', namespace, name, args}
  },
  name: (ctx: Context, entry) => {
    let fn = ctx.vm.evaluate(ctx, entry.name)
    if (entry.namespace) {
      const entries = entry.namespace.map((x) => ctx.vm.evaluate(ctx, x))
      if (entries.length > 0) {
        fn = `${entries.join(',')}.${ctx.vm.evaluate(ctx, entry.name)}`
      }
    }
    return fn
  },
  evaluate: (ctx: Context, entry) => {
    const name = Function.name(ctx, entry)
    const args = entry.args.map((x) => ctx.vm.evaluate(ctx, x, true))
    return ctx.vm.callFunction(name, ...args)
  }
}

export const Lambda = {
  create: (args, block) => {
    return {type: 'Lambda', args, block}
  },
  evaluate: (ctx, entry) => {
    const ar = ctx.vm.evaluate(ctx, entry.args, true)

    return (...args: any) => {
      for (let i = 0; i < ar.length; i++) {
        ctx.vm.setData(ctx, ar[i].value, args[i])
      }
      return ctx.vm.evaluate(ctx, entry.block, true)
    }
  }
}
