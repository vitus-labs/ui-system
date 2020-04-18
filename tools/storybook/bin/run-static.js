#!/usr/bin/env node
const storybook = require('@storybook/react/standalone')

storybook({
  mode: 'static',
  configDir: `${__dirname}/../config`,
  outputDir: `${process.cwd()}/docs`,
})
