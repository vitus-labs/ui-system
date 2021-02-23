import alignContent, {
  AlignContentAlignX,
  AlignContentAlignY,
  AlignContentDirection,
} from './alignContent'
import breakpoints, { Breakpoints } from './breakpoints'
import Provider, { context, TProvider } from './context'
import extendedCss, { ExtendedCss } from './extendedCss'
import {
  makeItResponsive,
  sortBreakpoints,
  createMediaQueries,
  transformTheme,
  SortBreakpoints,
  CreateMediaQueries,
  TransformTheme,
  MakeItResponsive,
} from './mediaQueries'
import optimizeTheme, {
  pickThemeProps,
  normalizeTheme,
  groupByBreakpoint,
  PickThemeProps,
} from './optimizeTheme'
import useWindowResize from './useWindowSize'
import styles, { stripUnit, normalizeUnit, value, getValueOf } from './styles'

export type {
  TProvider,
  AlignContentAlignX,
  AlignContentAlignY,
  AlignContentDirection,
  Breakpoints,
  ExtendedCss,
  SortBreakpoints,
  CreateMediaQueries,
  TransformTheme,
  MakeItResponsive,
  PickThemeProps,
}

export {
  alignContent,
  breakpoints,
  Provider,
  context,
  extendedCss,
  makeItResponsive,
  sortBreakpoints,
  createMediaQueries,
  transformTheme,
  optimizeTheme,
  pickThemeProps,
  normalizeTheme,
  groupByBreakpoint,
  useWindowResize,
  styles,
  stripUnit,
  normalizeUnit,
  value,
  getValueOf,
}
