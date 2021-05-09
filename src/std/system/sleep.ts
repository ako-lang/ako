import {isArray} from '../../core'
import {getArgs} from '../../helpers/args'

export default {
  sleep: (ctx, entry, entryData, timeRemains) => {
    if (!entryData.elapsed) {
      const args = getArgs(ctx, ['duration'], entryData.meta.args)
      entryData.elapsed = 0
      entryData.duration = args.duration
    }

    entryData.elapsed += timeRemains
    if (entryData.elapsed >= entryData.duration) return {timeRemains: entryData.elapsed - entryData.duration, done: true}
    return {timeRemains: 0, done: false}
  },
  waitTasks: (ctx, entry, entryData, timeRemains) => {
    if (!entryData.elapsed) {
      const args = getArgs(ctx, ['tasks'], entryData.meta.args)
      entryData.tasks = isArray(args.tasks) ? args.tasks : [args.tasks]
    }
    for (const t of entryData.tasks) {
      const entry = ctx.vm.stacks.get(t.id)
      if (entry && !entry.done) return {timeRemains: 0, done: false}
    }
    return {timeRemains, done: true}
  }
}
