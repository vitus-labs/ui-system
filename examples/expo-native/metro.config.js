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

// Use traditional field resolution: react-native → main (no package exports)
// VL packages have top-level "react-native" and "main" fields pointing to lib/
config.resolver.resolverMainFields = ['react-native', 'main']

// Block monorepo root + packages node_modules (avoid duplicate react/react-native)
config.resolver.blockList = [
  new RegExp(path.resolve(monorepoRoot, 'node_modules').replace(/[/\\]/g, '[/\\\\]')),
  new RegExp(path.resolve(monorepoRoot, 'packages', '.*', 'node_modules').replace(/[/\\]/g, '[/\\\\]')),
]

module.exports = config
