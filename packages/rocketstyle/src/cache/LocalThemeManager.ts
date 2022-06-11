export default class ThemeManager {
  baseTheme = new WeakMap()

  dimensionsThemes = new WeakMap()

  modeBaseTheme = { light: new WeakMap(), dark: new WeakMap() }

  modeDimensionTheme = { light: new WeakMap(), dark: new WeakMap() }
}
