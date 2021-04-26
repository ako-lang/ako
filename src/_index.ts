// import { getGrammar } from './semantic'
// import { VM } from './interpreter'

// //
// const { grammar, ASTBuilder } = getGrammar()

// const code = fs.readFileSync('./src/test.ako')
// const match = grammar.match(code)
// if (!match) throw new Error('Cant parse')

// const ast = ASTBuilder(match).toAST()

// const vm = new VM()
// vm.registerFunction('Math.max', (...args) => Math.max(...args))
// vm.registerFunction('Math.min', (...args) => Math.min(...args))
// vm.registerCommand('log', (ctx, fn, timeRemains) => {
//     console.log('[LOG]', ...fn.meta.args)
//     return { timeRemains, done: true}
// })
// vm.registerCommand('sleep', (ctx, fn, timeRemains) => {
//     const duration = fn.meta.args[0] || 0
//     fn.elapsed += timeRemains
//     if (fn.elapsed >= duration) {
//         console.log('Finish Waiting')
//         return { timeRemains: fn.elapsed - timeRemains, done: true }
//     }
//     console.log('WAITING !', fn, fn.elapsed)
//     return { timeRemains: 0, done: false }
// })

// const stack = vm.createStack(ast);

// (async () => {
//     for (let i = 0; i < 100; i++) {
//         // console.log('-- UPDATE --')
//         vm.update(16)
//         await new Promise((resolve) => setTimeout(resolve, 16))
//     }
// })()
// // console.log(stack)
