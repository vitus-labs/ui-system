import { omit, pick, set, get, throttle } from 'lodash'
import vitusContext from './context'
import compose from './compose'
import renderContent from './renderContent'
import alignContent from './flex'
import extendedCss from './extendedCss'
import optimizeTheme, { pickThemeProps } from './optimizeTheme'
import baseStyles, { stripUnit, value } from './styles'
import makeItResponsive, {
  sortBreakpoints,
  createMediaQueries,
  transformTheme
} from './utils'
import CONFIG from './config'

export {
  CONFIG,
  compose,
  extendedCss,
  vitusContext,
  renderContent,
  optimizeTheme,
  pickThemeProps,
  alignContent,
  stripUnit,
  value,
  baseStyles,
  sortBreakpoints,
  createMediaQueries,
  transformTheme,
  makeItResponsive,
  omit,
  pick,
  set,
  get,
  throttle
}
