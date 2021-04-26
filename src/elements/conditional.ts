export const If = {
    create: (ifCond, ifBlock, elifCond, elifBlock, elseBlock) => {
        return { type: 'If', ifCond, ifBlock, elifCond, elifBlock, elseBlock }
    },
    execute: (ctx, entry, entryData, timeRemains) => {
        if (!entryData.meta) {
            // if
            if (ctx.vm.evaluate(ctx, entry.ifCond, true)) {
                const block = ctx.vm.createStack(entry.ifBlock.statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
                entryData.meta = { block: block.uid }
            }

            // else if
            if (!entryData.meta) {
                for (let i = 0; i < entry.elifCond.length; i++) {
                    if (ctx.vm.evaluate(ctx, entry.elifCond[i], true)) {
                        const block = ctx.vm.createStack(entry.elifBlock[i].statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
                        entryData.meta = { block: block.uid }
                        break
                    }
                }
            }

            // else
            if (!entryData.meta && entry.elseBlock[0]) {
                // console.log('Else', entry.elseBlock[0])
                const block = ctx.vm.createStack(entry.elseBlock[0].statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
                entryData.meta = { block: block.uid }
            }
        }

        if (!entryData.meta || !entryData.meta.block) return { timeRemains, done: true }
        const stack = ctx.vm.stacks.get(entryData.meta.block)
        const res = ctx.vm.updateStack(stack, timeRemains, true)
        if (res.done && 'result' in stack) ctx.vm.callReturn(ctx, stack.result)
        return res
    }
}