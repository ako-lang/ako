import { runCode } from "./helper"

describe('Conditional', () => {
    test('If', () => {
        const { stack } = runCode(`
a = 42
b = 0
c = 0
if a == 42 {
    b = 1
} else {
    c = 1
}
`)
        expect((stack.data as any)['b']).toBe(1)
        expect((stack.data as any)['c']).toBe(0)
    })

    test('Else', () => {
        const { stack } = runCode(`
a = 42
b = 0
c = 0
if a == 43 {
    b = 1
} else {
    c = 1
}
`)
        expect((stack.data as any)['b']).toBe(0)
        expect((stack.data as any)['c']).toBe(1)
    })

    test('Else if', () => {
        const { stack } = runCode(`
a = 42
b = 0
c = 0
if false { b = 2 } elif a == 41 { b = 3} elif a == 42{ b = 1 } else { c = 1 }
`)
        expect((stack.data as any)['b']).toBe(1)
        expect((stack.data as any)['c']).toBe(0)

        // console.log(stack)
    })
})