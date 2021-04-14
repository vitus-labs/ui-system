import { themes } from '@storybook/theming'
import { MINIMAL_VIEWPORTS, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

export default {
  outDir: '/docs',
  port: 6006,
  ui: {
    theme: 'dark',
  },
  storiesDir: [`/src/**/__stories__/**/*.stories.@(js|jsx|ts|tsx|mdx)`],
  globals: {
    // theme: {
    //   name: 'Theme',
    //   description: 'Global theme for components',
    //   defaultValue: 'light',
    //   toolbar: {
    //     icon: 'circlehollow',
    //     // array of plain string values or MenuItem shape (see below)
    //     items: ['light', 'dark'],
    //   },
    // },
  },
  addons: {
    controls: { expanded: true },
    actions: true,
    a11y: true,
    toolbars: true,
    mode: true,
    docs: true,
    viewport: {
      viewports: { ...MINIMAL_VIEWPORTS, ...INITIAL_VIEWPORTS },
    },
    darkMode: {
      dark: themes.dark,
      light: themes.normal,
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: '#000' },
      ],
      grid: {
        disable: false,
        cellSize: 8,
        opacity: 0.5,
        cellAmount: 4,
        offsetX: 16,
        offsetY: 16,
      },
    },
  },
  decorators: {
    theme: {},
  },
}
