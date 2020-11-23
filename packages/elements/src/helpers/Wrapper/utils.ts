/* eslint-disable import/prefer-default-export */
import { INLINE_ELEMENTS_FLEX_FIX } from './constants'

export const isWebFixNeeded = (tag) => INLINE_ELEMENTS_FLEX_FIX[tag]
