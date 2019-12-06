module.exports = {
  verbose: false,
  displayName: 'test',
  testEnvironment: 'node',
  setupFiles: [`${__dirname}/setup.js`],
  setupFilesAfterEnv: [`${__dirname}/setupAfterEnv.js`],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  coverageDirectory: './.coverage',
  transform: { '\\.js$': ['babel-jest', { rootMode: 'upward' }] },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/__snapshots__/**/*.*',
    '!src/**/stories.{js,jsx,ts,tsx}'
  ],
  // preset: 'ts-jest',

  testPathIgnorePatterns: [
    '/lib/',
    '/dist/',
    '/node_modules/',
    '/tools/',
    '.storybook'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest'
  // }
  // globals: {
  //   'ts-jest': {
  //     tsConfig: 'tsconfig.json',
  //     diagnostics: {
  //       warnOnly: true
  //     }
  //   }
  // }
}
