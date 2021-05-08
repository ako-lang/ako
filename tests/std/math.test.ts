import assert from 'assert'
import {runCode} from '../helper'

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
