import { isEmpty } from '@vitus-labs/core'

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
