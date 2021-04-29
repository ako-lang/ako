import assert from 'assert'
import {runCode} from './helper'

describe('Conditional', () => {
  it('If', () => {
    const {stack} = runCode(`
a = 42
b = 0
c = 0
if a == 42 {
    b = 1
} else {
    c = 1
}
`)
    assert.strictEqual((stack.data as any)['b'], 1)
    assert.strictEqual((stack.data as any)['c'], 0)
  })

  it('Else', () => {
    const {stack} = runCode(`
a = 42
b = 0
c = 0
if a == 43 {
    b = 1
} else {
    c = 1
}
`)
    assert.strictEqual((stack.data as any)['b'], 0)
    assert.strictEqual((stack.data as any)['c'], 1)
  })

  it('Else if', () => {
    const {stack} = runCode(`
a = 42
b = 0
c = 0
if false { b = 2 } elif a == 41 { b = 3} elif a == 42{ b = 1 } else { c = 1 }
`)
    assert.strictEqual((stack.data as any)['b'], 1)
    assert.strictEqual((stack.data as any)['c'], 0)

    // console.log(stack)
  })
})
