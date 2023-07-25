/* eslint-disable no-param-reassign */
import { isEmpty } from '@vitus-labs/core'

// --------------------------------------------------------
// Remove undefined props
// --------------------------------------------------------
type RemoveUndefinedProps = <T extends Record<string, any>>(
  props: T,
) => { [I in keyof T as T[I] extends undefined ? never : I]: T[I] }

export const removeUndefinedProps: RemoveUndefinedProps = (props) =>
  Object.keys(props).reduce((acc, key) => {
    const currentValue = props[key]
    if (currentValue !== undefined) return { ...acc, [key]: currentValue }
    return acc
  }, {} as any)

// --------------------------------------------------------
// combine values
// --------------------------------------------------------
type OptionFunc<A> = (...arg: A[]) => Record<string, unknown>
type CalculateChainOptions = <A>(
  options?: OptionFunc<A>[],
) => (args: A[]) => ReturnType<OptionFunc<A>>

export const calculateChainOptions: CalculateChainOptions =
  (options) => (args) => {
    const result = {}
    if (!options || isEmpty(options)) return result

    return options.reduce((acc, item) => Object.assign(acc, item(...args)), {})
  }
