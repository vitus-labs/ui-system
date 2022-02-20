import { normalizeUnit } from '~/units'
import type { Units } from '~/types'

const isValidValue = (value) => !!value || value === 0

type Property =
  | 'inset'
  | 'margin'
  | 'padding'
  | 'border-width'
  | 'border-style'
  | 'border-color'
type Value = string | number | null | undefined
type Side = 'top' | 'bottom' | 'left' | 'right'

type Definitions = Record<
  Property,
  { unit?: Units; edgeCss: (side: Side) => string }
>

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
  'border-width': {
    unit: 'px',
    edgeCss: (side) => `border-${side}-width`,
  },
  'border-style': {
    edgeCss: (side) => `border-${side}-style`,
  },
  'border-color': {
    edgeCss: (side) => `border-${side}-color`,
  },
}

export type Edge = (rootSize?: number) => (
  property: Property,
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
  (property, { full, x, y, top, left, right, bottom }) => {
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

    const value = (param) => {
      if (unit) return normalizeUnit({ param, rootSize, outputUnit: unit })
      return param
    }

    // top - right - bottom - left
    const allValues = [full, full, full, full]

    if (isValidValue(x)) {
      allValues[1] = x
      allValues[3] = x
    }

    if (isValidValue(y)) {
      allValues[0] = y
      allValues[2] = y
    }

    if (isValidValue(top)) {
      allValues[0] = top
    }

    if (isValidValue(right)) {
      allValues[1] = right
    }

    if (isValidValue(bottom)) {
      allValues[2] = bottom
    }

    if (isValidValue(left)) {
      allValues[3] = left
    }

    const [t, r, b, l] = allValues

    if (allValues.every((val) => isValidValue(val))) {
      if (allValues.every((val, _, arr) => val === arr[0])) {
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
