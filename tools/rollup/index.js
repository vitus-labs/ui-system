const filesize = require("rollup-plugin-filesize");
const resolve = require("rollup-plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const visualizer = require("rollup-plugin-visualizer");

const devPlugins = () => [resolve(), filesize(), visualizer()];

const prodPlugins = () => [resolve(), terser(), filesize(), visualizer()];

const config = ({ globals, external }) => (outFile, format, mode) => ({
  input: "./lib/index.js",
  output: {
    file: `./dist/${outFile}`,
    format,
    globals,
    name: format === "umd" ? "vitusLabsCoolgrid" : undefined
  },
  external,
  plugins: mode === "production" ? prodPlugins() : devPlugins()
});

const generateConfig = ({ name, globals, external }) => {
  const _config = config({ globals, external });

  return [
    _config(`${name}.js`, "cjs", "development"),
    _config(`${name}.min.js`, "cjs", "production"),
    _config(`${name}.umd.js`, "umd", "development"),
    _config(`${name}.umd.min.js`, "umd", "production"),
    _config(`${name}.module.js`, "es", "development")
  ];
};

exports.default = generateConfig;
