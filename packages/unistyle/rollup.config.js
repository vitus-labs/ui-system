import rollup from '@internal/rollup'

export default rollup({
  name: 'unistyle',
  external: ['react', '@vitus-labs/unistyle'],
  globals: {
    react: 'React',
    'styled-components': 'styled'
  }
})
