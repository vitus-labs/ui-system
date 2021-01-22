module.exports = {
  build: {
    globals: {
      React: 'react',
      ReactDOM: 'react-dom',
      core: '@vitus-labs/core',
      unistyle: '@vitus-labs/unistyle',
      hoistNonReactStatics: 'hoist-non-react-statics',
      lodash: 'lodash',
      merge: 'lodash.merge',
    },
  },
  stories: {
    port: 7007,
  },
}
