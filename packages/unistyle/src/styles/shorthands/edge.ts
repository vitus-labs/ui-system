import { normalizeUnit } from '~/units'
import type { Units } from '~/types'

type Value = string | number | null | undefined

const isValidValue = (value) => !!value || value === 0

type Definitions = { [key: string]: { unit?: Units; edgeCss: any } }

const definitions: Definitions = {
  inset: {
    unit: 'rem',
    edgeCss: (side) => side,
  },
  margin: {
    unit: 'rem',
    edgeCss: (side) => `margin-${side}`,
  },
  padding: {
    unit: 'rem',
    edgeCss: (side) => `padding-${side}`,
  },
  borderWidth: {
    unit: 'px',
    edgeCss: (side) => `border-${side}-width`,
  },
  borderStyle: {
    edgeCss: (side) => `border-${side}-style`,
  },
  borderColor: {
    edgeCss: (side) => `border-${side}-color`,
  },
}

export type Edge = (rootSize?: number) => (
  property:
    | 'inset'
    | 'margin'
    | 'padding'
    | 'borderWidth'
    | 'borderStyle'
    | 'borderColor',
  values: {
    full: Value
    x: Value
    y: Value
    top: Value
    left: Value
    right: Value
    bottom: Value
  }
) => string | null

// eslint-disable-next-line import/prefer-default-export
const edge: Edge =
  (rootSize = 16) =>
  (property, { top, left, right, bottom, x, y, full }) => {
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

    const { unit, edgeCss } = definitions[property]

    const value = (param) =>
      unit ? normalizeUnit({ param, rootSize, outputUnit: unit }) : value

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

    if (spacing.every((val) => isValidValue(val))) {
      if (spacing.every((val, _, arr) => val === arr[0])) {
        return `${property}: ${value(t)};`
      }

      if (t === b && r === l) {
        return `${property}: ${value(t)} ${value(r)};`
      }

      if (t && r === l && b) {
        return `${property}: ${value(t)} ${value(r)} ${value(b)};`
      }

      return `${property}: ${value(t)} ${value(r)} ${value(b)} ${value(l)};`
    }

    let output = ''

    if (isValidValue(t)) {
      output += `${edgeCss('top')}: ${value(t)};`
    }

    if (isValidValue(b)) {
      output += `${edgeCss('bottom')}: ${value(b)};`
    }

    if (isValidValue(l)) {
      output += `${edgeCss('left')}: ${value(l)};`
    }

    if (isValidValue(r)) {
      output += `${edgeCss('right')}: ${value(r)};`
    }

    return output
  }

export default edge
