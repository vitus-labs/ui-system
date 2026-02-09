/**
 * Retrieves the current theme object from the global
 * `window.__VITUS_LABS_STORIES__` store, which is populated
 * by the Storybook preview configuration at startup.
 */
/* eslint-disable no-underscore-dangle */

declare global {
  interface Window {
    __VITUS_LABS_STORIES__: {
      decorators: {
        theme: Record<string, unknown>
      }
    }
  }
}

type GetTheme = () => Record<string, unknown>
const getTheme: GetTheme = () => window.__VITUS_LABS_STORIES__.decorators.theme

export default getTheme
