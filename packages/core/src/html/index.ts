import { HTML_TAGS, HTML_TEXT_TAGS, HTMLTags, HTMLTextTags } from './htmlTags'
import type { HTMLElementAttrs } from './htmlElementAttrs'

type HTMLTagAttrsByTag<T extends HTMLTags> = T extends HTMLTags
  ? HTMLElementAttrs[T]
  : {}

export type { HTMLTags, HTMLTextTags, HTMLElementAttrs, HTMLTagAttrsByTag }

export { HTML_TAGS, HTML_TEXT_TAGS }
