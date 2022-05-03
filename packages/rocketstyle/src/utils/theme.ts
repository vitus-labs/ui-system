// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { config, isEmpty, merge } from '@vitus-labs/core'
import { ThemeModeCallback } from '~/types/theme'
import { removeNullableValues } from './collection'
import { isMultiKey } from './dimensions'

// --------------------------------------------------------
// theme mode callback
// --------------------------------------------------------
export const themeModeCallback: ThemeModeCallback = (light, dark) => (mode) => {
  if (!mode || mode === 'light') return light
  return dark
}

themeModeCallback.isMode = true

const isModeCallback = (value) => typeof value === 'function' && value.isMode

// --------------------------------------------------------
// getThemeFromChain
// --------------------------------------------------------
type OptionFunc<A> = (...arg: Array<A>) => Record<string, unknown>
type GetThemeFromChain = <A>(
  options: Array<OptionFunc<A>> | undefined | null,
  theme: Record<string, any>
) => ReturnType<OptionFunc<A>>

export const getThemeFromChain: GetThemeFromChain = (options, theme) => {
  const result = {}
  if (!options || isEmpty(options)) return result

  return options.reduce(
    (acc, item) => merge(acc, item(theme, themeModeCallback, config.css)),
    result
  )
}

// --------------------------------------------------------
// calculate dimension themes
// --------------------------------------------------------
type GetDimensionThemes = (
  theme: Record<string, any>,
  options: Record<string, any>
) => Record<string, any>

export const getDimensionThemes: GetDimensionThemes = (theme, options) => {
  const result = {}

  if (isEmpty(options.dimensions)) return result

  return Object.entries(options.dimensions).reduce(
    (accumulator, [key, value]) => {
      const [, dimension] = isMultiKey(value)

      const helper = options[key]

      if (Array.isArray(helper) && helper.length > 0) {
        const finalDimensionThemes = getThemeFromChain(helper, theme)

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
type CalculateChainOptions = <A>(
  options: Array<OptionFunc<A>> | undefined | null,
  args: Array<A>
) => ReturnType<OptionFunc<A>>

export const calculateChainOptions: CalculateChainOptions = (options, args) => {
  const result = {}
  if (isEmpty(options)) return result

  return options.reduce((acc, item) => merge(acc, item(...args)), result)
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
export type GetTheme = <
  P extends Record<string, string | string[]>,
  T extends Record<string, any>,
  B extends Record<string, any>
>({
  rocketstate,
  themes,
  baseTheme,
}: {
  rocketstate: P
  themes: T
  baseTheme: B
}) => B & Record<string, unknown>

export const getTheme: GetTheme = ({ rocketstate, themes, baseTheme }) => {
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
export type GetThemeMode = (
  themes: Record<string, any>,
  mode: 'light' | 'dark'
) => Partial<{
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}>

export const getThemeMode: GetThemeMode = (themes, mode) =>
  Object.keys(themes).reduce((acc, key) => {
    const value = themes[key]

    if (typeof value === 'object' && value !== null) {
      // eslint-disable-next-line no-param-reassign
      acc[key] = getThemeMode(value, mode)
    } else if (isModeCallback(value)) {
      // eslint-disable-next-line no-param-reassign
      acc[key] = value(mode)
    } else {
      // eslint-disable-next-line no-param-reassign
      acc[key] = value
    }

    return acc
  }, {})
