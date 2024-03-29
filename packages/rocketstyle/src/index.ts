import rocketstyle from '~/init'
import type { Rocketstyle } from '~/init'
import Provider, { context } from '~/context/context'
import type { TProvider } from '~/context/context'
import isRocketComponent from '~/isRocketComponent'
import type { IsRocketComponent } from '~/isRocketComponent'

import type {
  ConfigAttrs,
  RocketComponentType,
  RocketProviderState,
  ConsumerCtxCBValue,
  ConsumerCtxCb,
  ConsumerCb,
} from '~/types/config'
import type { TObj, ElementType, MergeTypes, ExtractProps } from '~/types/utils'
import type {
  Dimensions,
  DimensionValue,
  DimensionCallbackParam,
  ExtractDimensionProps,
  TDKP,
  DimensionProps,
  ExtractDimensions,
} from '~/types/dimensions'
import type { StylesCb, StylesDefault } from '~/types/styles'
import type { AttrsCb } from '~/types/attrs'
import type {
  ThemeModeCallback,
  ThemeCb,
  ThemeModeKeys,
  ThemeDefault,
  ThemeMode,
} from '~/types/theme'
import type { GenericHoc, ComposeParam } from '~/types/hoc'
import type { DefaultProps } from '~/types/configuration'
import type {
  RocketStyleComponent,
  IRocketStyleComponent,
} from '~/types/rocketstyle'

export type {
  StylesDefault,
  ThemeDefault,
  RocketStyleComponent,
  IRocketStyleComponent,
  Rocketstyle,
  TProvider,
  RocketComponentType,
  RocketProviderState,
  ConsumerCtxCBValue,
  ConsumerCtxCb,
  ConsumerCb,
  TObj,
  ElementType,
  MergeTypes,
  ExtractProps,
  Dimensions,
  DimensionValue,
  DimensionCallbackParam,
  ExtractDimensionProps,
  TDKP,
  DimensionProps,
  ExtractDimensions,
  StylesCb,
  ConfigAttrs,
  AttrsCb,
  ThemeCb,
  ThemeModeCallback,
  ThemeModeKeys,
  GenericHoc,
  ComposeParam,
  DefaultProps,
  IsRocketComponent,
  ThemeMode,
}

export { rocketstyle, context, Provider, isRocketComponent }
export default rocketstyle
