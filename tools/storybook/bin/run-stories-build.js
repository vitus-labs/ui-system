#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const storybook = require('@storybook/react/standalone')
const { storybookBuild } = require('../lib/storybook')

storybook(storybookBuild)
