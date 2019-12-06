const filesize = require('rollup-plugin-filesize')
const resolve = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const visualizer = require('rollup-plugin-visualizer')

const prefixName = 'vitus-labs'

const devPlugins = () => [resolve(), filesize(), visualizer()]

const prodPlugins = () => [resolve(), terser(), filesize(), visualizer()]

const config = ({ globals, external }) => (outFile, format, mode) => ({
  input: './lib/index.js',
  output: {
    file: `./dist/${outFile}`,
    format,
    globals,
    name: format === 'umd' ? `${prefixName.replace('-', '')}` : undefined
  },
  external,
  plugins: mode === 'production' ? prodPlugins() : devPlugins()
})

const generateConfig = ({ name, globals, external }) => {
  const bundleName = `${prefixName}-${name}`
  const build = config({ globals, external })

  return [
    build(`${bundleName}.js`, 'cjs', 'development'),
    build(`${bundleName}.min.js`, 'cjs', 'production'),
    build(`${bundleName}.umd.js`, 'umd', 'development'),
    build(`${bundleName}.umd.min.js`, 'umd', 'production'),
    build(`${bundleName}.module.js`, 'es', 'development')
  ]
}

exports.default = generateConfig
