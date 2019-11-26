import rollup from '@internal/rollup'

export default rollup({
  name: 'vitus-labs-native-rocketstyle',
  external: ['react', '@vitus-labs/core', 'hoist-non-react-statics'],
  globals: {
    react: 'React',
    'hoist-non-react-statics': 'hoistNonReactStatics',
    '@vitus-labs/core': '@vitus-labs/core'
  }
})
