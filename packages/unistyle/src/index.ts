import alignContent from './alignContent'
import breakpoints from './breakpoints'
import { Provider } from './context'
import extendedCss from './extendedCss'
import {
  makeItResponsive,
  sortBreakpoints,
  createMediaQueries,
  transformTheme,
} from './mediaQueries'
import optimizeTheme, {
  pickThemeProps,
  normalizeTheme,
  groupByBreakpoint,
} from './optimizeTheme'
import styles, { stripUnit, normalizeUnit, value, getValueOf } from './styles'

// types
import type {
  AlignContentAlignX,
  AlignContentAlignY,
  AlignContentDirection,
} from './alignContent'
import type { Breakpoints } from './breakpoints'
import type { ExtendedCss } from './extendedCss'
import type {
  SortBreakpoints,
  CreateMediaQueries,
  TransformTheme,
  MakeItResponsive,
} from './mediaQueries'
import type { PickThemeProps } from './optimizeTheme'

export type {
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
  extendedCss,
  makeItResponsive,
  sortBreakpoints,
  createMediaQueries,
  transformTheme,
  optimizeTheme,
  pickThemeProps,
  normalizeTheme,
  groupByBreakpoint,
  styles,
  stripUnit,
  normalizeUnit,
  value,
  getValueOf,
}
