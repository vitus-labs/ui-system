import { omit, pick, set, get, throttle, merge } from '~/utils'
import config, { init } from '~/config'
import Provider, { context } from '~/context'
import compose from '~/compose'
import isEmpty from '~/isEmpty'
import render from '~/render'
import { HTML_TAGS, HTML_TEXT_TAGS } from '~/html'
import type { IsEmpty } from '~/isEmpty'
import type { Render } from '~/render'
import type {
  HTMLTags,
  HTMLTextTags,
  HTMLElementAttrs,
  HTMLTagAttrsByTag,
} from '~/html'
import type { Breakpoints, BreakpointKeys } from '~/types'

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
  isEmpty,
  render,
  omit,
  pick,
  set,
  get,
  throttle,
  merge,
  HTML_TAGS,
  HTML_TEXT_TAGS,
}
