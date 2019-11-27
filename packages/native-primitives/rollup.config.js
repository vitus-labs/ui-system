import rollup from '@internal/rollup'

export default rollup({
  name: 'vitus-labs-native-primitives',
  external: ['react'],
  globals: {
    react: 'React'
  }
})
