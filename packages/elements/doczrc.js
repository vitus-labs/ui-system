const docz = require('@internal/docz')

export default docz.config({
  base: '/elements/',
  title: 'Elements',
  description: 'React elements',
  dest: '/elements',
  menu: [
    'Getting Started',
    {
      name: 'Components',
      menu: ['Element', 'Iterator', 'List', 'Text', 'Overlay', 'Portal', 'Util']
    }
  ]
})
