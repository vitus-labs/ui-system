import { config } from '@vitus-labs/core'
import { calculateChainOptions, calculateDimensionThemes } from '~/utils/theme'
import { calculateDimensionsMap } from '~/utils/dimensions'
import type { Configuration, __ROCKETSTYLE__, ThemeVariant } from '~/types'

type UseTheme = <T extends Record<string, unknown>>({
  theme,
  options,
  cb,
}: {
  theme: T
  options: Configuration
  cb: ThemeVariant
}) => __ROCKETSTYLE__

const useTheme: UseTheme = ({ theme, options, cb }) => {
  const themes = calculateDimensionThemes(theme, options, cb)
  const { keysMap, keywords } = calculateDimensionsMap({
    themes,
    useBooleans: options.useBooleans,
  })

  // eslint-disable-next-line no-underscore-dangle
  const __ROCKETSTYLE__ = {
    dimensions: keysMap,
    reservedPropNames: keywords,
    baseTheme: calculateChainOptions(options.theme, [theme, cb, config.css]),
    themes,
  }

  return __ROCKETSTYLE__
}

export default useTheme
