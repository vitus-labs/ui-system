import { omit, pick, set, get, throttle, difference, merge } from 'lodash'
import memoize from 'moize'
import config from './config'
import compose from './compose'
import isEmpty, { IsEmpty } from './isEmpty'
import renderContent, { RenderContent } from './renderContent'
import Provider from './context'
import htmlTags, { HTMLTags } from '~/htmlTags'

const { context } = config

export type { IsEmpty, RenderContent, HTMLTags }

export {
  config,
  context,
  Provider,
  compose,
  isEmpty,
  renderContent,
  difference,
  omit,
  pick,
  set,
  get,
  throttle,
  merge,
  memoize,
  htmlTags,
}
