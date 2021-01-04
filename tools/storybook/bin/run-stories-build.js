#!/usr/bin/env node
const storybook = require('@storybook/react/standalone')
const CONFIG = require('../src/config')

storybook({
  mode: 'static',
  configDir: `${__dirname}/../config`,
  outputDir: CONFIG.outputDir,
})
