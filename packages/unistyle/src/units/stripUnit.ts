import { ReactText } from 'react'

type Value<V> = V extends string ? number : V
type Unit<V> = V extends string ? string : undefined

export type StripUnit = <V extends ReactText, UR extends boolean = false>(
  value: V,
  unitReturn?: UR
) => UR extends true ? [Value<V>, Unit<V>] : Value<V>

const stripUnit: StripUnit = (value, unitReturn) => {
  const cssRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/

  if (typeof value !== 'string') return unitReturn ? [value, undefined] : value

  const matchedValue = value.match(cssRegex)

  if (unitReturn) {
    if (matchedValue) return [parseFloat(value), matchedValue[2]]
    return [value, undefined]
  }

  if (matchedValue) return parseFloat(value)
  return value as any
}

export default stripUnit
