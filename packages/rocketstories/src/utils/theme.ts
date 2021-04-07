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
