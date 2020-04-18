module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/react',
    '@babel/typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/transform-react-jsx',
  ],
  env: {
    build: {
      ignore: [
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/*.story.tsx',
        '**/*.stories.tsx',
        '__snapshots__',
        '__tests__',
        '__stories__',
      ],
    },
  },
  ignore: ['node_modules'],
}
