import assert from 'assert'
import {runCode} from '../helper'

describe('Readline', () => {
  it('Ask question', () => {
    const {vm, stack} = runCode(`
a = @ask('what is 2+1 ?', 3)
    `)
    assert.strictEqual((stack.data as any)['a'], undefined)
    vm.update(1)
    assert.strictEqual((stack.data as any)['a'], 3)
  })
})
