export default {
  typescript: true,
  base: '/elements/',
  title: 'Elements',
  description: 'React elements',
  files: '**/*.{md,markdown,mdx}',
  ignore: ['README.md'],
  dest: '/docs',
  menu: [
    'Getting Started',
    {
      name: 'Components',
      menu: ['Element', 'Iterator', 'List', 'Text', 'Overlay', 'Portal', 'Util']
    }
  ]
}
