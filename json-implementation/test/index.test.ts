import { describe, it, expect, assert } from 'vitest'
import { parse, stringify } from '../src/JSONimp.ts'

const testObj = {
  name: 'John',
  age: 20,
  isMan: true,
  income: null,
  wife: null,
}

const test = (value: any) => {
  const result = parse(stringify(value))
  expect(stringify(value)).toBe(stringify(result))
}

describe('parse and stringfy', () => {
  it('Number', () => {
    const value = 1234
    test(value)
  })

  it('String', () => {
    const value = 'test'
    test(value)
  })

  it('Boolean', () => {
    const value = true
    test(value)
  })

  it('Object', () => {
    const value = testObj
    test(value)
  })

  it('Nested Objects', () => {
    const value = {
      ...testObj,
      address: {
        city: 'San Francisco',
        zipCode: 94130,
      }
    }
    test(value)
  })

  it('Array', () => {
    const value = [1, 2, 3, null]
    test(value)
  })

  it('Nested Array', () => {
    const value = [1, 2, Symbol(), 4, [undefined, 8, 9, [10]]]
    test(value)
  })

  it('parse invalid Array', () => {
    const value = "[1, 2, 3,]"
    expect(() => parse(value)).toThrowError("Unexpected token")
  })

  it('Object with Arrays', () => {
    const value = { ...testObj, testArr: [1, 2, 3, () => {}, [10]] }
    test(value)
  })

  it('Date', () => {
    const value = new Date()
    test(value)
  })

  it('Object with Date', () => {
    const value = {
      ...testObj,
      birthDate: new Date(),
    }
    test(value)
  })

  it('Null', () => {
    const value = null
    test(value)
  })

  it('Undefined', () => {
    const value = undefined
    test(value)
  })

  it('function', () => {
    const value = () => {}
    expect(stringify(value)).toBe(undefined)

    const value2 = (function() { return 'test' })
    expect(stringify(value2)).toBe(undefined)
  })

  it('Object with Function', () => {
    const value = { ...testObj, testFunc: () => {} }
    test(value)
  })
})

