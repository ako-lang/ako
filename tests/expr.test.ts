import assert from 'assert'
import {runCode} from './helper'

describe('Math Expression', () => {
  it('Math Functions', () => {
    const {stack: stack1} = runCode(`
a = Math.PI()
b = Math.max(1,2,12,2)
c = Math.min(1,2,12,2)
d = List.map([1,-2,3], (val) => Math.abs(val))
e = List.map([1.2,-2.6,3.6], (val) => Math.ceil(val))
f = List.map([1.2,-2.6,3.6], (val) => Math.floor(val))
    `)
    assert.strictEqual((stack1.data as any)['a'], Math.PI)
    assert.strictEqual((stack1.data as any)['b'], 12)
    assert.strictEqual((stack1.data as any)['c'], 1)
    assert.deepStrictEqual((stack1.data as any)['d'], [1, 2, 3])
    assert.deepStrictEqual((stack1.data as any)['e'], [2, -2, 4])
    assert.deepStrictEqual((stack1.data as any)['f'], [1, -3, 3])
  })

  it('Degree Functions', () => {
    const {stack: stack1} = runCode(`
a = List.map([0, 45, 90, 180], (val) => Angle.toRad(val))
b = List.map([0, 45, 90, 180], (val) => Angle.toDeg(Angle.toRad(val)))
    `)
    assert.deepStrictEqual((stack1.data as any)['a'], [0, Math.PI / 4, Math.PI / 2, Math.PI])
    assert.deepStrictEqual((stack1.data as any)['b'], [0, 45, 90, 180])
  })
})

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
