import {getArgs} from '../../helpers/args'

let ask = undefined

if (!process.env.ISWEB) {
  ask = (ctx, entry, entryData, timeRemains) => {
    const setResult = (answer) => {
      entryData.completed = true
      entryData.result = answer
    }

    if (!entryData.started || ctx.vm.resume) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const readline = require('readline')

      const args = getArgs(ctx, ['question', 'answer'], entryData.meta.args)
      entryData.started = true
      entryData.completed = false
      entryData.answer = args.answer

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      if (!entryData.answer) {
        rl.question(args.question, (answer) => {
          rl.close()
          setResult(answer)
        })
      } else {
        rl.close()
      }
    } else if (entryData.answer) {
      setResult(entryData.answer)
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
