import { isEmpty } from '@vitus-labs/core'
import type { MultiKeys } from '~/types/dimensions'

// --------------------------------------------------------
// remove undefined props
// --------------------------------------------------------
/** Strips keys with `undefined` values so they don't shadow default props during merging. */
type RemoveUndefinedProps = <T extends Record<string, any>>(
  props: T,
) => Partial<T>

export const removeUndefinedProps: RemoveUndefinedProps = (props) =>
  Object.keys(props).reduce((acc, key) => {
    const currentValue = props[key]
    if (currentValue !== undefined) return { ...acc, [key]: currentValue }
    return acc
  }, {})

// --------------------------------------------------------
// pick styled props
// --------------------------------------------------------
/** Picks only the props whose keys exist in the dimension keywords lookup and have truthy values. */
type PickStyledAttrs = <
  T extends Record<string, any>,
  K extends { [I in keyof T]?: true },
>(
  props: T,
  keywords: K,
  // @ts-expect-error
) => { [I in keyof K]: T[I] }

export const pickStyledAttrs: PickStyledAttrs = (props, keywords) =>
  Object.keys(props).reduce((acc, key) => {
    if (keywords[key] && props[key]) acc[key] = props[key]
    return acc
  }, {} as any)

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
/**
 * Returns a curried function that evaluates an array of `.attrs()` callbacks,
 * spreading each result into a single merged props object via `Object.assign`.
 */
type OptionFunc<A> = (...arg: A[]) => Record<string, unknown>
type CalculateChainOptions = <A>(
  options?: OptionFunc<A>[],
) => (args: A[]) => ReturnType<OptionFunc<A>>

export const calculateChainOptions: CalculateChainOptions =
  (options) => (args) => {
    const result = {}
    if (isEmpty(options)) return result

    // @ts-expect-error
    return options.reduce((acc, item) => Object.assign(acc, item(...args)), {})
  }

// --------------------------------------------------------
// get style attributes
// --------------------------------------------------------
/**
 * Resolves the active value for each styling dimension from component props.
 * First checks for explicit prop values (string, number, or array for multi-keys),
 * then falls back to boolean shorthand props when `useBooleans` is enabled.
 */
type CalculateStylingAttrs = ({
  useBooleans,
  multiKeys,
}: {
  useBooleans?: boolean
  multiKeys?: MultiKeys
}) => ({
  props,
  dimensions,
}: {
  props: Record<string, unknown>
  dimensions: Record<string, unknown>
}) => Record<string, any>
export const calculateStylingAttrs: CalculateStylingAttrs =
  ({ useBooleans, multiKeys }) =>
  ({ props, dimensions }) => {
    const result: Record<string, any> = {}

    // (1) find dimension keys values & initialize
    // object with possible options
    Object.keys(dimensions).forEach((item) => {
      const pickedProp = props[item]
      const valueTypes = ['number', 'string']

      // if the property is multi key, allow assign array as well
      if (multiKeys?.[item] && Array.isArray(pickedProp)) {
        result[item] = pickedProp
      }
      // assign when it's only a string or number otherwise it's considered
      // as invalid param
      else if (valueTypes.includes(typeof pickedProp)) {
        result[item] = pickedProp
      } else {
        result[item] = undefined
      }
    })

    // (2) if booleans are being used let's find the rest
    if (useBooleans) {
      const propsKeys = Object.keys(props).reverse()

      Object.entries(result).forEach(([key, value]) => {
        // @ts-expect-error
        const isMultiKey = multiKeys[key]

        // when value in result is not assigned yet
        if (!value) {
          let newDimensionValue: string | string[] | undefined
          const keywords = Object.keys(dimensions[key] as Record<string, unknown>)

          if (isMultiKey) {
            newDimensionValue = propsKeys.filter((key) =>
              keywords.includes(key),
            )
          } else {
            // reverse props to guarantee the last one will have
            // a priority over previous ones
            newDimensionValue = propsKeys.find((key) => {
              if (keywords.includes(key) && props[key]) return key
              return false
            })
          }

          result[key] = newDimensionValue
        }
      })
    }

    return result
  }
