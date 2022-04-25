import { omit, pick, set, get, throttle, merge } from 'lodash'
import memoize from 'moize'
import config, { init } from '~/config'
import Provider, { context } from '~/context'
import compose from '~/compose'
import isEmpty, { IsEmpty } from '~/isEmpty'
import render, { Render } from '~/render'
import {
  htmlTags,
  HTMLTags,
  HTMLTagsText,
  HTMLElementAttrs,
  HTMLTagAttrsByTag,
} from '~/html'

export type {
  IsEmpty,
  Render,
  HTMLTags,
  HTMLTagsText,
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
  htmlTags,
}
