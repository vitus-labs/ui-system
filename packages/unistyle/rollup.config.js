import rollup from '@vitus-labs/tools-rollup'

export default rollup({
  name: 'unistyle',
  external: ['react', '@vitus-labs/core'],
  globals: {
    react: 'React',
    'styled-components': 'styled',
    '@vitus-labs/core': 'vitusLabsCore',
  },
})
