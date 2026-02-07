import type { PropertyValue } from '~/types'
import { value } from '~/units'

const isValidValue = (value: unknown) => !!value || value === 0

export type SpacingShorthand = (
  property: 'padding' | 'margin',
) => (props: {
  top: PropertyValue | null | undefined
  left: PropertyValue | null | undefined
  right: PropertyValue | null | undefined
  bottom: PropertyValue | null | undefined
  x: PropertyValue | null | undefined
  y: PropertyValue | null | undefined
  full: PropertyValue | null | undefined
}) => string

// eslint-disable-next-line import/prefer-default-export
export const spacingShorthand: SpacingShorthand =
  (property) =>
  ({ top, left, right, bottom, x, y, full }) => {
    // top - right - bottom - left
    const spacing = [full, full, full, full]

    if (isValidValue(x)) {
      spacing[1] = x
      spacing[3] = x
    }

    if (isValidValue(y)) {
      spacing[0] = x
      spacing[2] = x
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

    if (t) {
      output += `${property}-top: ${value(t)};`
    }

    if (b) {
      output += `${property}-bottom: ${value(b)};`
    }

    if (l) {
      output += `${property}-left: ${value(l)};`
    }

    if (r) {
      output += `${property}-right: ${value(r)};`
    }

    return output
  }
