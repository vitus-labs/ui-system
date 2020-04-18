#!/usr/bin/env node
const storybook = require('@storybook/react/standalone')

storybook({
  mode: 'dev',
  port: 6006,
  configDir: `${__dirname}/../config`,
})
