/* eslint-disable no-param-reassign */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { config, isEmpty, merge } from '@vitus-labs/core'
import type { ThemeModeCallback } from '~/types/theme'
import { removeNullableValues } from './collection'
import { isMultiKey } from './dimensions'

// --------------------------------------------------------
// Theme Mode Callback
// --------------------------------------------------------
export const themeModeCallback: ThemeModeCallback = (light, dark) => (mode) => {
  if (!mode || mode === 'light') return light
  return dark
}

// --------------------------------------------------------
// Theme Mode Callback Check
// --------------------------------------------------------
type IsModeCallback = (value: any) => boolean
const isModeCallback: IsModeCallback = (value: any) =>
  typeof value === 'function' &&
  //@ts-ignore
  value.toString() === themeModeCallback().toString()

// --------------------------------------------------------
// Get Theme From Chain
// --------------------------------------------------------
type OptionFunc = (...arg: any) => Record<string, unknown>
type GetThemeFromChain = (
  options: OptionFunc[] | undefined | null,
  theme: Record<string, any>,
) => ReturnType<OptionFunc>

export const getThemeFromChain: GetThemeFromChain = (options, theme) => {
  const result = {}
  if (!options || isEmpty(options)) return result

  return options.reduce(
    (acc, item) => merge(acc, item(theme, themeModeCallback, config.css)),
    result,
  )
}

// --------------------------------------------------------
// calculate dimension themes
// --------------------------------------------------------
type GetDimensionThemes = (
  theme: Record<string, any>,
  options: Record<string, any>,
) => Record<string, any>

export const getDimensionThemes: GetDimensionThemes = (theme, options) => {
  const result = {}

  if (isEmpty(options.dimensions)) return result

  return Object.entries(options.dimensions).reduce(
    (acc, [key, value]) => {
      const [, dimension] = isMultiKey(value as any)

      const helper = options[key]

      if (Array.isArray(helper) && helper.length > 0) {
        const finalDimensionThemes = getThemeFromChain(helper, theme)

        // eslint-disable-next-line no-param-reassign
        acc[dimension] = removeNullableValues(finalDimensionThemes)
      }

      return acc
    },
    result as Record<string, any>,
  )
}

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
type CalculateChainOptions = (
  options: Array<OptionFunc> | undefined | null,
  args: any[],
) => Record<string, any>

export const calculateChainOptions: CalculateChainOptions = (options, args) => {
  const result = {}
  if (!options || isEmpty(options)) return result

  return options.reduce((acc, item) => merge(acc, item(...args)), result)
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
export type GetTheme = (params: {
  rocketstate: Record<string, string | string[]>
  themes: Record<string, Record<string, any>>
  baseTheme: Record<string, any>
}) => Record<string, unknown>

export const getTheme: GetTheme = ({ rocketstate, themes, baseTheme }) => {
  // generate final theme which will be passed to styled component
  let finalTheme = { ...baseTheme }

  Object.entries(rocketstate).forEach(
    ([key, value]: [string, string | Array<string>]) => {
      const keyTheme: Record<string, any> = themes[key]!

      if (Array.isArray(value)) {
        value.forEach((item) => {
          finalTheme = merge({}, finalTheme, keyTheme[item])
        })
      } else {
        finalTheme = merge({}, finalTheme, keyTheme[value])
      }
    },
  )

  return finalTheme
}

// --------------------------------------------------------
// generate theme
// --------------------------------------------------------
export type GetThemeByMode = (
  object: Record<string, any>,
  mode: 'light' | 'dark',
) => Partial<{
  baseTheme: Record<string, unknown>
  themes: Record<string, unknown>
}>

export const getThemeByMode: GetThemeByMode = (object, mode) =>
  Object.keys(object).reduce(
    (acc, key) => {
      const value = object[key]

      if (typeof value === 'object' && value !== null) {
        acc[key] = getThemeByMode(value, mode)
      } else if (isModeCallback(value)) {
        acc[key] = value(mode)
      } else {
        acc[key] = value
      }

      return acc
    },
    {} as Record<string, any>,
  )
