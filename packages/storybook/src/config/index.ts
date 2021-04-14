import { loadConfig } from '../utils'
import baseConfig from './baseConfig'

const config = loadConfig(baseConfig)

const updatedConfig = {
  ...config,
  outDir: `${process.cwd()}${config.outDir}`,
  storiesDir: config.storiesDir.map((item) => `${process.cwd()}${item}`),
}

export default updatedConfig
