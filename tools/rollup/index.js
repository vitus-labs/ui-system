const typescript = require('rollup-plugin-typescript2')
const resolve = require('@rollup/plugin-node-resolve')
const filesize = require('rollup-plugin-filesize')
const replace = require('@rollup/plugin-replace')
const { terser } = require('rollup-plugin-terser')
const babel = require('rollup-plugin-babel')
const {
  NAMESPACE,
  PKG_NAME_WITHOUT_PREFIX,
  PKG_DEPENDENCIES,
  PKG_PEER_DEPENDENCIES,
} = require('@vitus-labs/tools-core')

const bundleName = `${NAMESPACE}-${PKG_NAME_WITHOUT_PREFIX}`
const external = [...PKG_DEPENDENCIES, ...PKG_PEER_DEPENDENCIES]
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs']
const exclude = [
  '*.d.ts',
  'node_modules/**',
  '__tests__',
  '__specs__',
  '**/__stories__/**',
  '*.test.*',
  '*.spec.*',
  '*.stories.*',
]

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-native': 'reactNative',
  'styled-components': 'styled',
  lodash: 'lodash',
  'lodash.pick': 'pick',
  'hoist-non-react-statics': 'hoistNonReactStatics',
  '@vitus-labs/core': '@vitus-labs/core',
  '@vitus-labs/unistyle': '@vitus-labs/unistyle',
  '@vitus-labs/elements': '@vitus-labs/elements',
}

const babelConfig = {
  extensions,
  include: ['src'],
  exclude,
}

const tsConfig = {
  exclude,
  useTsconfigDeclarationDir: true,
  tsconfigDefaults: {
    compilerOptions: {
      declarationDir: 'lib/types',
    },
  },
}

// converts package name to umd or iife valid format
// example: cnmn-design-system => cnmnDesignSystem
const camelspaceBundleName = (name) => {
  const arrayStringsCamel = (arr) =>
    arr.map((item, i) =>
      i === 0
        ? item
        : item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()
    )
  const arr = name.split('-')
  const result = arrayStringsCamel(arr).join('')

  return result
}

const devPlugins = () => [
  resolve({ extensions }),
  typescript(tsConfig),
  replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
  babel(babelConfig),
  filesize(),
]

const prodPlugins = () => [
  resolve({ extensions }),
  typescript(tsConfig),
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  babel(babelConfig),
  terser(),
  filesize(),
]

const build = (outFile, format, mode) => ({
  input: 'src',
  output: {
    file: `./lib/${outFile}`,
    format,
    globals,
    exports: 'named',
    sourcemap: true,
    name: ['umd', 'iife'].includes(format)
      ? camelspaceBundleName(bundleName)
      : undefined,
  },
  external,
  plugins: mode === 'production' ? prodPlugins() : devPlugins(),
})

const bundles = [
  build(`${bundleName}.js`, 'cjs', 'development'),
  build(`${bundleName}.min.js`, 'cjs', 'production'),
  build(`${bundleName}.umd.js`, 'umd', 'development'),
  build(`${bundleName}.umd.min.js`, 'umd', 'production'),
  build(`${bundleName}.module.js`, 'es', 'development'),
]

exports.default = bundles
