import { omit, pick, set, get, throttle } from 'lodash'
import compose from './compose'
import renderContent from './renderContent'
import config, { init } from './config'

export { init, compose, renderContent, omit, pick, set, get, throttle }
export default config
