const config = ({ base, title, description, dest, menu }) => ({
  typescript: true,
  base,
  title,
  description,
  files: '**/*.{md,markdown,mdx}',
  dest: `../../docs/${dest}`,
  ignore: ['README.md', 'readme.md'],
  menu
})

const onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: `babel-plugin-module-resolver`,
    options: {
      alias: {
        '~': `${process.cwd()}/../src` // TODO: this is just a quick solution
      }
    }
  })
}

exports.config = config
exports.onCreateBabelConfig = onCreateBabelConfig
