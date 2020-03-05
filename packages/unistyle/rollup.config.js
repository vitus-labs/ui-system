import rollup from '@vitus-labs/tools-rollup'

export default rollup({
  name: 'unistyle',
  external: ['react', '@vitus-labs/unistyle'],
  globals: {
    react: 'React',
    'styled-components': 'styled'
  }
})
