/* eslint-disable import/prefer-default-export */
import { config } from '@vitus-labs/core'
import type { StylesCbArray } from '~/types/styles'

// --------------------------------------------------------
// Calculate styles
// --------------------------------------------------------
type CalculateStyles = (
  styles: StylesCbArray | undefined,
) => ReturnType<StylesCbArray[number]>[]

export const calculateStyles: CalculateStyles = (styles) => {
  if (!styles) return []

  return styles.map((item) => item(config.css))
}
