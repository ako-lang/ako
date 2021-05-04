import assert from 'assert'
import {runCode} from './helper'

describe('Assign', function () {
  it('Assign number', () => {
    const {stack} = runCode(`a = 1`)
    assert.strictEqual((stack.data as any)['a'], 1)
  })

  it('Assign string', () => {
    const {stack} = runCode(`
a = "abc"
b = ""
c = 'abc'
d = ''
e = "I don't want this string to be truncated !"
f = "{a}def"
      `)
    assert.strictEqual((stack.data as any)['a'], 'abc')
    assert.strictEqual((stack.data as any)['b'], '')
    assert.strictEqual((stack.data as any)['c'], 'abc')
    assert.strictEqual((stack.data as any)['d'], '')
    assert.strictEqual((stack.data as any)['e'], "I don't want this string to be truncated !")
    assert.strictEqual((stack.data as any)['f'], 'abcdef')
  })

  it('Assign boolean', () => {
    const {stack} = runCode(`a = true`)
    assert.strictEqual((stack.data as any)['a'], 1)
  })

  it('Assign variable', () => {
    const {stack} = runCode(`a = 42
	b = a`)
    assert.strictEqual((stack.data as any)['a'], 42)
    assert.strictEqual((stack.data as any)['b'], 42)
  })
})
