import Provider, { context, TProvider } from './context'

// --------------------------------------------------------
// REACT HOOKS
// --------------------------------------------------------
import { useWindowSize, UseWindowSize } from '~/hooks'

// --------------------------------------------------------
// RESPONSIVE UTILITIES
// --------------------------------------------------------
import {
  breakpoints,
  createMediaQueries,
  makeItResponsive,
  normalizeTheme,
  sortBreakpoints,
  transformTheme,
  Breakpoints,
  CreateMediaQueries,
  MakeItResponsive,
  MakeItResponsiveStyles,
  NormalizeTheme,
  SortBreakpoints,
  TransformTheme,
} from '~/responsive'

// --------------------------------------------------------
// STYLES
// --------------------------------------------------------
import {
  styles,
  alignContent,
  ALIGN_CONTENT_DIRECTION,
  ALIGN_CONTENT_MAP_X,
  ALIGN_CONTENT_MAP_Y,
  extendCss,
  Styles,
  StylesTheme,
  AlignContent,
  AlignContentAlignXKeys,
  AlignContentAlignYKeys,
  AlignContentDirectionKeys,
  ExtendCss,
} from './styles'

// --------------------------------------------------------
// UNITS UTILITIES
// --------------------------------------------------------
import {
  stripUnit,
  normalizeUnit,
  value,
  StripUnit,
  NormalizeUnit,
  Value,
} from '~/units'

export type {
  TProvider,
  Breakpoints,
  UseWindowSize,
  CreateMediaQueries,
  MakeItResponsive,
  MakeItResponsiveStyles,
  NormalizeTheme,
  SortBreakpoints,
  TransformTheme,
  Styles,
  StylesTheme,
  AlignContent,
  AlignContentAlignXKeys,
  AlignContentAlignYKeys,
  AlignContentDirectionKeys,
  ExtendCss,
  StripUnit,
  NormalizeUnit,
  Value,
}

export {
  breakpoints,
  Provider,
  context,
  useWindowSize,
  makeItResponsive,
  sortBreakpoints,
  createMediaQueries,
  transformTheme,
  normalizeTheme,
  styles,
  alignContent,
  ALIGN_CONTENT_DIRECTION,
  ALIGN_CONTENT_MAP_X,
  ALIGN_CONTENT_MAP_Y,
  extendCss,
  stripUnit,
  normalizeUnit,
  value,
}
