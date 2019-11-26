/* eslint-disable no-underscore-dangle */
export class Configuration {
  constructor(props) {
    this._styled = props.styled
    this._css = props.css
    this._withTheme = props.withTheme
    this._context = props.context
    this._component = props.component
    this._textComponent = props.textComponent
    this._platform = props.platform
  }

  get styled() {
    return this._styled
  }

  set styled(styled) {
    this._styled = styled
  }

  get css() {
    return this._css
  }

  set css(css) {
    this._css = css
  }

  get withTheme() {
    return this._withTheme
  }

  set withTheme(withTheme) {
    this._withTheme = withTheme
  }

  get context() {
    return this._context
  }

  set context(context) {
    this._context = context
  }

  get component() {
    return this._component
  }

  set component(component) {
    this._component = component
  }

  get textComponent() {
    return this._textComponent
  }

  set textComponent(component) {
    this._textComponent = component
  }

  get platform() {
    return this._platform
  }

  set platform(platform) {
    this._platform = platform
  }

  get isNative() {
    return this._platform === 'native'
  }

  get isWeb() {
    return this._platform === 'web'
  }
}

const config = new Configuration({})

export default config
