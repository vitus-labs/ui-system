#!/usr/bin/env node
const storybook = require('@storybook/react/standalone')
const { storybookStandalone } = require('../lib/storybook')

storybook(storybookStandalone)
