import rollup from '@internal/rollup'

export default rollup({
  name: 'native-primitives',
  external: ['react'],
  globals: {
    react: 'React'
  }
})
