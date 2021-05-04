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

  it('Nested Loop', () => {
    const {stack} = runCode(`
counter = 0
for a := [1,2] {
  for b := [3,4] {
    for c, index := [1,2,3,4] {
      counter += c
    }
    counter += b
  }
  counter += a
}
    `)
    assert.strictEqual((stack.data as any)['counter'], 57)
  })

  it('Nested Loop with return', () => {
    const {stack} = runCode(`
counter = 0
for a := [1,2] {
  for b := [3,4] {
    for c, index := [1,2,3,4] {
      counter += c
      if counter >= 3 {
        return
      }
    }
    counter += b
  }
  counter += a
}
    `)
    assert.strictEqual((stack.data as any)['counter'], 3)
  })

  it('Nested Loop with continue', () => {
    const {stack} = runCode(`
counter = 0
for a := [1,2] {
  for b := [3,4] {
    for c, index := [1,2,3,4] {
      if counter >= 3 {
        continue
      }
      counter += c
    }
    counter += b
  }
  counter += a
}
    `)
    assert.strictEqual((stack.data as any)['counter'], 20)
  })

  // TODO: Implement Infinite loop
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
