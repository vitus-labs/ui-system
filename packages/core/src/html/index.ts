/* eslint-disable @typescript-eslint/ban-types */
import htmlTags, { HTMLTags, HTMLTagsText } from './htmlTags'
import type { HTMLElementAttrs } from './htmlElementAttrs'

type HTMLTagAttrsByTag<T extends HTMLTags> = T extends unknown
  ? {}
  : HTMLElementAttrs[T]

export type { HTMLTags, HTMLTagsText, HTMLElementAttrs, HTMLTagAttrsByTag }

export { htmlTags }
