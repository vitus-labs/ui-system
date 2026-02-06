export type IsAttrsComponent = <T>(component: T) => boolean

const isAttrsComponent: IsAttrsComponent = (component) => {
  if (
    component &&
    typeof component === 'object' &&
    component !== null &&
    Object.hasOwn(component, 'IS_ATTRS')
  ) {
    return true
  }

  return false
}

export default isAttrsComponent
