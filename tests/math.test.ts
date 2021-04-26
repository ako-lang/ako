import { runCode } from "./helper"

describe('Math Expression', () => {
    test('Add', () => {
        const { stack } = runCode(`a = 42 + 2`)
        expect((stack.data as any)['a']).toBe(44)
    })

    test('Add Float', () => {
        const { stack } = runCode(`a = 42 + 2.25`)
        expect((stack.data as any)['a']).toBe(44.25)
    })

    test('Add Negative', () => {
        const { stack } = runCode(`a = 42 + -2.25`)
        expect((stack.data as any)['a']).toBe(39.75)
    })

    test('Sub', () => {
        const { stack } = runCode(`a = 42 - 2`)
        expect((stack.data as any)['a']).toBe(40)
    })

    test('Multi', () => {
        const { stack } = runCode(`a = 42 * 2`)
        expect((stack.data as any)['a']).toBe(84)
    })

    test('Multi Float', () => {
        const { stack } = runCode(`a = 40.5 * 2`)
        expect((stack.data as any)['a']).toBe(81)
    })

    test('Multi Priority', () => {
        const { stack: stack1 } = runCode(`a = 40 * 2 + 1`)
        const { stack: stack2 } = runCode(`a = 1 + 40 * 2`)
        const { stack: stack3 } = runCode(`a = (40 * 2) + 1`)
        const { stack: stack4 } = runCode(`a = (1 + 40) * 2`)
        expect((stack1.data as any)['a']).toBe(81)
        expect((stack2.data as any)['a']).toBe(81)
        expect((stack3.data as any)['a']).toBe(81)
        expect((stack4.data as any)['a']).toBe(82)
    })

    test('Modulo', () => {
        const { stack: stack1 } = runCode(`a = 40 % 3`)
        const { stack: stack2 } = runCode(`a = -2 % 3`)
        expect((stack1.data as any)['a']).toBe(1)
        expect((stack2.data as any)['a']).toBe(2)
    })
})