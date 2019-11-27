const docz = require('@internal/docz')

export default docz.config({
  base: '/vitus-labs/coolgrid/',
  title: 'Coolgrid',
  description:
    'Coolgrid is ultra flexible and extensible grid system for React based on styled-components and heavily inspired by Bootstrap Grid system.',
  dest: '/coolgrid',
  menu: [
    'Getting Started',
    { name: 'Components', menu: ['Container', 'Row', 'Col'] },
    'Examples'
  ]
})
