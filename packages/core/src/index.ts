import compose from '~/compose'
import config, { init } from '~/config'
import Provider, { context } from '~/context'
import hoistNonReactStatics from '~/hoistNonReactStatics'
import type {
  HTMLElementAttrs,
  HTMLTagAttrsByTag,
  HTMLTags,
  HTMLTextTags,
} from '~/html'
import { HTML_TAGS, HTML_TEXT_TAGS } from '~/html'
import type { IsEmpty } from '~/isEmpty'
import isEmpty from '~/isEmpty'
import isEqual from '~/isEqual'
import type { Render } from '~/render'
import render from '~/render'
import type { BreakpointKeys, Breakpoints } from '~/types'
import useStableValue from '~/useStableValue'
import { get, merge, omit, pick, set, throttle } from '~/utils'

export type { CSSEngineConnector } from '~/config'

export type {
  Breakpoints,
  BreakpointKeys,
  IsEmpty,
  Render,
  HTMLTags,
  HTMLTextTags,
  HTMLElementAttrs,
  HTMLTagAttrsByTag,
}

export {
  Provider,
  context,
  init,
  config,
  compose,
  isEqual,
  isEmpty,
  render,
  omit,
  pick,
  set,
  get,
  throttle,
  merge,
  useStableValue,
  HTML_TAGS,
  HTML_TEXT_TAGS,
  hoistNonReactStatics,
}
