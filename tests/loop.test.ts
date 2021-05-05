import assert from 'assert'
import {runCode} from './helper'

describe('Loop', function () {
  it('Simple loop', () => {
    const {stack} = runCode(`
b = 38
for a in [1,2,3,4,5,6,7,8] {
  b -= a
}
    `)
    assert.strictEqual((stack.data as any)['b'], 2)
  })

  it('Nested Loop', () => {
    const {stack} = runCode(`
counter = 0
for a in [1,2] {
  for b in [3,4] {
    for c, index in [1,2,3,4] {
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
for a in [1,2] {
  for b in [3,4] {
    for c, index in [1,2,3,4] {
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
for a in [1,2] {
  for b in [3,4] {
    for c, index in [1,2,3,4] {
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

  it('Until Loop', () => {
    const {stack} = runCode(`
counter = 0
for counter < 10 {
  counter += 1
}
    `)
    assert.strictEqual((stack.data as any)['counter'], 10)
  })

  it('Infinite Loop', () => {
    const {stack} = runCode(`
counter = 0
for {
  counter += 1
  if counter >= 10 { return }
}
    `)
    assert.strictEqual((stack.data as any)['counter'], 10)
  })

  it('Infinite Loop with delay', () => {
    const {vm, stack} = runCode(`
counter = 0
for {
  @print("{counter}")
  counter += 1
  if counter >= 10 { return }
  @sleep(1)
}
    `)
    vm.update(16)
    assert.strictEqual((stack.data as any)['counter'], 10)
  })
})
