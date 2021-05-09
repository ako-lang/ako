import {mapArgs} from '../../helpers/args'

let ask = undefined

if (process.env.ISNODE) {
  ask = (ctx, entry, entryData, timeRemains) => {
    if (!entryData.started || ctx.vm.resume) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const readline = require('readline')

      const args = mapArgs(ctx, ['question'], [], entryData.meta.args || [])
      entryData.started = true
      entryData.completed = false

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      rl.question(args.question, (answer) => {
        rl.close()
        entryData.completed = true
        entryData.result = answer
      })
    }
    if (entryData.completed) return {timeRemains, done: true, result: entryData.result}

    return {timeRemains: 0, done: false}
  }
}

export default {
  ask: (ctx, fn, fnData, timeRemains) => {
    if (!ask) return {timeRemains: 0, done: false}
    return ask(ctx, fn, fnData, timeRemains)
  }
}
