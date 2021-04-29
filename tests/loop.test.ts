import assert from 'assert'
import {runCode} from './helper'

describe('Loop', function () {
  it('Simple loop', () => {
    const {stack} = runCode(`
b = 38
for a := [1,2,3,4,5,6,7,8] {
  b -= a
}
    `)
    assert.strictEqual((stack.data as any)['b'], 2)
  })

  it('Simple loop', () => {
    const {stack} = runCode(`
b = 38
for a := [1,2,3,4,5,6,7,8] {
  if a > 3 { return 0 }
  b -= a
}
    `)
    assert.strictEqual((stack.data as any)['b'], 32)
  })

  // TODO: Implement continue
  // TODO: Implement Infinite loop
  // TODO: Check Index
  /*
  it('Check Index', () => {
    const {stack} = runCode(`
b = 0
for val, index := [1,2,3,4,5,6,7,8] {
  @print("this is {val} {index}")
  if index > 1 { return 0 }
  b += val
}
    `)
    assert.strictEqual((stack.data as any)['b'], 3)
  })
  */
})
