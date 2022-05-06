export default class ThemeManager {
  theme = {}

  mode = 'light'

  baseTheme = new WeakMap()

  dimensionsThemes = new WeakMap()

  modeBaseTheme = { light: new WeakMap(), dark: new WeakMap() }

  modeDimensionTheme = { light: new WeakMap(), dark: new WeakMap() }
}
