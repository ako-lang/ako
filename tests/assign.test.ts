import { runCode } from "./helper"

test('Assign number', () => {
    const { stack } = runCode(`a = 1`)
    expect((stack.data as any)['a']).toBe(1)
})

test('Assign string', () => {
    const { stack } = runCode(`a = "abc"`)
    expect((stack.data as any)['a']).toBe("abc")
})

test('Assign boolean', () => {
    const { stack } = runCode(`a = true`)
    expect((stack.data as any)['a']).toBe(1)
})

test('Assign variable', () => {
    const { stack } = runCode(`a = 42
b = a`)
    expect((stack.data as any)['a']).toBe(42)
    expect((stack.data as any)['b']).toBe(42)
})