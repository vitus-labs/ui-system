type Value<V> = V extends string ? number : V
type Unit<V> = V extends string ? string : undefined

export type StripUnit = <V extends string | number, UR extends boolean = false>(
  value: V,
  unitReturn?: UR,
) => UR extends true ? [Value<V>, Unit<V>] : Value<V>

const CSS_UNIT_REGEX = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/

/**
 * Strips the CSS unit suffix from a value.
 * With `unitReturn=true`, returns a `[number, unit]` tuple.
 * Otherwise returns just the numeric part.
 * Non-string inputs are passed through unchanged.
 */
const stripUnit: StripUnit = (value, unitReturn) => {
  if (typeof value !== 'string') return unitReturn ? [value, undefined] : value

  const matchedValue = value.match(CSS_UNIT_REGEX)

  if (unitReturn) {
    if (matchedValue) return [parseFloat(value), matchedValue[2]]
    return [value, undefined]
  }

  if (matchedValue) return parseFloat(value)
  return value as any
}

export default stripUnit
