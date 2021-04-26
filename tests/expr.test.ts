import { runCode } from "./helper"

describe('Equality Expression', () => {
    test('Equality', () => {
        const { stack: stack1 } = runCode(`
a = 12
b = a > 12
c = a > 11
        `)
        expect((stack1.data as any)['b']).toBe(0)
        expect((stack1.data as any)['c']).toBe(1)

        const { stack: stack2 } = runCode(`
a = 12
b = a >= 12
c = a >= 11
        `)
        expect((stack2.data as any)['b']).toBe(1)
        expect((stack2.data as any)['c']).toBe(1)

        const { stack: stack3 } = runCode(`
a = 12
b = a < 13
c = a < 12
        `)
        expect((stack3.data as any)['b']).toBe(1)
        expect((stack3.data as any)['c']).toBe(0)

        const { stack: stack4 } = runCode(`
a = 12
b = a <= 13
c = a <= 12
        `)
        expect((stack4.data as any)['b']).toBe(1)
        expect((stack4.data as any)['c']).toBe(1)

        const { stack: stack5 } = runCode(`
a = 12
b = a == 12
c = a == 11
        `)
        expect((stack5.data as any)['b']).toBe(1)
        expect((stack5.data as any)['c']).toBe(0)

        const { stack: stack6 } = runCode(`
a = 12
b = a != 12
c = a != 11
        `)
        expect((stack6.data as any)['b']).toBe(0)
        expect((stack6.data as any)['c']).toBe(1)
    })

    test('Bool Or', () => {
        const { stack: stack1 } = runCode(`a = true or false`)
        const { stack: stack2 } = runCode(`a = true or true`)
        const { stack: stack3 } = runCode(`a = false or false`)
        expect((stack1.data as any)['a']).toBe(1)
        expect((stack2.data as any)['a']).toBe(1)
        expect((stack3.data as any)['a']).toBe(0)
    })

    test('Bool And', () => {
        const { stack: stack1 } = runCode(`a = true and false`)
        const { stack: stack2 } = runCode(`a = true and true`)
        const { stack: stack3 } = runCode(`a = false and false`)
        expect((stack1.data as any)['a']).toBe(0)
        expect((stack2.data as any)['a']).toBe(1)
        expect((stack3.data as any)['a']).toBe(0)
    })

    test('Bool And & Or', () => {
        const { stack } = runCode(`
a = 12
b = a > 10 and (a == 12 or false)
c = (a > 10 and a == 12) or false
d = a > 10 and a == 12 or false
e = false or a > 10 and a == 12
f = a > 10 and a == 13 or true
g = true or a > 10 and a == 13`)
        expect((stack.data as any)['b']).toBe(1)
        expect((stack.data as any)['c']).toBe(1)
        expect((stack.data as any)['d']).toBe(1)
        expect((stack.data as any)['e']).toBe(1)
        expect((stack.data as any)['f']).toBe(1)
        expect((stack.data as any)['g']).toBe(0)
    })
})
