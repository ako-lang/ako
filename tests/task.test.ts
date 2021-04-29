import assert from 'assert'
import { runCode } from "./helper"

describe('Task', () => {
    it('Create and run task', () => {
        const { stack } = runCode(`
task Method1 {
  return args[0] * 10
}
task Method2 ["val"] {
  return val * 10
}
task Method3 [ { name = "val" } ] {
  return val * 10
}
a = @Method1(4.2)
b = @Method2(4.2)
c = @Method3(4.2)
        `)
        assert.strictEqual((stack.data as any)['a'], 42)
        assert.strictEqual((stack.data as any)['b'], 42)
        assert.strictEqual((stack.data as any)['c'], 42)
    })
})
