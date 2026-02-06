import { isEmpty } from '@vitus-labs/core'
import attrsComponent from '~/attrs'
import type { InitAttrsComponent } from '~/types/InitAttrsComponent'
import type { ElementType } from '~/types/utils'

export type Attrs = <C extends ElementType>({
  name,
  component,
}: {
  name: string
  component: C
}) => ReturnType<InitAttrsComponent<C>>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const attrs: Attrs = ({ name, component }) => {
  // --------------------------------------------------------
  // handle ERRORS in development mode
  // --------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    type Errors = Partial<{
      component: string
      name: string
    }>

    const errors: Errors = {}
    if (!component) {
      errors.component = 'Parameter `component` is missing in params!'
    }

    if (!name) {
      errors.name = 'Parameter `name` is missing in params!'
    }

    if (!isEmpty(errors)) {
      throw Error(JSON.stringify(errors))
    }
  }

  return attrsComponent({
    name,
    component,
    attrs: [],
    priorityAttrs: [],
    filterAttrs: [],
    compose: {},
    statics: {},
  })
}

export default attrs
