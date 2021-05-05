import {Context} from '../core'
import {Number} from './scalar'

export interface LoopWhileData {
  type: string
  cond: any
  block: any
}

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
    return {type: 'LoopInfinite', block}
  },
  initialize: (ctx: Context, entry: LoopWhileData, entryData: any) => {
    entry.cond = Number.create(1)
  },
  execute: (ctx: Context, entry: LoopWhileData, entryData: any, timeRemains: number) => {
    // Initialize
    if (!entryData.meta) LoopInfinite.initialize(ctx, entry, entryData)
    return LoopWhile.execute(ctx, entry, entryData, timeRemains)
  }
}

export const LoopWhile = {
  create: (cond, block) => {
    return {type: 'LoopWhile', cond, block}
  },
  initialize: (ctx: Context, entry: LoopWhileData, entryData: any) => {
    entryData.meta = {
      block: 0,
      cond: ctx.vm.evaluate(ctx, entry.cond, true)
    }

    console.log('WHILE LOOP', entryData.meta.cond)
    if (!entryData.meta.cond) return
    const block = ctx.vm.createStack(entry.block.statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
    entryData.meta.block = block.uid
  },
  next: (ctx: Context, entry: LoopWhileData, entryData: any, timeRemains: number) => {
    if (timeRemains <= 0) return

    entryData.meta.cond = ctx.vm.evaluate(ctx, entry.cond, true)
    console.log('WHILE LOOP', entryData.meta.cond)
    if (!entryData.meta.cond) return
    const block = ctx.vm.createStack(entry.block.statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
    entryData.meta.block = block.uid
  },
  execute: (ctx: Context, entry: LoopWhileData, entryData: any, timeRemains: number) => {
    // Initialize
    if (!entryData.meta) LoopWhile.initialize(ctx, entry, entryData)

    // Iterate
    while (timeRemains > 0 && entryData.meta.cond) {
      const stack = ctx.vm.stacks.get(entryData.meta.block)

      if (!stack.done) {
        const res = ctx.vm.updateStack(stack, timeRemains, true)
        timeRemains = res.timeRemains

        if ('continue' in stack && stack.continue) {
          LoopWhile.next(ctx, entry, entryData, timeRemains)
          stack.continue = false
          continue
        }

        if (res.done && 'result' in stack) {
          ctx.vm.callReturn(ctx, stack.result)
          return {timeRemains, done: true}
        }
      }

      // Prepare next loop
      if (stack.done) LoopWhile.next(ctx, entry, entryData, timeRemains)
    }

    return {timeRemains, done: !entryData.meta.cond}
  }
}

export const LoopFor = {
  create: (item, index, iterator, block) => {
    return {type: 'LoopFor', item, index: index.length > 0 ? index[0] : index, iterator, block} as LoopForData
  },
  initialize: (ctx: Context, entry: LoopForData, entryData: any) => {
    const block = ctx.vm.createStack(entry.block.statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
    entryData.meta = {
      itemVar: ctx.vm.evaluate(ctx, entry.item),
      indexVar: ctx.vm.evaluate(ctx, entry.index),
      iterator: ctx.vm.evaluate(ctx, entry.iterator, true),
      index: 0,
      block: block.uid
    }

    if (Array.isArray(entryData.meta.indexVar) && entryData.meta.indexVar.length === 0) {
      entryData.meta.indexVar = undefined
    }
  },
  next: (ctx: Context, entry: LoopForData, entryData: any, timeRemains: number) => {
    if (timeRemains <= 0) return
    if (entryData.meta.index >= entryData.meta.iterator.length) return

    const block = ctx.vm.createStack(entry.block.statements, ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid)
    block.started = true
    entryData.meta.block = block.uid

    if (entryData.meta.indexVar) ctx.vm.setData(ctx, entryData.meta.indexVar, entryData.meta.index)
    ctx.vm.setData(ctx, entryData.meta.itemVar, entryData.meta.iterator[entryData.meta.index])
  },
  execute: (ctx: Context, entry: LoopForData, entryData: any, timeRemains: number) => {
    // Initialize
    if (!entryData.meta) LoopFor.initialize(ctx, entry, entryData)

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

        if ('continue' in stack && stack.continue) {
          entryData.meta.index++
          LoopFor.next(ctx, entry, entryData, timeRemains)
          stack.continue = false
          continue
        }

        if (res.done && 'result' in stack) {
          ctx.vm.callReturn(ctx, stack.result)
          return {timeRemains, done: true}
        }
      }

      // Prepare next loop
      if (stack.done) {
        entryData.meta.index++
        LoopFor.next(ctx, entry, entryData, timeRemains)
      }
    }

    return {timeRemains, done: entryData.meta.index >= entryData.meta.iterator.length}
  }
}

export const Block = {
  create: (statements) => {
    return {type: 'Block', statements}
  }
}

export const Continue = {
  create: () => {
    return {type: 'Continue'}
  },
  execute: (ctx: Context, entry, entryData, timeRemains: number) => {
    ctx.vm.callContinue(ctx)
    return {timeRemains, done: true}
  }
}

export const Return = {
  create: (expr) => {
    return {type: 'Return', expr}
  },
  execute: (ctx: Context, entry, entryData, timeRemains: number) => {
    ctx.vm.callReturn(ctx, ctx.vm.evaluate(ctx, entry.expr.length > 0 ? entry.expr[0] : entry.expr, true))
    return {timeRemains, done: true}
  }
}
