import assert from 'assert'
import {runCode} from './helper'

describe('Function', function () {
  it('Check Expression Function', () => {
    const {stack} = runCode(`
a = Math.max(1,2,3,4,5)
list = [1,5,2,3,4]
sorted = List.sort(list)
sorted2 = List.sort(list, (entry1,entry2) => entry2 - entry1)
    `)
    assert.strictEqual((stack.data as any)['a'], 5)
    assert.deepStrictEqual((stack.data as any)['sorted'], [1, 2, 3, 4, 5])
    assert.deepStrictEqual((stack.data as any)['sorted2'], [5, 4, 3, 2, 1])
  })

  it('Vector', () => {
    const {stack} = runCode(`
a = Vec2.create(1, 1)
b = Vec2.add(a, Vec2.create(2, 2))
c = Vec2.sub(Vec2.scale(a, 5), Vec2.create(5, 5))
    `)
    assert.deepStrictEqual((stack.data as any)['a'], [1, 1])
    assert.deepStrictEqual((stack.data as any)['b'], [3, 3])
    assert.deepStrictEqual((stack.data as any)['c'], [0, 0])
  })
})
