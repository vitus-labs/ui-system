import { isEmpty } from '@vitus-labs/core'
import type { MultiKeys } from '~/types/dimensions'

// --------------------------------------------------------
// remove undefined props
// --------------------------------------------------------
/** Strips keys with `undefined` values so they don't shadow default props during merging. */
type RemoveUndefinedProps = <T extends Record<string, any>>(
  props: T,
) => Partial<T>

export const removeUndefinedProps: RemoveUndefinedProps = (props) => {
  const result: Partial<typeof props> = {}
  for (const key in props) {
    if (props[key] !== undefined) result[key] = props[key]
  }
  return result
}

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
  // @ts-expect-error — `keyof K` is a subset of `keyof T` by the `K extends { [I in keyof T]?: true }`
  // constraint, but TS doesn't carry that invariant into the mapped type
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

    // @ts-expect-error — isEmpty narrows runtime but doesn't narrow `options` to non-undefined here
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
      const t = typeof pickedProp

      // if the property is multi key, allow assign array as well
      if (multiKeys?.[item] && Array.isArray(pickedProp)) {
        result[item] = pickedProp
      }
      // assign when it's only a string or number otherwise it's considered
      // as invalid param
      else if (t === 'string' || t === 'number') {
        result[item] = pickedProp
      } else {
        result[item] = undefined
      }
    })

    // (2) if booleans are being used let's find the rest
    if (useBooleans) {
      const propsKeys = Object.keys(props)

      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: dimension matching algo — branches by multi/single + boolean keyword detection
      Object.entries(result).forEach(([key, value]) => {
        // @ts-expect-error — `multiKeys` is typed `MultiKeys` (specific dimension prop names),
        // but `key` here is `string` from `Object.entries`. They overlap by construction at the call site.
        const isMultiKey = multiKeys[key]

        // when value in result is not assigned yet
        if (!value) {
          let newDimensionValue: string | string[] | undefined
          const keywordSet = new Set(
            Object.keys(dimensions[key] as Record<string, unknown>),
          )

          if (isMultiKey) {
            newDimensionValue = propsKeys.filter((key) => keywordSet.has(key))
          } else {
            // iterate backwards to guarantee the last one will have
            // a priority over previous ones
            for (let i = propsKeys.length - 1; i >= 0; i--) {
              // biome-ignore lint/style/noNonNullAssertion: loop bound `i >= 0 && i < propsKeys.length` guarantees propsKeys[i] exists
              const k = propsKeys[i]!
              if (keywordSet.has(k) && props[k]) {
                newDimensionValue = k
                break
              }
            }
          }

          result[key] = newDimensionValue
        }
      })
    }

    return result
  }
