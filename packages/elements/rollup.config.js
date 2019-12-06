import rollup from '@internal/rollup'

export default rollup({
  name: 'elements',
  external: ['react', '@vitus-labs/core'],
  globals: {
    react: 'React',
    '@vitus-labs/core': '@vitus-labs/core'
  }
})
