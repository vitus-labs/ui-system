import rollup from '@vitus-labs/tools-rollup'

export default rollup({
  name: 'coolgrid',
  external: ['react', '@vitus-labs/core', '@vitus-labs/unistyle'],
  globals: {
    react: 'React',
    '@vitus-labs/core': '@vitus-labs/core',
    '@vitus-labs/unistyle': '@vitus-labs/unistyle',
  },
})
