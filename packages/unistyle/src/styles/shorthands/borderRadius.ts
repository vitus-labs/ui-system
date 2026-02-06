import type { PropertyValue } from '~/types'
import { value } from '~/units'

const isValidValue = (value) => !!value || value === 0

export type BorderRadius = (
  rootSize?: number,
) => (props: {
  full: PropertyValue | null | undefined
  top: PropertyValue | null | undefined
  bottom: PropertyValue | null | undefined
  left: PropertyValue | null | undefined
  right: PropertyValue | null | undefined
  topLeft: PropertyValue | null | undefined
  topRight: PropertyValue | null | undefined
  bottomLeft: PropertyValue | null | undefined
  bottomRight: PropertyValue | null | undefined
}) => string | null

// eslint-disable-next-line import/prefer-default-export
const borderRadius: BorderRadius =
  (rootSize) =>
  ({
    full,
    top,
    bottom,
    left,
    right,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  }) => {
    if (
      !isValidValue(full) &&
      !isValidValue(top) &&
      !isValidValue(bottom) &&
      !isValidValue(left) &&
      !isValidValue(right) &&
      !isValidValue(topLeft) &&
      !isValidValue(topRight) &&
      !isValidValue(bottomLeft) &&
      !isValidValue(bottomRight)
    ) {
      return null
    }

    const calc = (param) => value(param, rootSize)

    // topLeft - topRight - bottomRight - bottomLeft
    const values = [full, full, full, full]

    if (isValidValue(top)) {
      values[0] = top
      values[1] = top
    }

    if (isValidValue(bottom)) {
      values[2] = bottom
      values[3] = bottom
    }

    if (isValidValue(left)) {
      values[0] = left
      values[3] = left
    }

    if (isValidValue(right)) {
      values[1] = right
      values[2] = right
    }

    if (isValidValue(topLeft)) {
      values[0] = topLeft
    }

    if (isValidValue(topRight)) {
      values[1] = topRight
    }

    if (isValidValue(bottomRight)) {
      values[2] = bottomRight
    }

    if (isValidValue(bottomLeft)) {
      values[3] = bottomLeft
    }

    const [tl, tr, br, bl] = values

    if (values.every((val) => isValidValue(val))) {
      if (values.every((val, _, arr) => val === arr[0])) {
        return `border-radius: ${calc(tl)};`
      }

      if (tl === br && tr === bl) {
        return `border-radius: ${calc(tl)} ${calc(tr)};`
      }

      if (tl && tr === bl && br) {
        return `border-radius: ${calc(tl)} ${calc(tr)} ${calc(br)};`
      }

      return `border-radius: ${calc(tl)} ${calc(tr)} ${calc(br)} ${calc(bl)};`
    }

    let output = ''

    if (isValidValue(tl)) {
      output += `border-top-left-radius: ${calc(tl)};`
    }

    if (isValidValue(tr)) {
      output += `border-top-right-radius: ${calc(tr)};`
    }

    if (isValidValue(br)) {
      output += `border-bottom-right-radius: ${calc(br)};`
    }

    if (isValidValue(bl)) {
      output += `border-bottom-left-radius: ${calc(bl)};`
    }

    return output
  }

export default borderRadius
