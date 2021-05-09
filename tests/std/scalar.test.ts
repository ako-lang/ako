import assert from 'assert'
import {runCode} from '../helper'

describe('Scalar', () => {
  it('isDefined', () => {
    const {stack: stack} = runCode(`
a = isDefined(tuna)
tuna = "salmon"
b = isDefined(tuna)
    `)
    assert.strictEqual((stack.data as any)['a'], 0)
    assert.strictEqual((stack.data as any)['b'], 1)
  })

  it('isEmpty', () => {
    const {stack: stack} = runCode(`
a = isEmpty([])
b = isEmpty("")
c = isEmpty([1])
d = isEmpty("a")
    `)
    assert.strictEqual((stack.data as any)['a'], 1)
    assert.strictEqual((stack.data as any)['b'], 1)
    assert.strictEqual((stack.data as any)['c'], 0)
    assert.strictEqual((stack.data as any)['d'], 0)
  })

  it('isString', () => {
    const {stack: stack} = runCode(`
a = isString("tuna")
b = isString("")
c = isString(1)
d = isString(["tuna"])
e = isString({ key = value })
    `)
    assert.strictEqual((stack.data as any)['a'], 1)
    assert.strictEqual((stack.data as any)['b'], 1)
    assert.strictEqual((stack.data as any)['c'], 0)
    assert.strictEqual((stack.data as any)['d'], 0)
    assert.strictEqual((stack.data as any)['e'], 0)
  })

  it('isNumber', () => {
    const {stack: stack} = runCode(`
a = isNumber("tuna")
b = isNumber("")
c = isNumber(1)
d = isNumber(["tuna"])
e = isNumber({ key = value })
    `)
    assert.strictEqual((stack.data as any)['a'], 0)
    assert.strictEqual((stack.data as any)['b'], 0)
    assert.strictEqual((stack.data as any)['c'], 1)
    assert.strictEqual((stack.data as any)['d'], 0)
    assert.strictEqual((stack.data as any)['e'], 0)
  })

  it('isList', () => {
    const {stack: stack} = runCode(`
a = isList("tuna")
b = isList("")
c = isList(1)
d = isList(["tuna"])
e = isList({ key = value })
    `)
    assert.strictEqual((stack.data as any)['a'], 0)
    assert.strictEqual((stack.data as any)['b'], 0)
    assert.strictEqual((stack.data as any)['c'], 0)
    assert.strictEqual((stack.data as any)['d'], 1)
    assert.strictEqual((stack.data as any)['e'], 0)
  })
})
