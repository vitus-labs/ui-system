// @ts-nocheck
import { useContext, useState, useEffect } from 'react'
import { config } from '@vitus-labs/core'
import { calculateChainOptions } from './utils'

const namespace = '__ROCKETSTYLE__'

// --------------------------------------------------------
// class constructor helpers
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
  const __ROCKETSTYLE__ = {
    keys: {},
    themes: {},
  }

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

  __ROCKETSTYLE__.KEYWORDS = [
    ...__ROCKETSTYLE__.keys.states,
    ...__ROCKETSTYLE__.keys.sizes,
    ...__ROCKETSTYLE__.keys.variants,
    ...__ROCKETSTYLE__.keys.multiple,
    ...options.dimensionValues,
  ]

  useEffect(() => {
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

    __ROCKETSTYLE__.KEYWORDS = [
      ...__ROCKETSTYLE__.keys.states,
      ...__ROCKETSTYLE__.keys.sizes,
      ...__ROCKETSTYLE__.keys.variants,
      ...__ROCKETSTYLE__.keys.multiple,
      ...options.dimensionValues,
    ]

    if (onMount) {
      onMount(__ROCKETSTYLE__)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return { __ROCKETSTYLE__, theme }
}

export default useTheme
