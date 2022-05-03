import { isEmpty } from '@vitus-labs/core'
import { STATIC_KEYS } from '~/constants/reservedKeys'

// --------------------------------------------------------
// helpers for create statics chainin methods on component
// --------------------------------------------------------
export const createStaticsChainingEnhancers = ({
  context,
  dimensionKeys,
  func,
  options,
}) => {
  const keys = [...dimensionKeys, ...STATIC_KEYS]

  keys.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    context[item] = (props) => func({ [item]: props }, options)
  })
}

// --------------------------------------------------------
// helpers for create statics on component
// --------------------------------------------------------
export const createStaticsEnhancers = ({ context, opts }) => {
  if (!isEmpty(opts)) {
    Object.assign(context, opts)
  }
}
