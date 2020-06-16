// @ts-nocheck
import { useContext, useEffect } from 'react'
import { config } from '@vitus-labs/core'
import { calculateChainOptions } from '../utils'

// --------------------------------------------------------
// helpers
// --------------------------------------------------------
const generateKeys = (context, theme, config) => {
  config.dimensionKeys.forEach((item) => {
    context[item] = Object.keys(theme[item])
  })
}

const generateThemes = (context, theme, options) => {
  options.dimensionKeys.forEach((item) => {
    context[item] = calculateChainOptions(options[item], theme, config.css)
  })
}

const useTheme = ({ options, onMount }) => {
  const theme = useContext(config.context)

  // define empty objects so they can be reassigned later
  const __ROCKETSTYLE__: Partial<{keys: object,themes:object,KEYWORDS: any}> = {
    keys: {},
    themes: {},
  }

  const calculate = () => {
    __ROCKETSTYLE__.themes.base = calculateChainOptions(
      options.theme,
      theme,
      config.css
    )

    generateThemes(__ROCKETSTYLE__.themes, theme, options)
    generateKeys(__ROCKETSTYLE__.keys, __ROCKETSTYLE__.themes, options)

    __ROCKETSTYLE__.rocketConfig = {}
    __ROCKETSTYLE__.rocketConfig.dimensions = options.dimensions
    __ROCKETSTYLE__.rocketConfig.useBooleans = options.useBooleans

    __ROCKETSTYLE__.KEYWORDS = []

    options.dimensionKeys.forEach((item) => {
      __ROCKETSTYLE__.KEYWORDS = [
        ...__ROCKETSTYLE__.KEYWORDS,
        ...__ROCKETSTYLE__.keys[item],
      ]
    })

    __ROCKETSTYLE__.KEYWORDS = [
      ...__ROCKETSTYLE__.KEYWORDS,
      ...options.dimensionValues,
    ]
  }

  calculate()

  useEffect(() => {
    calculate()

    if (onMount) {
      onMount(__ROCKETSTYLE__)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return { __ROCKETSTYLE__, theme }
}

export default useTheme
