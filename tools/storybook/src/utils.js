const findUp = require('find-up')
const merge = require('lodash.merge')

// --------------------------------------------------------
// FIND & READ file helpers
// --------------------------------------------------------
const findFile = (filename) => findUp.sync(filename, { type: 'file' })
// const findFilePath = (filename) => findFile(filename).replace(filename, '')

// --------------------------------------------------------
// LOAD EXTERNAL CONFIGURATION
// --------------------------------------------------------
const getExternalConfig = () => {
  const file = findFile('vl-tools.config.js')
  if (file) {
    const data = require(file)

    return data.stories
  }

  return {}
}

const loadConfig = (config) => {
  const externalConfig = getExternalConfig()

  return merge(config, externalConfig)
}

module.exports = {
  loadConfig,
  CONFIG: getExternalConfig(),
}
