import type { TProvider } from '~/context'
import Provider, { context } from '~/context'
import type {
  Breakpoints,
  CreateMediaQueries,
  MakeItResponsive,
  MakeItResponsiveStyles,
  NormalizeTheme,
  SortBreakpoints,
  TransformTheme,
} from '~/responsive'

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
} from '~/responsive'
import type {
  AlignContent,
  AlignContentAlignXKeys,
  AlignContentAlignYKeys,
  AlignContentDirectionKeys,
  ExtendCss,
  Styles,
  StylesTheme,
} from '~/styles'

// --------------------------------------------------------
// STYLES
// --------------------------------------------------------
import {
  ALIGN_CONTENT_DIRECTION,
  ALIGN_CONTENT_MAP_X,
  ALIGN_CONTENT_MAP_Y,
  alignContent,
  extendCss,
  styles,
} from '~/styles'
import type {
  BrowserColors,
  Color,
  Defaults,
  PropertyValue,
  UnitValue,
} from '~/types'
import type { StripUnit, Value, Values } from '~/units'
// --------------------------------------------------------
// UNITS UTILITIES
// --------------------------------------------------------
import { stripUnit, value, values } from '~/units'

export type {
  TProvider,
  Breakpoints,
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
  Value,
  Values,
  BrowserColors,
  Color,
  PropertyValue,
  UnitValue,
  Defaults,
}

export {
  breakpoints,
  Provider,
  context,
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
  value,
  values,
}
