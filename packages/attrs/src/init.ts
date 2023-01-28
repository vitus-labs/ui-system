import { isEmpty } from '@vitus-labs/core'
import attrsComponent from '~/attrs'
import type { ElementType } from '~/types/utils'
import type { InitAttrsComponent } from '~/types/InitAttrsComponent'

export type Attrs = <C extends ElementType<any>>({
  name,
  component,
}: {
  name: string
  component: C
}) => ReturnType<InitAttrsComponent<C>>

// @ts-ignore
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
    compose: {},
    statics: {},
  })
}

export default attrs
