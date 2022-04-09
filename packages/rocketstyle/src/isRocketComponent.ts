import type { RocketComponentType } from '~/types/config'

export type IsRocketComponent = <T>(
  component: T
) => T extends RocketComponentType ? true : false

const isRocketComponent: IsRocketComponent = (component) => {
  if (
    component &&
    typeof component === 'object' &&
    component !== null &&
    // eslint-disable-next-line dot-notation
    component['IS_ROCKETSTYLE'] === true
  ) {
    return true as any
  }

  return false
}

export default isRocketComponent
