/* eslint-disable import/prefer-default-export */
import type { StylesCbArray, Css } from '~/types/styles'

// --------------------------------------------------------
// calculate styles
// --------------------------------------------------------
type CalculateStyles = <S extends StylesCbArray | undefined, C extends Css>(
  styles: S,
  css: C
) => Array<ReturnType<StylesCbArray[number]>>

export const calculateStyles: CalculateStyles = (styles, css) => {
  if (!styles) return []

  return styles.map((item) => item(css))
}
