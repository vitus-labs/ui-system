import rollup from '@vitus-labs/tools-rollup'

export default rollup({
  name: 'native-primitives',
  external: ['react'],
  globals: {
    react: 'React'
  }
})
