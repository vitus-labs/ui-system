/**
 * WeakMap-based multi-tier cache for computed theme objects.
 * Maintains separate caches for base themes, dimension themes,
 * and their light/dark mode variants to avoid recalculation on re-renders.
 */
export default class ThemeManager {
  baseTheme = new WeakMap()

  dimensionsThemes = new WeakMap()

  modeBaseTheme = { light: new WeakMap(), dark: new WeakMap() }

  modeDimensionTheme = { light: new WeakMap(), dark: new WeakMap() }

  /**
   * Per-`themes` derived dimension metadata (keysMap, keywords, reserved keys,
   * omit Set). Depends only on the dimension themes object plus component-level
   * options fixed at factory time, so it's shared across all instances.
   */
  dimensionsMap = new WeakMap<
    object,
    {
      keysMap: Record<string, any>
      keywords: Record<string, any>
      reservedKeys: string[]
      omitKeysSet: Set<string>
    }
  >()
}
