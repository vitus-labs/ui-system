import { config, isEmpty, merge } from '@vitus-labs/core'
import type { OptionStyles } from '~/types'

// --------------------------------------------------------
// pick styled props
// --------------------------------------------------------
type PickStyledProps = (
  props: Record<string, unknown>,
  keywords: Record<string, true>
) => Partial<typeof props>
export const pickStyledProps: PickStyledProps = (props, keywords) => {
  const result = {}

  Object.entries(props).forEach(([key, value]) => {
    if (keywords[key]) result[key] = value
  })

  return result
}

// --------------------------------------------------------
// chain options
// --------------------------------------------------------
export const chainOptions = (opts, defaultOpts = []) => {
  const result = [...defaultOpts]

  if (typeof opts === 'function') result.push(opts)
  else if (typeof opts === 'object') result.push(() => opts)

  return result
}

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
type OptionFunc<A> = (...arg: Array<A>) => Record<string, unknown>
type CalculateChainOptions = <A>(
  options: Array<OptionFunc<A>> | undefined | null,
  args: Array<A>,
  deepMerge?: boolean
) => ReturnType<OptionFunc<A>>

export const calculateChainOptions: CalculateChainOptions = (
  options,
  args,
  deepMerge = true
) => {
  const result = {}
  if (isEmpty(options)) return result

  const chain = deepMerge ? merge : (obj1, obj2) => Object.assign(obj1, obj2)

  return options.reduce((acc, item) => chain(acc, item(...args)), result)
}

// --------------------------------------------------------
// calculate styles
// --------------------------------------------------------
type CalculateStyles = <S extends OptionStyles, C extends typeof config.css>(
  styles: S,
  css: C
) => Array<ReturnType<OptionStyles[number]>>
export const calculateStyles: CalculateStyles = (styles, css) => {
  if (!styles) return null

  return styles.map((item) => item(css))
}

// --------------------------------------------------------
// is in dimensions
// --------------------------------------------------------
type IsInDimensions = <K extends string, D extends Record<string, unknown>>(
  key: K,
  dimensions: D
) => boolean
export const isInDimensions: IsInDimensions = (key, dimensions) => {
  const hasKey = () => {
    Object.values(dimensions).some((value) => value[key])
  }

  if (dimensions[key] || hasKey()) return true
  return false
}

// --------------------------------------------------------
// split props
// --------------------------------------------------------
type Props = Record<string, unknown>
type Result = { styleProps: Props; otherProps: Props }
type SplitProps = <
  P extends Record<string, unknown>,
  D extends Record<string, unknown>
>(
  props: P,
  dimensions: D
) => Result
export const splitProps: SplitProps = (props, dimensions) => {
  const styleProps = {}
  const otherProps = {}

  Object.entries(props).forEach(([key, value]) => {
    if (isInDimensions(key, dimensions)) styleProps[key] = value
    else otherProps[key] = value
  })

  return { styleProps, otherProps }
}

// --------------------------------------------------------
// get style attributes
// --------------------------------------------------------
export const calculateStyledAttrs = ({
  props,
  dimensions,
  useBooleans,
  multiKeys,
}) => {
  const result = {}

  // (1) find dimension keys values & initialize
  // object with possible options
  Object.keys(dimensions).forEach((item) => {
    const pickedProp = props[item]
    const valueTypes = ['number', 'string']

    // if the property is mutli key, allow assign array as well
    if (multiKeys[item] && Array.isArray(pickedProp)) {
      result[item] = pickedProp
    }
    // assign when it's only a string or number otherwise it's considered
    // as invalid param
    else if (valueTypes.includes(typeof pickedProp)) {
      result[item] = pickedProp
    } else {
      result[item] = undefined
    }
  })

  // (2) if booleans are being used let's find the rest
  if (useBooleans) {
    const propsKeys = Object.keys(props).reverse()

    Object.entries(result).forEach(([key, value]) => {
      const isMultiKey = multiKeys[key]

      // when value in result is not assigned yet
      if (!value) {
        let newDimensionValue
        const keywords = Object.keys(dimensions[key])

        if (isMultiKey) {
          newDimensionValue = propsKeys.filter((key) => keywords.includes(key))
        } else {
          // reverse props to guarantee the last one will have
          // a priority over previous ones
          newDimensionValue = propsKeys.find((key) => {
            if (keywords.includes(key) && props[key]) return key
            return false
          })
        }

        result[key] = newDimensionValue
      }
    })
  }

  return result
}
// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
type CalculateTheme = <
  P extends Record<string, unknown>,
  T extends Record<string, unknown>,
  B extends Record<string, unknown>
>({
  props,
  themes,
  baseTheme,
}: {
  props: P
  themes: T
  baseTheme: B
}) => B & Record<string, unknown>

export const calculateTheme: CalculateTheme = ({
  props,
  themes,
  baseTheme,
}) => {
  // generate final theme which will be passed to styled component
  let finalTheme = { ...baseTheme }

  Object.entries(props).forEach(
    ([key, value]: [string, string | Array<string>]) => {
      const keyTheme = themes[key]

      if (Array.isArray(value)) {
        value.forEach((item) => {
          finalTheme = merge(finalTheme, keyTheme[item])
        })
      } else {
        finalTheme = merge(finalTheme, keyTheme[value])
      }
    }
  )

  return finalTheme
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
type CalculateThemeVariant = (
  themes: Record<string, any>,
  variant: 'light' | 'dark',
  cb: any
) => Partial<{
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}>
export const calculateThemeVariant: CalculateThemeVariant = (
  themes,
  variant,
  cb
) => {
  const callback = cb().toString()

  const result = {}
  Object.entries(themes).forEach(([key, value]) => {
    if (typeof value === 'object') {
      result[key] = calculateThemeVariant(value, variant, cb)
    } else if (typeof value === 'function' && value.toString() === callback) {
      result[key] = value(variant)
    } else {
      result[key] = value
    }
  })

  return result
}
