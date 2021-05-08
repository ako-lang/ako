import assert from 'assert'
import {runCode} from '../helper'

describe('Scalar', () => {
  it('Hexa', () => {
    const {stack} = runCode(`
a = 0.1
b = 1/2
    `)
    assert.strictEqual((stack.data as any)['a'], 0.1)
    assert.strictEqual((stack.data as any)['b'], 0.5)
  })

  it('Hexa', () => {
    const {stack} = runCode(`
a = #000000
b = #FFFFFF
    `)
    assert.strictEqual((stack.data as any)['a'], 0)
    assert.strictEqual((stack.data as any)['b'], 16777215)
  })
})

describe('Math Expression', () => {
  it('Add', () => {
    const {stack} = runCode(`a = 42 + 2`)
    assert.strictEqual((stack.data as any)['a'], 44)
  })

  it('Add', () => {
    const {stack} = runCode(`
a = 1
b = 1
c = 1
d = 1
a += 2
b -= 2
c++
d--`)
    assert.strictEqual((stack.data as any)['a'], 3)
    assert.strictEqual((stack.data as any)['b'], -1)
    assert.strictEqual((stack.data as any)['c'], 2)
    assert.strictEqual((stack.data as any)['d'], 0)
  })

  it('Add Float', () => {
    const {stack} = runCode(`a = 42 + 2.25`)
    assert.strictEqual((stack.data as any)['a'], 44.25)
  })

  it('Add Negative', () => {
    const {stack} = runCode(`a = 42 + -2.25`)
    assert.strictEqual((stack.data as any)['a'], 39.75)
  })

  it('Sub', () => {
    const {stack} = runCode(`a = 42 - 2`)
    assert.strictEqual((stack.data as any)['a'], 40)
  })

  it('Multi', () => {
    const {stack} = runCode(`a = 42 * 2`)
    assert.strictEqual((stack.data as any)['a'], 84)
  })

  it('Multi Float', () => {
    const {stack} = runCode(`a = 40.5 * 2`)
    assert.strictEqual((stack.data as any)['a'], 81)
  })

  it('Multi Priority', () => {
    const {stack: stack1} = runCode(`a = 40 * 2 + 1`)
    const {stack: stack2} = runCode(`a = 1 + 40 * 2`)
    const {stack: stack3} = runCode(`a = (40 * 2) + 1`)
    const {stack: stack4} = runCode(`a = (1 + 40) * 2`)
    assert.strictEqual((stack1.data as any)['a'], 81)
    assert.strictEqual((stack2.data as any)['a'], 81)
    assert.strictEqual((stack3.data as any)['a'], 81)
    assert.strictEqual((stack4.data as any)['a'], 82)
  })

  it('Modulo', () => {
    const {stack: stack1} = runCode(`a = 40 % 3`)
    const {stack: stack2} = runCode(`a = -2 % 3`)
    assert.strictEqual((stack1.data as any)['a'], 1)
    assert.strictEqual((stack2.data as any)['a'], 2)
  })
})
