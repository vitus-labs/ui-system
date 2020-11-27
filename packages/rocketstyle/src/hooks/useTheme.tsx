import { config, set } from '@vitus-labs/core'
import { calculateChainOptions } from '../utils'
import type { Configuration, __ROCKETSTYLE__ } from '~/types'

const isMultiKey = (value) => {
  if (Array.isArray(value)) return [true, value[0]]
  return [false, value]
}

const calculateDimensionsMap = (theme, useBooleans) =>
  Object.entries(theme).reduce(
    (accumulator, [key, value]) => {
      const { keysMap, keywords } = accumulator
      keywords.push(key)

      Object.keys(value).forEach((item) => {
        if (useBooleans) {
          keywords.push(item)
        }

        set(keysMap, [key, item], true)
      })

      return accumulator
    },
    { keysMap: {}, keywords: [] }
  )

const calculateDimensionThemes = (theme, options) =>
  Object.entries(options.dimensions).reduce((accumulator, [key, value]) => {
    const [, dimension] = isMultiKey(value)

    // eslint-disable-next-line no-param-reassign
    accumulator[dimension] = calculateChainOptions(
      options[key],
      theme,
      config.css
    )

    return accumulator
  }, {})

type UseTheme = <T extends Record<string, unknown>>({
  theme,
  options,
}: {
  theme: T
  options: Configuration
}) => __ROCKETSTYLE__

const useTheme: UseTheme = ({ theme, options }) => {
  const themes = calculateDimensionThemes(theme, options)
  const { keysMap, keywords } = calculateDimensionsMap(
    themes,
    options.useBooleans
  )

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
