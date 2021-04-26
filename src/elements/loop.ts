import { Context } from "../core"

export interface LoopForData {
    type: string
    item: any
    index: any
    iterator: any[]
    block: any
    meta?: any
}

export const LoopInfinite = {
    create: (block) => {
        return { type: 'LoopInfinite', block }
    }
}

export const LoopWhile = {
    create: (cond, block) => {
        return { type: 'LoopWhile', cond, block }
    }
}

export const LoopFor = {
    create: (item, index, iterator, block) => {
        return { type: 'LoopFor', item, index, iterator, block } as LoopForData
    },
    execute: (ctx: Context, entry: LoopForData, entryData: any, timeRemains: number) => {
        // Initialize
        if (!entryData.meta) {
            const block = ctx.vm.createStack(entry.block.statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
            entryData.meta = {
                itemVar: ctx.vm.evaluate(ctx, entry.item),
                indexVar: ctx.vm.evaluate(ctx, entry.index),
                iterator: ctx.vm.evaluate(ctx, entry.iterator, true),
                index: 0,
                block: block.uid
            }
            if (Array.isArray(entryData.meta.indexVar) && entryData.meta.indexVar.length === 0) entryData.meta.indexVar = undefined
        }
       
        // Iterate
        while (timeRemains > 0 && entryData.meta.index < entryData.meta.iterator.length) {
            const stack = ctx.vm.stacks.get(entryData.meta.block)
            if (!stack.started) {
                if (entryData.meta.indexVar) ctx.vm.setData(ctx, entryData.meta.indexVar, entryData.meta.index)
                ctx.vm.setData(ctx, entryData.meta.itemVar, entryData.meta.iterator[entryData.meta.index])
            }

            if (!stack.done) {
                const res = ctx.vm.updateStack(stack, timeRemains, true)
                timeRemains = res.timeRemains

                if (res.done && 'result' in stack)  {
                    ctx.vm.callReturn(ctx, stack.result)
                    return { timeRemains, done: true }
                }
            }

            // Prepare next loop
            if (stack.done) {
                entryData.meta.index++

                // Create a new stack only if we need to iterate more
                if (timeRemains > 0 && entryData.meta.index < entryData.meta.iterator.length) {
                    const block = ctx.vm.createStack(entry.block.statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
                    block.started = true
                    entryData.meta.block = block.uid
                    
                    if (entryData.meta.indexVar) ctx.vm.setData(ctx, entryData.meta.indexVar, entryData.meta.index)
                    ctx.vm.setData(ctx, entryData.meta.itemVar, entryData.meta.iterator[entryData.meta.index])
                }
            }
        }

        return {
            timeRemains,
            done: entry.meta.index >= entry.meta.iterator.length
        }
    }
}

export const Block = {
    create: (statements) => {
        return { type: 'Block', statements }
    }
}

export const Continue = {
    create: () => {
        return { type: 'Continue' }
    }
}

export const Return = {
    create: (expr) => {
        return { type: 'Return', expr }
    },
    execute: (ctx: Context, entry, entryData, timeRemains: number) => {
        ctx.vm.callReturn(ctx, ctx.vm.evaluate(ctx, entry.expr, true))
        return { timeRemains, done: true }
    }
}