export default {
  _styled: () => () => {},
  _css: () => () => {},
  _withTheme: () => {},
  _context: null,
  _component: 'div',
  _textComponent: 'p',
  _platform: 'web',
  get styled() {
    return this._styled
  },
  get css() {
    return this._css
  },
  get withTheme() {
    return this._withTheme
  },
  get context() {
    return this._context
  },
  get component() {
    return this._component
  },
  get textComponent() {
    return this._textComponent
  },
  get platform() {
    return this._platform
  },
  get isNative() {
    return this._platform === 'native'
  },
  get isWeb() {
    return this._platform === 'web'
  }
}
