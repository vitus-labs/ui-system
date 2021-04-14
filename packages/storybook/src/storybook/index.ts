/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import CONFIG from '../config'

const storybookConfigDir = path.resolve(__dirname)

const storybookStandalone = {
  mode: 'dev',
  port: CONFIG.port,
  configDir: storybookConfigDir,
}

const storybookBuild = {
  mode: 'static',
  outputDir: CONFIG.outputDir,
  configDir: storybookConfigDir,
}

export { storybookStandalone, storybookBuild }
