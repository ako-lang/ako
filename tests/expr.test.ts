import assert from 'assert'
import {runCode} from './helper'

describe('Equality Expression', () => {
  it('Equality', () => {
    const {stack: stack1} = runCode(`
a = 12
b = a > 12
c = a > 11
        `)
    assert.strictEqual((stack1.data as any)['b'], 0)
    assert.strictEqual((stack1.data as any)['c'], 1)

    const {stack: stack2} = runCode(`
a = 12
b = a >= 12
c = a >= 11
        `)
    assert.strictEqual((stack2.data as any)['b'], 1)
    assert.strictEqual((stack2.data as any)['c'], 1)

    const {stack: stack3} = runCode(`
a = 12
b = a < 13
c = a < 12
        `)
    assert.strictEqual((stack3.data as any)['b'], 1)
    assert.strictEqual((stack3.data as any)['c'], 0)

    const {stack: stack4} = runCode(`
a = 12
b = a <= 13
c = a <= 12
        `)
    assert.strictEqual((stack4.data as any)['b'], 1)
    assert.strictEqual((stack4.data as any)['c'], 1)

    const {stack: stack5} = runCode(`
a = 12
b = a == 12
c = a == 11
        `)
    assert.strictEqual((stack5.data as any)['b'], 1)
    assert.strictEqual((stack5.data as any)['c'], 0)

    const {stack: stack6} = runCode(`
a = 12
b = a != 12
c = a != 11
        `)
    assert.strictEqual((stack6.data as any)['b'], 0)
    assert.strictEqual((stack6.data as any)['c'], 1)
  })

  it('Bool Or', () => {
    const {stack: stack1} = runCode(`a = true or false`)
    const {stack: stack2} = runCode(`a = true or true`)
    const {stack: stack3} = runCode(`a = false or false`)
    assert.strictEqual((stack1.data as any)['a'], 1)
    assert.strictEqual((stack2.data as any)['a'], 1)
    assert.strictEqual((stack3.data as any)['a'], 0)
  })

  it('Bool And', () => {
    const {stack: stack1} = runCode(`a = true and false`)
    const {stack: stack2} = runCode(`a = true and true`)
    const {stack: stack3} = runCode(`a = false and false`)
    assert.strictEqual((stack1.data as any)['a'], 0)
    assert.strictEqual((stack2.data as any)['a'], 1)
    assert.strictEqual((stack3.data as any)['a'], 0)
  })

  it('Bool And & Or', () => {
    const {stack} = runCode(`
a = 12
b = a > 10 and (a == 12 or false)
c = (a > 10 and a == 12) or false
d = a > 10 and a == 12 or false
e = false or a > 10 and a == 12
f = a > 10 and a == 13 or true
g = true or a > 10 and a == 13`)
    assert.strictEqual((stack.data as any)['b'], 1)
    assert.strictEqual((stack.data as any)['c'], 1)
    assert.strictEqual((stack.data as any)['d'], 1)
    assert.strictEqual((stack.data as any)['e'], 1)
    assert.strictEqual((stack.data as any)['f'], 1)
    assert.strictEqual((stack.data as any)['g'], 0)
  })
})
