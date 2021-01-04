const { loadConfig } = require('./utils')
const baseConfig = require('./baseConfig')

const CONFIG = loadConfig(baseConfig)

module.exports = CONFIG
