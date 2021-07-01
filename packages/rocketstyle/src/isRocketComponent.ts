/* eslint-disable @typescript-eslint/no-explicit-any */
type IsRocketComponent = (component: any) => boolean

const isRocketComponent: IsRocketComponent = (component) => {
  if (
    typeof component === 'object' &&
    component !== null &&
    component.IS_ROCKETSTYLE
  ) {
    return true
  }

  return false
}

export default isRocketComponent
