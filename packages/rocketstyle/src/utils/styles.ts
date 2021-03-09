/* eslint-disable import/prefer-default-export */
import type { OptionStyles, Css } from '~/types'
// --------------------------------------------------------
// calculate styles
// --------------------------------------------------------
type CalculateStyles = <S extends OptionStyles, C extends Css>(
  styles: S,
  css: C
) => Array<ReturnType<OptionStyles[number]>>
// @ts-ignore
export const calculateStyles: CalculateStyles = (styles, css) => {
  if (!styles) return null

  return styles.map((item) => item(css))
}
