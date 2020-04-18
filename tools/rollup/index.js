const typescript = require('rollup-plugin-typescript2')
const resolve = require('@rollup/plugin-node-resolve')
const filesize = require('rollup-plugin-filesize')
const replace = require('@rollup/plugin-replace')
const { terser } = require('rollup-plugin-terser')
const babel = require('rollup-plugin-babel')

const prefixName = 'vitus-labs'
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

const config = ({ globals, external }) => (outFile, format, mode) => ({
  input: 'src',
  output: {
    file: `./lib/${outFile}`,
    format,
    globals,
    exports: 'named',
    name: format === 'umd' ? `${prefixName.replace('-', '')}` : undefined,
  },
  external,
  plugins: mode === 'production' ? prodPlugins() : devPlugins(),
})

const generateConfig = ({ name, globals, external }) => {
  const bundleName = `${prefixName}-${name}`
  const build = config({ globals, external })

  return [
    build(`${bundleName}.js`, 'cjs', 'development'),
    build(`${bundleName}.min.js`, 'cjs', 'production'),
    build(`${bundleName}.umd.js`, 'umd', 'development'),
    build(`${bundleName}.umd.min.js`, 'umd', 'production'),
    build(`${bundleName}.module.js`, 'es', 'development'),
  ]
}

exports.default = generateConfig
