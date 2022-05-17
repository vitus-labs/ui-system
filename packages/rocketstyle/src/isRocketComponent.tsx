export type IsRocketComponent = <T>(component: T) => boolean

const isRocketComponent: IsRocketComponent = (component) => {
  if (
    component &&
    typeof component === 'object' &&
    component !== null &&
    Object.prototype.hasOwnProperty.call(component, 'IS_ROCKETSTYLE')
  ) {
    return true
  }

  return false
}

export default isRocketComponent
