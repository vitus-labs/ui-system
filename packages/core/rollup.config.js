import rollup from '@internal/rollup'

export default rollup({
  name: 'core',
  external: ['react', 'styled-components'],
  globals: {
    react: 'React',
    'styled-components': 'styled'
  }
})
