import { omit, pick, set, get, throttle, difference } from 'lodash'
import compose from './compose'
import renderContent from './renderContent'
import config, { init } from './config'

export { init, compose, renderContent, difference, omit, pick, set, get, throttle }
export default config
