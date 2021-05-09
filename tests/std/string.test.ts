import assert from 'assert'
import {runCode} from '../helper'

describe('String', () => {
  it('Capitalize', () => {
    const {stack: stack} = runCode(`
a = String.capitalize("bOb is a tuna")
    `)
    assert.strictEqual((stack.data as any)['a'], 'BOb Is A Tuna')
  })

  it('Upper / Lower', () => {
    const {stack: stack} = runCode(`
a = String.upper("bOb is a tuna")
b = String.lower("bOb is a tuna")
    `)
    assert.strictEqual((stack.data as any)['a'], 'BOB IS A TUNA')
    assert.strictEqual((stack.data as any)['b'], 'bob is a tuna')
  })

  it('Length', () => {
    const {stack: stack} = runCode(`
a = len("bOb is a tuna")
b = len("bOb is a tuna")
    `)
    assert.strictEqual((stack.data as any)['a'], 13)
    assert.strictEqual((stack.data as any)['b'], 13)
  })

  it('Repeat', () => {
    const {stack: stack} = runCode(`
a = String.repeat(".", 3)
    `)
    assert.strictEqual((stack.data as any)['a'], '...')
  })

  it('StartsWith / String.endsWith', () => {
    const {stack: stack} = runCode(`
a = String.startsWith("bob is a tuna", "bob")
b = String.startsWith("bob is a tuna", "tuna")
c = String.endsWith("bob is a tuna", "bob")
d = String.endsWith("bob is a tuna", "tuna")
    `)
    assert.strictEqual((stack.data as any)['a'], 1)
    assert.strictEqual((stack.data as any)['b'], 0)
    assert.strictEqual((stack.data as any)['c'], 0)
    assert.strictEqual((stack.data as any)['d'], 1)
  })

  it('Replace', () => {
    const {stack: stack} = runCode(`
a = String.replace("bob is a tuna,bob is a tuna", "bob", "tuna")
b = String.replace("bob is a tuna", "shark", "shark")
    `)
    assert.strictEqual((stack.data as any)['a'], 'tuna is a tuna,tuna is a tuna')
    assert.strictEqual((stack.data as any)['b'], 'bob is a tuna')
  })

  it('Trim', () => {
    const {stack: stack} = runCode(`
a = String.trim(" bob is a tuna ")
    `)
    assert.strictEqual((stack.data as any)['a'], 'bob is a tuna')
  })
})
