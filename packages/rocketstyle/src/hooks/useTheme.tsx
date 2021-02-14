import moize from 'moize'
import { config, set, get, isEmpty } from '@vitus-labs/core'
import { calculateChainOptions } from '../utils'
import type { Configuration, __ROCKETSTYLE__ } from '~/types'

const isMultiKey = moize(
  (value) => {
    console.log('isMultikey')
    if (typeof value === 'object') return [true, get(value, 'propName')]
    return [false, value]
  },
  { maxSize: 10, maxArgs: 1 }
)

const isValidKey = (value) =>
  value !== undefined && value !== null && value !== false

const calculateDimensionsMap = moize(
  ({ theme, useBooleans }) => {
    console.log('calculateDimensionsMap')
    return Object.entries(theme).reduce(
      (accumulator, [key, value]) => {
        const { keysMap, keywords } = accumulator
        keywords[key] = true

        Object.entries(value).forEach(([itemKey, itemValue]) => {
          if (!isValidKey(itemValue)) return

          if (useBooleans) {
            keywords[itemKey] = true
          }

          set(keysMap, [key, itemKey], true)
        })

        return accumulator
      },
      { keysMap: {}, keywords: {} }
    )
  },
  { maxSize: 100, isSerialized: true }
)

const calculateDimensionThemes = (theme, options) => {
  console.log('calculateDimensionThemes')

  if (isEmpty(options.dimensions)) return {}

  return Object.entries(options.dimensions).reduce(
    (accumulator, [key, value]) => {
      const [, dimension] = isMultiKey(value)

      const helper = options[key]

      if (Array.isArray(helper) && helper.length > 0) {
        // eslint-disable-next-line no-param-reassign
        accumulator[dimension] = calculateChainOptions(helper, [
          theme,
          config.css,
        ])
      }

      return accumulator
    },
    {}
  )
}

type UseTheme = <T extends Record<string, unknown>>({
  theme,
  options,
}: {
  theme: T
  options: Configuration
}) => __ROCKETSTYLE__

const useTheme: UseTheme = ({ theme, options }) => {
  const themes = calculateDimensionThemes(theme, options)
  const { keysMap, keywords } = calculateDimensionsMap({
    themes,
    useBooleans: options.useBooleans,
  })

  // define empty objects so they can be reassigned later
  // eslint-disable-next-line no-underscore-dangle
  const __ROCKETSTYLE__ = {
    dimensions: keysMap,
    reservedPropNames: keywords,
    baseTheme: calculateChainOptions(options.theme, [theme, config.css]),
    themes,
  }

  return __ROCKETSTYLE__
}

export default useTheme
