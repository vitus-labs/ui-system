import { config } from '@internal/docz'

export default config({
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
