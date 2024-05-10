import {
  falsyTypes,
  ignoreTypes,
  isArray,
  isDate,
  isObject,
  isString,
  isUndefined,
  normalTypes,
  nullTypes,
  removeComma,
  isDigit,
  isSign,
} from './tools'

const ISORegExp =
  /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/

const stringify = (obj: any): string | undefined => {
  // undefined function symbol 三种类型不能转换为JSON
  if (ignoreTypes(obj)) {
    return undefined
  }

  // date
  if (isDate(obj)) {
    return '"' + obj.toISOString() + '"'
  }

  // null
  if (nullTypes(obj)) {
    return '' + null
  }

  // number string boolean
  if (normalTypes(obj)) {
    const passQuote: string = isString(obj) ? '"' : ''
    return passQuote + obj + passQuote
  }

  // array
  if (isArray(obj)) {
    let result: string = ''
    obj.forEach((value: any) => {
      result += falsyTypes(value) ? stringify(null) : stringify(value)
      result += ','
    })
    return `[${removeComma(result)}]`
  }

  // object
  if (isObject(obj)) {
    let result: string = ''
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      result += !ignoreTypes(value) ? `"${key}":${stringify(value)},` : ''
    })
    return `{${removeComma(result)}}`
  }

  return ''
}

const parse = (str: string | undefined) => {
  if (isUndefined(str)) {
    throw new Error(
      `VM562:1 Uncaught SyntaxError: "undefined" is not valid JSON`
    )
  }
  return parseStr(str!)
}

const parseStr = (str: string) => {
  let i: number = 0

  // 错误处理：
  const printCodeSnippet = (message: string) => {
    const from = Math.max(0, i - 10)
    const trimmed = from > 0
    const padding = (trimmed ? 4 : 0) + (i - from)
    const snippet = [
      (trimmed ? '... ' : '') + str!.slice(from, i + 1),
      ' '.repeat(padding) + '^',
      ' '.repeat(padding) + message,
    ].join('\n')
    console.log(snippet)
  }

  // parseValue 完成之后，指针应该到了最后 str.length
  const expectEndOfInput = () => {
    if (i < str.length) {
      printCodeSnippet('Expecting to end here')
      throw new Error('JSON_ERROR_0002 Expected End of Input')
    }
  }

  // 对象的key 错误
  const expectObjectKey = () => {
    printCodeSnippet(`Expecting object key here

For example:
{ "foo": "bar" }
    ^^^^^`)
    throw new Error('JSON_ERROR_0003 Expecting JSON Key')
  }

  // 数据结构的最后应该以 expected 结尾
  const expectNotEndOfInput = (expected: string) => {
    printCodeSnippet(`Expecting a \`${expected}\` here`)
    throw new Error('JSON_ERROR_0001 Unexpected End of Input')
  }

  const expectEscapeUnicode = (strSoFar: string) => {
    printCodeSnippet(`Expect escape unicode

For example:
"${strSoFar}\\u0123
${' '.repeat(strSoFar.length + 1)}^^^^^^`)
    throw new Error('JSON_ERROR_0009 Expecting an escape unicode')
  }

  const expectEscapeCharacter = (strSoFar: string) => {
    printCodeSnippet(`JSON_ERROR_0007 Expecting escape character

For example:
"${strSoFar}\\n"
${' '.repeat(strSoFar.length + 1)}^^
List of escape characters are: \\", \\\\, \\/, \\b, \\f, \\n, \\r, \\t, \\u`)
    throw new Error('JSON_ERROR_0008 Expecting an escape character')
  }

  // 期望数字
  const expectDigit = (numSoFar: string) => {
    if (!isDigit(str[i])) {
      printCodeSnippet(`JSON_ERROR_0005 Expecting a digit here

For example:
${numSoFar}5
${' '.repeat(numSoFar.length)}^`)
      throw new Error('JSON_ERROR_0006 Expecting a digit')
    }
  }

  const expectCharacter = (expected: string) => {
    if (str[i] !== expected) {
      printCodeSnippet(`Expecting a \`${expected}\` here`)
      throw new Error('JSON_ERROR_0004 Unexpected token')
    }
  }

  const expectNotCharacter = (expected: string) => {
    if (str[i] === expected) {
      throw new SyntaxError(`Unexpected token '${expected}', "${str}" is not valid JSON`)
    }
  }

  // 空格
  const skipWhitespace = () => {
    while (/\s/.test(str[i])) {
      i++
    }
  }

  // 逗号
  const eatComma = () => {
    expectCharacter(',')
    i++
  }

  // 冒号
  const eatColon = () => {
    expectCharacter(':')
    i++
  }

  // unicode 16
  const isHexadecimal = (char: string) => {
    return (
      (char >= '0' && char <= '9') ||
      (char.toLowerCase() >= 'a' && char.toLowerCase() <= 'f')
    )
  }

  const parseString = () => {
    if (str[i] === '"') {
      // "
      i++
      let result = ''
      while (str[i] !== '"') {
        if (str[i] === '\\') {
          const char = str[i + 1]

          if (
            char === '"' ||
            char === '\\' ||
            char === '/' ||
            char === 'b' ||
            char === 'f' ||
            char === 'n' ||
            char === 'r' ||
            char === 't'
          ) {
            // \" \/ \b \f \n \r \t
            result += char
            i++
          } else if (char === 'u') {
            // \u unicode-16 编码
            if (
              isHexadecimal(str[i + 2]) &&
              isHexadecimal(str[i + 3]) &&
              isHexadecimal(str[i + 4]) &&
              isHexadecimal(str[i + 5])
            ) {
              result += String.fromCharCode(
                parseInt(str.slice(i + 2, i + 6), 16)
              )
              i += 5
            } else {
              i += 2
              expectEscapeUnicode(result)
            }
          } else {
            expectEscapeCharacter(result)
          }
        } else {
          result += str[i]
        }
        i++
      }
      // 应该为 "
      if (str[i] !== '"') {
        expectNotEndOfInput('"')
      }
      // "
      i++
      // 存储的是时间信息
      if (ISORegExp.test(result)) {
        return new Date(result)
      }
      return result
    } else {
      return undefined
    }
  }

  // 解析数字
  // -123
  // 0123
  // 123
  // 123.123
  // 123e123
  // 123e-123
  // 123e+123
  const parseNumber = () => {
    let start = i
    if (isSign(str[i])) {
      i++
      // i 位置应该为数字
      expectDigit(str.slice(start, i))
    }
    while (str[i] === '0') {
      i++
    }
    if (str[i] >= '1' && str[i] <= '9') {
      i++
      while (isDigit(str[i])) {
        i++
      }
    }

    if (str[i] === '.') {
      i++
      expectDigit(str.slice(start, i))
      while (isDigit(str[i])) {
        i++
      }
    }

    if (str[i] === 'e' || str[i] === 'E') {
      i++
      if (isSign(str[i])) {
        i++
      }
      expectDigit(str.slice(start, i))
      while (isDigit(str[i])) {
        i++
      }
    }
    if (i > start) {
      return Number(str.slice(start, i))
    }
    return undefined
  }

  // 解析特定的关键字
  //  true false null
  const parseKeyword = (name: string, value: boolean | null) => {
    if (str.slice(i, i + name.length) === name) {
      i += name.length
      return value
    } else {
      return undefined
    }
  }

  // 对象
  // { key1 : value , key2: value2}
  const parseObject = () => {
    if (str[i] === '{') {
      // {
      i++
      // 空格
      skipWhitespace()

      const result: any = {}

      // 刚开始不需要跳过逗号
      let initial = true

      while (i < str.length && str[i] !== '}') {
        // 吞掉逗号
        if (!initial) {
          eatComma()
          skipWhitespace()
        }
        const key: any = parseString()
        // key 错误
        if (key === undefined) {
          expectObjectKey()
        }
        skipWhitespace()
        eatColon()
        skipWhitespace()
        const value = parseValue()
        skipWhitespace()
        result[key] = value
        initial = false
      }
      if (str[i] !== '}') {
        expectNotEndOfInput('}')
      }
      // }
      i++
      return result
    }
  }

  // 数组
  // [ value1, ]
  const parseArray = () => {
    if (str[i] === '[') {
      i++
      skipWhitespace()
      const result = []
      let initial = true
      while (str[i] !== ']') {
        if (!initial) {
          eatComma()
          skipWhitespace()
        }
        expectNotCharacter(']')
        const value = parseValue()
        skipWhitespace()
        result.push(value)
        initial = false
      }
      // 应该以 ] 结尾
      if (str[i] !== ']') {
        expectNotEndOfInput(']')
      }
      // ]
      i++
      return result
    } else {
      return undefined
    }
  }

  const parseValue = () => {
    skipWhitespace()
    const value: any =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseKeyword('true', true) ??
      parseKeyword('false', false) ??
      parseKeyword('null', null)
    skipWhitespace()
    return value
  }

  const value = parseValue()
  // 最终i == str.length
  expectEndOfInput()
  return value
}

export { stringify, parse }
