import { omit, pick, set, get, throttle, merge } from 'lodash'
import memoize from 'moize'
import config, { init } from '~/config'
import Provider, { context } from '~/context'
import compose from '~/compose'
import isEmpty, { IsEmpty } from '~/isEmpty'
import renderContent, { RenderContent } from '~/renderContent'
import htmlTags, { HTMLTags } from '~/htmlTags'

export type { IsEmpty, RenderContent, HTMLTags }

export {
  Provider,
  context,
  init,
  config,
  compose,
  isEmpty,
  renderContent,
  omit,
  pick,
  set,
  get,
  throttle,
  merge,
  memoize,
  htmlTags,
}
