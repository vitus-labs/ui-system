#!/usr/bin/env node
const storybook = require('@storybook/react/standalone')
const argv = require('yargs').argv

// console.log(argv)

const rootPath = argv['$0'].replace(
  'packages/rocketstyle/node_modules/.bin/run-stories',
  ''
)
// const theme = argv['t']

// console.log(rootPath)

storybook({
  mode: 'dev',
  configDir: `${rootPath}tools/storybook/standalone-config`,
  port: 6006
  // other options
})
