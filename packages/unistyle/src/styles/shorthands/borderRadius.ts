import { normalizeUnit } from '~/units'
import { Value } from '~/types'

const isValidValue = (value) => !!value || value === 0

export type BorderRadius = (
  rootSize?: number
) => (props: {
  full: Value | null | undefined
  top: Value | null | undefined
  bottom: Value | null | undefined
  left: Value | null | undefined
  right: Value | null | undefined
  topLeft: Value | null | undefined
  topRight: Value | null | undefined
  bottomLeft: Value | null | undefined
  bottomRight: Value | null | undefined
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

    const value = (param) => normalizeUnit({ param, rootSize })

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
        return `border-radius: ${value(tl)};`
      }

      if (tl === br && tr === bl) {
        return `border-radius: ${value(tl)} ${value(tr)};`
      }

      if (tl && tr === bl && br) {
        return `border-radius: ${value(tl)} ${value(tr)} ${value(br)};`
      }

      return `border-radius: ${value(tl)} ${value(tr)} ${value(br)} ${value(
        bl
      )};`
    }

    let output = ''

    if (isValidValue(tl)) {
      output += `border-top-left-radius: ${value(tl)};`
    }

    if (isValidValue(tr)) {
      output += `border-top-right-radius: ${value(tr)};`
    }

    if (isValidValue(br)) {
      output += `border-bottom-right-radius: ${value(br)};`
    }

    if (isValidValue(bl)) {
      output += `border-bottom-left-radius: ${value(bl)};`
    }

    return output
  }

export default borderRadius
