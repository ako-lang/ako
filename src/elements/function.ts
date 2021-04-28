export const AssignTask = {
    create: (operator, symbol, command) => {
        return { type: 'AssignTask', operator, symbol, command }
    },
    execute: (ctx, entry, entryData, timeRemains) => {
        const variable = ctx.vm.evaluate(ctx, entry.symbol)

        const res = Task.execute(ctx, entry.command, entryData, timeRemains)
        if (res.done) ctx.vm.setData(ctx, variable.value, ctx.vm.getData(ctx, '$'))

        return res
    }
}

export const Task = {
    create: (namespace, name, args) => {
        return { type: 'Task', namespace, name, args }
    },
    execute: (ctx, entry, entryData, timeRemains) => {
        if (!entryData.meta) {
            let fn = ctx.vm.evaluate(ctx, entry.name)
            if (entry.namespace && entry.namespace.length > 0) {
                let namespace = ctx.vm.evaluate(ctx, entry.namespace[0], true)
                fn = `${namespace}.${fn}`
            }
            const args = entry.args.map(x => ctx.vm.evaluate(ctx, x, true))
            entryData.meta = { fn, args }
        }

        const res = ctx.vm.callTask(ctx, entry, entryData, timeRemains)
        if (res.done && 'result' in res) ctx.vm.setData(ctx, '$', res.result)
        return res
    }
}

export const TaskDef = {
    create: (name, block) => {
        return { type: 'TaskDef', name, block }
    },
    execute: (ctx, entry, entryData, timeRemains) => {
        ctx.vm.registerTask(entry.name.value, (ctx2, entry2, entryData2, time) => {
            if (!entryData2.meta.block) {
                const block = ctx2.vm.createStack(entry.block.statements, undefined)
                ctx2.vm.setData({ vm: ctx2.vm, stack: block }, 'args', entryData2.meta.args || [])
                entryData2.meta.block = block.uid
            }

            const stack = ctx2.vm.stacks.get(entryData2.meta.block)
            const res = ctx2.vm.updateStack(stack, time, true)
            if (res.done) res.result = stack.result
            return res
        })
        return { timeRemains, done: true }
    }
}

export const Function = {
    create: (namespace, name, args) => {
        return { type: 'Function', namespace, name, args }
    },
    evaluate: (ctx, entry) => {
        let fn = ctx.vm.evaluate(entry.name)
        if (entry.namespace) {
            const entries = entry.namespace.map(x => ctx.vm.evaluate(ctx, x))
            fn = `${entries.join(',')}.${ctx.vm.evaluate(ctx, entry.name)}`
        }

        const args = entry.args.map(x => ctx.vm.evaluate(ctx, x, true))
        
        // console.log('Call function', fn, entry, args)
        return ctx.vm.callFunction(fn, args)
    }
}

export const Lambda = {
    create: (args, block) => {
        return { type: 'Lambda', args, block }
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