/* eslint-disable import/prefer-default-export */
import type { OptionStyles, Css } from '~/types'

// --------------------------------------------------------
// calculate styles
// --------------------------------------------------------
type CalculateStyles = <S extends OptionStyles, C extends Css>(
  styles: S,
  css: C
) => Array<ReturnType<OptionStyles[number]>>

export const calculateStyles: CalculateStyles = (styles, css) => {
  if (!styles) return []

  return styles.map((item) => item(css))
}
