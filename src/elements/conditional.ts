import {Context, Command, UpdateStackResult} from '../core'

export interface IfCommand extends Command {
  ifCond: any
  ifBlock: any
  elifCond: any[]
  elifBlock: any[]
  elseCond: any
  elseBlock: any
}

export interface IfCommandData {
  meta: {block: string}
}

export const If = {
  create: (ifCond, ifBlock, elifCond, elifBlock, elseBlock): IfCommand => {
    return {type: 'If', ifCond, ifBlock, elifCond, elifBlock, elseBlock} as IfCommand
  },
  initialize: (ctx: Context, entry: IfCommand, entryData: IfCommandData): void => {
    // if
    if (ctx.vm.evaluate(ctx, entry.ifCond, true)) {
      const block = ctx.vm.createStack(entry.ifBlock.statements, {
        autoupdate: false,
        parent: ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid
      })
      entryData.meta = {block: block.uid}
    }

    // else if
    if (!entryData.meta) {
      for (let i = 0; i < entry.elifCond.length; i++) {
        if (ctx.vm.evaluate(ctx, entry.elifCond[i], true)) {
          const block = ctx.vm.createStack(entry.elifBlock[i].statements, {
            autoupdate: false,
            parent: ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid
          })
          entryData.meta = {block: block.uid}
          break
        }
      }
    }

    // else
    if (!entryData.meta && entry.elseBlock[0]) {
      const block = ctx.vm.createStack(entry.elseBlock[0].statements, {
        autoupdate: false,
        parent: ctx.stack.parent ? ctx.stack.parent : ctx.stack.uid
      })
      entryData.meta = {block: block.uid}
    }
  },
  execute: (ctx: Context, entry: IfCommand, entryData: IfCommandData, timeRemains: number): UpdateStackResult => {
    // initialize on the first call
    if (!entryData.meta) If.initialize(ctx, entry, entryData)

    // update loop
    if (!entryData.meta || !entryData.meta.block) return {timeRemains, done: true}
    const stack = ctx.vm.stacks.get(entryData.meta.block)
    const res = ctx.vm.updateStack(stack, timeRemains, true)
    if (res.done && 'result' in stack) ctx.vm.callReturn(ctx, stack.result)
    if (res.done && 'continue' in stack) ctx.vm.callContinue(ctx)
    return res
  }
}
