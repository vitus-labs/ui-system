import { EMPTY_ELEMENTS, INLINE_ELEMENTS } from './constants'

const defaultDirection = 'inline'

type GetValue = (tag?: string) => boolean

/** Checks whether the given HTML tag is an inline-level element, used to determine sub-tag nesting. */
export const isInlineElement: GetValue = (tag) => {
  if (tag && tag in INLINE_ELEMENTS) return true
  return false
}

/** Checks whether the given HTML tag is a void element that cannot have children. */
export const getShouldBeEmpty: GetValue = (tag) => {
  if (tag && tag in EMPTY_ELEMENTS) return true
  return false
}

/**
 * Resolves the three axis props the Wrapper renders with.
 *
 * A simple element (no before/after slots) has no inner Content layer, so the
 * Wrapper inherits the content-level axes directly; a compound element keeps
 * its own direction and lets each Content slot own its alignment.
 *
 * Pure and module-scope so Element's body can call it per render instead of
 * memoizing: every output is a primitive consumed directly as a Wrapper prop,
 * so nothing downstream depends on the returned object's identity. The
 * previous `useMemo` allocated a 7-element dependency array and ran 7
 * comparisons per render to avoid three branches — strictly more work.
 */
export const resolveWrapperAxes = <D, X, Y>(
  isSimpleElement: boolean,
  direction: D,
  alignX: X,
  alignY: Y,
  contentDirection: D,
  contentAlignX: X,
  contentAlignY: Y,
): { wrapperDirection: D; wrapperAlignX: X; wrapperAlignY: Y } => {
  if (isSimpleElement) {
    return {
      wrapperDirection: contentDirection || direction,
      wrapperAlignX: contentAlignX || alignX,
      wrapperAlignY: contentAlignY || alignY,
    }
  }

  return {
    wrapperDirection: direction || (defaultDirection as D),
    wrapperAlignX: alignX,
    wrapperAlignY: alignY,
  }
}
