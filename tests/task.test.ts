import assert from 'assert'
import {runCode, runFileCode} from './helper'

describe('Task', () => {
  it('Unexisting Task', () => {
    assert.throws(() => {
      runCode(`
a = @unknown(1,2,3,4,5)
    `)
    })
  })

  it('Create and run task', () => {
    const {stack} = runCode(`
task Method1 {
  @print(args)
  return args[0] * 10
}
task Method2 ["val"] {
  @print(args)
  return val * 10
}
task Method3 [ { name = "val" } ] {
  @print(args)
  return val * 10
}
a = @Method1(4.2)
b = @Method2(4.2)
c = @Method3(4.2)
        `)
    assert.strictEqual((stack.data as any)['a'], 42)
    assert.strictEqual((stack.data as any)['b'], 42)
    assert.strictEqual((stack.data as any)['c'], 42)
  })

  it('Task call', () => {
    const {stack} = runCode(`
task Method [ { name = "val1" }, { name = "val2" }, { name = "val3" } ] {
  entries = [val1, val2, val3]
  @print('entries', entries)
  return entries
}

task Method2 {
  ## Args [
    { name = "val1", default = -1 },
    { name = "val2", default = -2 },
    { name = "val3", default = -3 }
  ]
  entries = [val1, val2, val3]
  @print('entries', entries)
  return entries
}

a = @Method(1, 2, 3)
b = @Method(val2=2, val1=1, val3 = 3)
c = @Method2(1, 2)
d = @Method2(val1=1, val3=3)
`)
    assert.deepStrictEqual((stack.data as any)['a'], [1, 2, 3])
    assert.deepStrictEqual((stack.data as any)['b'], [1, 2, 3])
    assert.deepStrictEqual((stack.data as any)['c'], [1, 2, -3])
    assert.deepStrictEqual((stack.data as any)['d'], [1, -2, 3])
  })

  it('Task File', () => {
    const vm = runFileCode(
      'MethodName',
      `
## Args [
  { name = "val1", default = -1 },
  { name = "val2", default = -2 },
  { name = "val3", default = -3 }
]
entries = [val1, val2, val3]
@print('entries', entries)
return entries`
    )
    const {stack} = runCode(
      `
a = @MethodName(1, 2, 3)
b = @MethodName(val2=2, val1=1, val3=3)
c = @MethodName(1, 2)
d = @MethodName(val1=1, val3=3)
arg = [1,2,3]
e = @MethodName(arg[0], arg[1], arg[2])
    `,
      vm
    )
    //console.log(stack.data)
    assert.deepStrictEqual((stack.data as any)['a'], [1, 2, 3])
    assert.deepStrictEqual((stack.data as any)['b'], [1, 2, 3])
    assert.deepStrictEqual((stack.data as any)['c'], [1, 2, -3])
    assert.deepStrictEqual((stack.data as any)['d'], [1, -2, 3])
    assert.deepStrictEqual((stack.data as any)['e'], [1, 2, 3])
  })

  it('Sleep', () => {
    const {stack, vm} = runCode(`
a = 1
@sleep(1)
a = 2
    `)
    assert.strictEqual((stack.data as any)['a'], 1)
    vm.update(2)
    assert.strictEqual((stack.data as any)['a'], 2)
  })

  it('Skip Task', () => {
    const vm = runFileCode(
      'Delay',
      `
## Args [
  { name = "val", default = 0 }
]
@print("START {val}")
@sleep(val)
@mem_incr('counter', 1)
count = @mem_get('counter')
@print("STOP", count)
    `
    )
    const {stack: stack2} = runCode(
      `
@mem_set('counter', 0)
list = []
for a in [1,2,5] {
  @print("val: {a}")
  job = @@Delay(a)
  list = List.append(list, job)
}

@print("Task : {list}")
a = @mem_get('counter')
@waitTasks(list)
b = @mem_get('counter')
@print('res {b}')
    `,
      vm
    )
    assert.strictEqual((stack2.data as any)['a'], 0)
    vm.update(2)
    vm.update(2)
    vm.update(2)
    assert.strictEqual((stack2.data as any)['b'], 3)
    console.log(stack2.data)
    // assert.strictEqual((stack2.data as any)['a'], 1)
  })
})
