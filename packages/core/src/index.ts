import { omit, pick, set, get, throttle, merge } from 'lodash-es'
import memoize from 'moize'
import config, { init } from '~/config'
import Provider, { context } from '~/context'
import compose from '~/compose'
import isEmpty, { IsEmpty } from '~/isEmpty'
import render, { Render } from '~/render'
import {
  HTML_TAGS,
  HTML_TEXT_TAGS,
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
  memoize,
  HTML_TAGS,
  HTML_TEXT_TAGS,
}
