export default {
  outDir: '/docs',
  port: 6006,
  ui: {
    theme: 'dark',
  },
  storiesDir: [`/src/**/__stories__/**/*.stories.@(js|jsx|ts|tsx|mdx)`],
  addons: {
    a11y: true,
    knobs: true,
    backgrounds: true,
    viewport: true,
    mode: true,
    docs: true,
  },
  decorators: {
    theme: {},
  },
}
