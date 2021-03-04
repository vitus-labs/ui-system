import { config, isEmpty, merge } from '@vitus-labs/core'
import { removeAllEmptyValues, removeNullableValues } from './collection'
import { isMultiKey } from './dimensions'

// --------------------------------------------------------
// theme mode callback
// --------------------------------------------------------
export const themeModeCb = (...params) => (mode) => {
  if (!mode || mode === 'light') return params[0]
  return params[1]
}

// --------------------------------------------------------
// calculate dimension themes
// --------------------------------------------------------
export const calculateDimensionThemes = (theme, options, cb) => {
  const result = {}

  if (isEmpty(options.dimensions)) return result

  return Object.entries(options.dimensions).reduce(
    (accumulator, [key, value]) => {
      const [, dimension] = isMultiKey(value)

      const helper = options[key]

      if (Array.isArray(helper) && helper.length > 0) {
        const finalDimensionThemes = calculateChainOptions(helper, [
          theme,
          cb,
          config.css,
        ])

        // eslint-disable-next-line no-param-reassign
        accumulator[dimension] = removeNullableValues(finalDimensionThemes)
      }

      return accumulator
    },
    result
  )
}

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
type OptionFunc<A> = (...arg: Array<A>) => Record<string, unknown>
type CalculateChainOptions = <A>(
  options: Array<OptionFunc<A>> | undefined | null,
  args: Array<A>
) => ReturnType<OptionFunc<A>>

export const calculateChainOptions: CalculateChainOptions = (options, args) => {
  const result = {}
  if (isEmpty(options)) return result

  const helper = options.reduce(
    (acc, item) => merge(acc, item(...args)),
    result
  )

  return removeAllEmptyValues(helper)
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
  variant: 'light' | 'dark'
) => Partial<{
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}>
export const calculateThemeVariant: CalculateThemeVariant = (
  themes,
  variant
) => {
  const callback = themeModeCb().toString()

  const result = {}
  Object.entries(themes).forEach(([key, value]) => {
    if (typeof value === 'object') {
      result[key] = calculateThemeVariant(value, variant)
    } else if (typeof value === 'function' && value.toString() === callback) {
      result[key] = value(variant)
    } else {
      result[key] = value
    }
  })

  return result
}