const config = ({ base, title, description, dest, menu }) => ({
  typescript: true,
  base,
  title,
  description,
  files: '**/*.{md,markdown,mdx}',
  dest: `../../docs/${dest}`,
  ignore: ['README.md', 'readme.md'],
  menu,
})

const onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: `babel-plugin-module-resolver`,
    options: {
      alias: {
        '~': `${process.cwd()}/../src`, // TODO: this is just a quick solution
      },
    },
  })
}

const onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig()

  const newRules = config.module.rules.map((rule) => {
    if (
      rule.use &&
      rule.use[0] &&
      rule.use[0].options &&
      rule.use[0].options.useEslintrc !== undefined
    ) {
      return {}
    }

    return rule
  })

  config.module.rules = newRules

  actions.replaceWebpackConfig(config)
}

exports.config = config
exports.onCreateBabelConfig = onCreateBabelConfig
exports.onCreateWebpackConfig = onCreateWebpackConfig
