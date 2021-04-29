import assert from 'assert'
import { runCode } from "./helper"

describe('Math Expression', () => {
    it('Add', () => {
        const { stack } = runCode(`a = 42 + 2`)
        assert.strictEqual((stack.data as any)['a'], 44)
    })

    it('Add Float', () => {
        const { stack } = runCode(`a = 42 + 2.25`)
        assert.strictEqual((stack.data as any)['a'], 44.25)
    })

    it('Add Negative', () => {
        const { stack } = runCode(`a = 42 + -2.25`)
        assert.strictEqual((stack.data as any)['a'], 39.75)
    })

    it('Sub', () => {
        const { stack } = runCode(`a = 42 - 2`)
        assert.strictEqual((stack.data as any)['a'], 40)
    })

    it('Multi', () => {
        const { stack } = runCode(`a = 42 * 2`)
        assert.strictEqual((stack.data as any)['a'], 84)
    })

    it('Multi Float', () => {
        const { stack } = runCode(`a = 40.5 * 2`)
        assert.strictEqual((stack.data as any)['a'], 81)
    })

    it('Multi Priority', () => {
        const { stack: stack1 } = runCode(`a = 40 * 2 + 1`)
        const { stack: stack2 } = runCode(`a = 1 + 40 * 2`)
        const { stack: stack3 } = runCode(`a = (40 * 2) + 1`)
        const { stack: stack4 } = runCode(`a = (1 + 40) * 2`)
        assert.strictEqual((stack1.data as any)['a'], 81)
        assert.strictEqual((stack2.data as any)['a'], 81)
        assert.strictEqual((stack3.data as any)['a'], 81)
        assert.strictEqual((stack4.data as any)['a'], 82)
    })

    it('Modulo', () => {
        const { stack: stack1 } = runCode(`a = 40 % 3`)
        const { stack: stack2 } = runCode(`a = -2 % 3`)
        assert.strictEqual((stack1.data as any)['a'], 1)
        assert.strictEqual((stack2.data as any)['a'], 2)
    })
})