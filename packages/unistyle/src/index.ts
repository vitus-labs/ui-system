import Provider, { context } from '~/context'
import type { TProvider } from '~/context'
import type {
  BrowserColors,
  Color,
  PropertyValue,
  UnitValue,
  Defaults,
} from '~/types'

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
} from '~/styles'

import type {
  Styles,
  StylesTheme,
  AlignContent,
  AlignContentAlignXKeys,
  AlignContentAlignYKeys,
  AlignContentDirectionKeys,
  ExtendCss,
} from '~/styles'

// --------------------------------------------------------
// UNITS UTILITIES
// --------------------------------------------------------
import { stripUnit, value, values } from '~/units'
import type { StripUnit, Value, Values } from '~/units'

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
