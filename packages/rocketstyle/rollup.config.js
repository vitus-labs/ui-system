import rollup from '@vitus-labs/tools-rollup'

export default rollup({
  name: 'rocketstyle',
  external: ['react', '@vitus-labs/core', 'hoist-non-react-statics'],
  globals: {
    react: 'React',
    'hoist-non-react-statics': 'hoistNonReactStatics',
    '@vitus-labs/core': '@vitus-labs/core'
  }
})
