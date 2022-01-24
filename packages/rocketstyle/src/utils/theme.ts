
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { config, isEmpty, merge } from '@vitus-labs/core'
import { removeAllEmptyValues, removeNullableValues } from './collection'
import { isMultiKey } from './dimensions'
import { ThemeMode } from '~/types/theme'

// --------------------------------------------------------
// theme mode callback
// --------------------------------------------------------
export const themeModeCb: ThemeMode = (...params) => (mode) => {
  if (!mode || mode === 'light') return params[0]
  return params[1]
}

// --------------------------------------------------------
// calculate dimension themes
// --------------------------------------------------------
type CalculateDimensionThemes = (
  theme: Record<string, any>,
  options: Record<string, any>,
  cb: any
) => Record<string, any>

export const calculateDimensionThemes: CalculateDimensionThemes = (
  theme,
  options,
  cb
) => {
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

  return options.reduce((acc, item) => {
    return merge(acc, item(...args))
  }, result)

  // using this does not allow overriding themes properly
  // return removeAllEmptyValues(helper)
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
export type CalculateTheme = <
  P extends Record<string, unknown>,
  T extends Record<string, unknown>,
  B extends Record<string, unknown>
>({
  rocketstate,
  themes,
  baseTheme,
}: {
  rocketstate: P
  themes: T
  baseTheme: B
}) => B & Record<string, unknown>

export const calculateTheme: CalculateTheme = ({
  rocketstate,
  themes,
  baseTheme,
}) => {
  // generate final theme which will be passed to styled component
  let finalTheme = { ...baseTheme }

  Object.entries(rocketstate).forEach(
    ([key, value]: [string, string | Array<string>]) => {
      const keyTheme = themes[key]

      if (Array.isArray(value)) {
        value.forEach((item) => {
          finalTheme = merge({}, finalTheme, keyTheme[item])
        })
      } else {
        finalTheme = merge({}, finalTheme, keyTheme[value])
      }
    }
  )

  return finalTheme
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
export type CalculateThemeMode = (
  themes: Record<string, any>,
  variant: 'light' | 'dark'
) => Partial<{
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}>

export const calculateThemeMode: CalculateThemeMode = (themes, variant) => {
  const callback = themeModeCb().toString()
  const isModeCallback = (value) => value.toString() === callback

  const result = {}
  Object.entries(themes).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      result[key] = calculateThemeMode(value, variant)
    } else if (typeof value === 'function' && isModeCallback(value)) {
      result[key] = value(variant)
    } else {
      result[key] = value
    }
  })

  return result
}
