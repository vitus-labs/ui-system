import rocketstyle, { Rocketstyle } from './init'
import Provider, { context, TProvider } from './context'
import isRocketComponent from './isRocketComponent'
import type { RocketComponentType } from '~/types/config'

export type { Rocketstyle, TProvider, RocketComponentType }

export { context, Provider, isRocketComponent }
export default rocketstyle
