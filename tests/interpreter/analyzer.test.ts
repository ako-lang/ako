import assert from 'assert'
import {toAst, Interpreter, Analyzer} from '../../src/dist/ako-node'

describe('Analyzer', function () {
  it('Check', () => {
    const code = toAst(`
a = 1
c = 1
d = Math.max(4, a)
for e in [1,2,3,4] {
  d = @sleep(1, 2)
}
`)

    const interpreter = new Interpreter()
    const analyzer = new Analyzer(interpreter)
    const info = analyzer.validate(code)
    console.log(info)

    assert.strictEqual(true, true)
  })

  it('Find unknown variable', () => {
    const code = toAst(`
a = 1
c = 1
d = Math.max(4, i)
for e in [1,2,3,4] {
  d = @sleep(1, 2)
}
`)

    const interpreter = new Interpreter()
    const analyzer = new Analyzer(interpreter)
    const info = analyzer.validate(code)

    assert.strictEqual(info.length, 1)
    assert.strictEqual(info[0].message, "Usage of unknown Variable 'i'")
  })

  it('Find unknown function', () => {
    const code = toAst(`
a = 1
c = 1
d = Math.mox(4, a)
for e in [1,2,3,4] {
  d = @sleep(1, 2)
}
`)

    const interpreter = new Interpreter()
    const analyzer = new Analyzer(interpreter)
    const info = analyzer.validate(code)

    assert.strictEqual(info.length, 1)
    assert.strictEqual(info[0].message, "Usage of unknown Function 'Math.mox'")
  })

  it('Find unknown task', () => {
    const code = toAst(`
a = 1
c = 1
d = Math.max(4, a)
for e in [1,2,3,4] {
  d = @slaep(1, 2)
}
`)

    const interpreter = new Interpreter()
    const analyzer = new Analyzer(interpreter)
    const info = analyzer.validate(code)

    assert.strictEqual(info.length, 1)
    assert.strictEqual(info[0].message, "Usage of unknown Task 'slaep'")
  })

  it('Find task args', () => {
    const code = toAst(`
task stuff ["val"] {
  return val
}

task stuff2 ["val"] {
  return val2
}

task stuff3 {
  ## Args [
    { name = "val3", type = "int", default = 1, description = "" }
  ]
  return val3
}

@stuff()
@stuff2()
@stuff3()
`)

    const interpreter = new Interpreter()
    const analyzer = new Analyzer(interpreter)
    const info = analyzer.validate(code)

    assert.strictEqual(info.length, 1)
    assert.strictEqual(info[0].message, "Usage of unknown Variable 'val2'")
  })
})
