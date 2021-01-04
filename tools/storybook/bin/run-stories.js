#!/usr/bin/env node
const storybook = require('@storybook/react/standalone')
const CONFIG = require('../src/config')

storybook({
  mode: 'dev',
  port: CONFIG.port,
  configDir: `${__dirname}/../config`,
})
