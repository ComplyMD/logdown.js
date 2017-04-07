/* eslint-env jest */

jest.mock('../../src/util/local-storage', () => require('../mocks/local-storage'))

const logdown = require('../../src/browser')
const localStorage = require('../mocks/local-storage')

describe('localStorage.debug', () => {
  beforeEach(() => {
    console.log = jest.fn()
    logdown.enable('*')
    logdown._instances = []
  })

  afterEach(() => {
    localStorage.removeItem('debug')
    console.log.mockClear()
  })

  it('`localStorage.debug=foo` should enable only instances with “foo” prefix', () => {
    localStorage.debug = 'foo'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    bar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    quz.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    baz.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    expect(console.log).toHaveBeenCalled()
  })

  it('`localStorage.debug=*foo` should enable only instances with names ending with “foo”', () => {
    localStorage.debug = '*foo'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug=foo*` should enable only instances with names beginning with “foo”', () => {
    localStorage.debug = 'foo*'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug=-*` should disable all instances', () => {
    localStorage.debug = '-*'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    foobar.log('lorem')
    foo.log('lorem')
    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('`localStorage.debug=*,-foo` should enable all but only instances with “foo” prefix', () => {
    localStorage.debug = '*,-foo'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const quz = logdown('quz')
    const baz = logdown('baz')

    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    quz.log('lorem')
    baz.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(3)
  })

  it('`localStorage.debug=*,-*foo` should enable all but instances with names ending with “foo”', () => {
    localStorage.debug = '*,-*foo'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug=*,-foo*` should enable all but instances with names beginning with “foo”', () => {
    localStorage.debug = '*,-foo*'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    foobar.log('lorem')
    foo.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    bar.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('`localStorage.debug` should accept N arguments', () => {
    logdown.enable('*')
    localStorage.debug = 'foo,barfoo'

    const foo = logdown('foo')
    const bar = logdown('bar')
    const foobar = logdown('foobar')
    const barfoo = logdown('barfoo')

    bar.log('lorem')
    foobar.log('lorem')
    expect(console.log).not.toHaveBeenCalled()
    foo.log('lorem')
    barfoo.log('lorem')
    expect(console.log).toHaveBeenCalledTimes(2)
  })
})
