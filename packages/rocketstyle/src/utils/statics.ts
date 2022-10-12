import { isEmpty } from '@vitus-labs/core'
import { STATIC_KEYS } from '~/constants'

// --------------------------------------------------------
// helpers for create statics chainin methods on component
// --------------------------------------------------------
type CreateStaticsChainingEnhancers = <
  O extends Record<string, any>,
  DK extends string[]
>(props: {
  context: Record<string, any>
  dimensionKeys: DK
  func: (defaultOpts: O, opts: any) => void
  options: O
}) => void

export const createStaticsChainingEnhancers: CreateStaticsChainingEnhancers = ({
  context,
  dimensionKeys,
  func,
  options,
}) => {
  const keys = [...dimensionKeys, ...STATIC_KEYS]

  keys.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    context[item] = (props: any) => func(options, { [item]: props })
  })
}

// --------------------------------------------------------
// helpers for create statics on component
// --------------------------------------------------------
type CreateStaticsEnhancers = (params: {
  context: Record<string, any>
  options: Record<string, any>
}) => void

export const createStaticsEnhancers: CreateStaticsEnhancers = ({
  context,
  options,
}) => {
  if (!isEmpty(options)) {
    Object.assign(context, options)
  }
}
