import rollup from '@internal/rollup'

export default rollup({
  name: 'vitus-labs-core',
  external: ['react', 'styled-components'],
  globals: {
    react: 'React',
    'styled-components': 'styled'
  }
})
