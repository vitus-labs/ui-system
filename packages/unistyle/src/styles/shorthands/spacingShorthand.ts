import { normalizeUnit } from '~/units'
import { Value } from '~/types'

const isValidValue = (value) => !!value || value === 0

export type SpacingShorthand = (
  property: 'padding' | 'margin',
  rootSize?: number
) => (props: {
  top: Value | null | undefined
  left: Value | null | undefined
  right: Value | null | undefined
  bottom: Value | null | undefined
  x: Value | null | undefined
  y: Value | null | undefined
  full: Value | null | undefined
}) => string | null

// eslint-disable-next-line import/prefer-default-export
const spacingShorthand: SpacingShorthand =
  (property, rootSize) =>
  ({ top, left, right, bottom, x, y, full }) => {
    if (
      !isValidValue(top) &&
      !isValidValue(bottom) &&
      !isValidValue(left) &&
      !isValidValue(right) &&
      !isValidValue(x) &&
      !isValidValue(y) &&
      !isValidValue(full)
    ) {
      return null
    }

    const value = (param) => normalizeUnit({ param, rootSize })

    // top - right - bottom - left
    const spacing = [full, full, full, full]

    if (isValidValue(x)) {
      spacing[1] = x
      spacing[3] = x
    }

    if (isValidValue(y)) {
      spacing[0] = y
      spacing[2] = y
    }

    if (isValidValue(top)) {
      spacing[0] = top
    }

    if (isValidValue(right)) {
      spacing[1] = right
    }

    if (isValidValue(bottom)) {
      spacing[2] = bottom
    }

    if (isValidValue(left)) {
      spacing[3] = left
    }

    const [t, r, b, l] = spacing

    if (spacing.every((val, _, arr) => isValidValue(val) && val === arr[0])) {
      return `${property}: ${t};`
    }

    if (t === b && r === l) {
      return `${property}: ${value(t)} ${value(r)};`
    }

    if (t && r === l && b) {
      return `${property}: ${value(t)} ${value(r)} ${value(b)};`
    }

    if (spacing.every((val) => !!val)) {
      return `${property}: ${value(t)} ${value(r)} ${value(b)} ${value(l)};`
    }

    let output = ''

    if (isValidValue(t)) {
      output += `${property}-top: ${value([t])};`
    }

    if (isValidValue(b)) {
      output += `${property}-bottom: ${value([b])};`
    }

    if (isValidValue(l)) {
      output += `${property}-left: ${value([l])};`
    }

    if (isValidValue(r)) {
      output += `${property}-right: ${value([r])};`
    }

    return output
  }

export default spacingShorthand