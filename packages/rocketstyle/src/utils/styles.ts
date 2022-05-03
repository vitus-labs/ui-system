/* eslint-disable import/prefer-default-export */
import { config } from '@vitus-labs/core'
import type { StylesCbArray } from '~/types/styles'

// --------------------------------------------------------
// calculate styles
// --------------------------------------------------------
type CalculateStyles = (
  styles: StylesCbArray | undefined
) => Array<ReturnType<StylesCbArray[number]>>

export const calculateStyles: CalculateStyles = (styles) => {
  if (!styles) return []

  return styles.map((item) => item(config.css))
}
