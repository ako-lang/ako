export default {
  ask: (ctx, fn, timeRemains) => {
    /*
        if (!fn.meta.started) {
            // console.log(fn.meta.args)
            const readline = require('readline')
            
            const question = fn.meta.args[0] || "Question"
            const res = fn.meta.args[1]

            fn.meta.started = true
            fn.meta.completed = false

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })

            rl.question(question, (answer) => {
                ctx.vm.setData(ctx, res, answer)
                rl.close()
                fn.meta.completed = true
                // console.log('Completed', res, answer)
            })
        }
        if (fn.meta.completed) return { timeRemains, done: true }
        */
    return {timeRemains: 0, done: false}
  }
}
