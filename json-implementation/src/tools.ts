export const isArray = (value: any): boolean => {
  return Array.isArray(value) && typeof value === 'object'
}

export const isObject = (value: any): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const isString = (value: any): boolean => {
  return typeof value === 'string'
}

export const isBoolean = (value: any): boolean => {
  return typeof value === 'boolean'
}

export const isNumber = (value: any) => {
  return typeof value === 'number'
}

export const isNull = (value: any) => {
  return value === null && typeof value === 'object'
}

export const isNotNumber = (value: any) => {
  return typeof value === 'number' && isNaN(value)
}

export const isInfinity = (value: any) => {
  return typeof value === 'number' && !isFinite(value)
}

export const isDate = (value: any) => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.getMonth === 'function'
  )
}

export const isUndefined = (value: any) => {
  return value === undefined && typeof value === 'undefined'
}

export const isFunction = (value: any) => {
  return typeof value === 'function'
}

export const isSymbol = (value: any) => {
  return typeof value === 'symbol'
}

export const normalTypes = (value: any) => {
  return isNumber(value) || isString(value) || isBoolean(value)
}

// undefined function symbol
export const ignoreTypes = (value: any) => {
  return isFunction(value) || isSymbol(value)
}

export const nullTypes = (value: any) => {
  return (
    isNotNumber(value) ||
    isInfinity(value) ||
    isNull(value) ||
    isUndefined(value)
  )
}

export const falsyTypes = (value: any) => {
  return (
    isNotNumber(value) ||
    isInfinity(value) ||
    isNull(value) ||
    ignoreTypes(value)
  )
}

export const removeComma = (str: string) => {
  return str.slice(0, -1)
}

export const isDigit = (char: string) => {
  return char >= '0' && char <= '9'
}

export const isSign = (char: string) => {
  return char === '-' || char === '+'
}
