const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Watch VL packages only (not the whole monorepo)
config.watchFolders = [
  path.resolve(monorepoRoot, 'packages'),
]

// Resolve node_modules from local only — file: links handle VL packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
]

// Resolve via built lib/ output (react-native condition picks native bundles)
config.resolver.unstable_conditionNames = ['react-native', 'import']

// Block Metro from traversing up to monorepo root's node_modules
config.resolver.blockList = [
  new RegExp(path.resolve(monorepoRoot, 'node_modules').replace(/[/\\]/g, '[/\\\\]')),
]

module.exports = config
