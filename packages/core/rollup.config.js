import rollup from '@vitus-labs/tools-rollup'

export default rollup({
  name: 'core',
  external: ['react', 'styled-components', 'lodash'],
  globals: {
    react: 'React',
    'styled-components': 'styled',
    lodash: 'lodash',
  },
})
