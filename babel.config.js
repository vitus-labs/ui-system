module.exports = api => {
  api.cache(true)

  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/react'
    ],
    env: {
      build: {
        ignore: [
          '**/*.test.tsx',
          '**/*.test.ts',
          '**/*.story.tsx',
          '__snapshots__',
          '__tests__',
          '__stories__'
        ]
      }
    },
    ignore: ['node_modules'],
    plugins: [
      // [
      //   "module-resolver",
      //   {
      //     cwd: "babelrc",
      //     extensions: [".js"],
      //     alias: {
      //       "~": "./src"
      //     }
      //   }
      // ],
      '@babel/plugin-proposal-class-properties'
    ]
  }
}
