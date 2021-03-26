/* eslint-disable import/prefer-default-export */
import { INLINE_ELEMENTS_FLEX_FIX } from './constants'

type IsWebFixNeeded = (tag: string) => boolean
export const isWebFixNeeded: IsWebFixNeeded = (tag) =>
  INLINE_ELEMENTS_FLEX_FIX[tag]
