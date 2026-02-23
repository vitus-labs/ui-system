/**
 * Retrieves the current theme object from the global
 * `window.__VITUS_LABS_STORIES__` store, which is populated
 * either by calling `init({ theme })` or by the Storybook
 * preview configuration at startup.
 */
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

export const setTheme = (theme: Record<string, unknown>) => {
  window.__VITUS_LABS_STORIES__ = {
    ...window.__VITUS_LABS_STORIES__,
    decorators: {
      ...window.__VITUS_LABS_STORIES__?.decorators,
      theme,
    },
  }
}

export default getTheme
