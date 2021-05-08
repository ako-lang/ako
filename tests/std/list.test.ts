import assert from 'assert'
import {runCode} from '../helper'

describe('List', () => {
  it('Filter', () => {
    const {stack} = runCode(`
list = [1,5,2,3,4,1]
filtered = List.filter(list, (a) => a >= 3)
    `)
    assert.deepStrictEqual((stack.data as any)['list'], [1, 5, 2, 3, 4, 1])
    assert.deepStrictEqual((stack.data as any)['filtered'], [5, 3, 4])
  })

  it('Sort', () => {
    const {stack} = runCode(`
list = [1,5,2,3,4,1]
sorted = List.sort(list)
sorted2 = List.sort(list, (a, b) => b - a)
    `)
    assert.deepStrictEqual((stack.data as any)['list'], [1, 5, 2, 3, 4, 1])
    assert.deepStrictEqual((stack.data as any)['sorted'], [1, 1, 2, 3, 4, 5])
    assert.deepStrictEqual((stack.data as any)['sorted2'], [5, 4, 3, 2, 1, 1])
  })

  it('Reverse', () => {
    const {stack} = runCode(`
list = [1,5,2,3,4,1]
rev = List.reverse(List.sort(list))
    `)
    assert.deepStrictEqual((stack.data as any)['list'], [1, 5, 2, 3, 4, 1])
    assert.deepStrictEqual((stack.data as any)['rev'], [5, 4, 3, 2, 1, 1])

  })

  it('Map', () => {
    const {stack} = runCode(`
list = [1,5,2,3,4,1]
rev = List.map(list, (a) => a * 2)
    `)
    assert.deepStrictEqual((stack.data as any)['list'], [1, 5, 2, 3, 4, 1])
    assert.deepStrictEqual((stack.data as any)['rev'], [2, 10, 4, 6, 8, 2])
  })

  it('Append/Prepend', () => {
    const {stack} = runCode(`
list = [1,5,2,3,4,1]
a = List.prepend(list, 10)
b = List.append(list, 10)
    `)
    assert.deepStrictEqual((stack.data as any)['list'], [1, 5, 2, 3, 4, 1])
    assert.deepStrictEqual((stack.data as any)['a'], [10, 1, 5, 2, 3, 4, 1])
    assert.deepStrictEqual((stack.data as any)['b'], [1, 5, 2, 3, 4, 1, 10])
  })

  it('Concat', () => {
    const {stack} = runCode(`
list = [1,5,2,3,4,1]
list2 = [12,24]
a = List.concat(list, list2)
    `)
    assert.deepStrictEqual((stack.data as any)['list'], [1, 5, 2, 3, 4, 1])
    assert.deepStrictEqual((stack.data as any)['a'], [1, 5, 2, 3, 4, 1, 12, 24])
  })

  it('Concat', () => {
    const {stack} = runCode(`
list = [1,5,2,3,4,1]
a = List.contains(list, 3)
b = List.contains(list, 6)
    `)
    assert.deepStrictEqual((stack.data as any)['list'], [1, 5, 2, 3, 4, 1])
    assert.strictEqual((stack.data as any)['a'], 1)
    assert.strictEqual((stack.data as any)['b'], 0)
  })
})
