import assert from 'assert'
import {runCode} from '../helper'

describe('Time', () => {
  it('now', () => {
    const {stack: stack} = runCode(`
a = Time.now()
    `)
    assert.strictEqual(Date.now() - (stack.data as any)['a'] < 5, true)
  })

  it('parse', () => {
    const {stack: stack} = runCode(`
b = Time.parse('2014-07-03')
c = Time.parse('2014-07-03') |> $ + HOUR(5) |> Time.format($, 'yyyy-mm-dd')
    `)
    assert.strictEqual((stack.data as any)['b'], Date.parse('2014-07-03'))
    assert.strictEqual((stack.data as any)['c'], '2014-07-03')
  })

  it('getter', () => {
    const {stack: stack} = runCode(`
date = Time.parse('2014-07-03 17:10:22')

a = Time.day(date) // get day 0-31
b = Time.weekday(date) // get day in the week 0-6
c = Time.year(date) // get year 2014
d = Time.hour(date) // get hour 0-23
e = Time.minute(date) // get minute 0-59
f = Time.second(date) // get second 0-59
g = Time.ms(date) // get second 0-999
h = Time.tz() // get timezone offset in minute
i = Time.format(date, 'yyyy-mm-dd HH:MM:ss')
    `)

    assert.strictEqual((stack.data as any)['a'], 3)
    assert.strictEqual((stack.data as any)['b'], 4)
    assert.strictEqual((stack.data as any)['c'], 2014)
    assert.strictEqual((stack.data as any)['d'], 17)
    assert.strictEqual((stack.data as any)['e'], 10)
    assert.strictEqual((stack.data as any)['f'], 22)
    assert.strictEqual((stack.data as any)['g'], 0)
    assert.strictEqual((stack.data as any)['h'], new Date().getTimezoneOffset())
    assert.strictEqual((stack.data as any)['i'], '2014-07-03 17:10:22')
  })

  it('getter', () => {
    const {stack: stack} = runCode(`
date = Time.parse('2014-07-03 12:01:02')

d1 = Time.format(date + SECOND(10))
d2 = Time.format(date + MINUTE(10))
d3 = Time.format(date + HOUR(24))
d4 = Time.format(date + DAY(24))
d5 = Time.format(date + WEEK())
d6 = Time.format(date + YEAR())
    `)

    assert.strictEqual((stack.data as any)['d1'], '2014-07-03 12:01:12')
    assert.strictEqual((stack.data as any)['d2'], '2014-07-03 12:11:02')
    assert.strictEqual((stack.data as any)['d3'], '2014-07-04 12:01:02')
    assert.strictEqual((stack.data as any)['d4'], '2014-07-27 12:01:02')
    assert.strictEqual((stack.data as any)['d5'], '2014-07-10 12:01:02')
    assert.strictEqual((stack.data as any)['d6'], '2015-07-03 12:01:02')
  })
})
