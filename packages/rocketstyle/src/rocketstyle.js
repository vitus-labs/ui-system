import React, { forwardRef, createContext, createElement, Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import config, { omit, pick, compose } from '@vitus-labs/core'
import {
  chainOptions,
  calculateStyles,
  calculateValues,
  calculateStyledAttrs,
  calculateTheme
} from './utils'

const Context = createContext({})

// --------------------------------------------------------
const RESERVED_CLONED_KEYS = ['theme', 'attrs', 'styles']
const generateClonedKeys = (keys, opts, defaultOpts) => {
  const result = {}
  keys.forEach(item => (result[item] = chainOptions(opts[item], defaultOpts[item])))

  return result
}

const generateConfigEnhancer = ({ dimensionKeys, func }) => {
  const result = {}
  dimensionKeys.forEach(item => (result[item] = func(item)))

  return result
}

const generateComponentStatics = ({ context, dimensionKeys, func, opts }) => {
  dimensionKeys.forEach(item => {
    context[item] = props => func({ [item]: props }, opts)
  })
}

const RESERVED_STATIC_KEYS = ['compose', 'attrs', 'theme', 'styles', 'dimensions']
// const generateComponentStaticHelpers = ({ context, dimensionKeys, func }) => {
//   dimensionKeys.forEach(item => {
//     context[item] = func(item)
//   })
// }

const generateKeys = (context, theme, config) => {
  config.dimensionKeys.forEach(item => {
    context[item] = Object.keys(theme[item])
  })
}

const generateThemes = (context, theme, config) => {
  config.dimensionKeys.forEach(item => {
    context[item] = calculateValues(config[item], theme, config.css)
  })
}

// --------------------------------------------------------
// cloneAndEnhance
// helper function which allows function chaining
// always returns styleComponent with static functions
// assigned
// --------------------------------------------------------
const cloneAndEnhance = (opts, defaultOpts = {}) =>
  styleComponent({
    ...defaultOpts,
    provider: opts.provider || defaultOpts.provider,
    consumer: opts.consumer || defaultOpts.consumer,
    DEBUG: opts.DEBUG || defaultOpts.DEBUG,
    name: opts.name || defaultOpts.name,
    component: opts.component || defaultOpts.component,
    compose: { ...defaultOpts.compose, ...opts.compose },
    ...generateClonedKeys(
      [...defaultOpts.dimensionKeys, ...RESERVED_CLONED_KEYS],
      opts,
      defaultOpts
    )
  })

// --------------------------------------------------------
// styleComponent
// helper function which allows function chaining
// always returns a valid React component with static functions
// assigned, so it can be even rendered as a valid component
// or styles can be extended via its statics
// --------------------------------------------------------
const styleComponent = options => {
  // create styled component with all options.styles
  let __STYLED_COMPONENT__ = options.component

  if (options.styles) {
    __STYLED_COMPONENT__ = calculateStyles({
      component: options.component,
      styles: options.styles,
      config: config
    })
  }

  // valid react component
  class EnhancedComponent extends Component {
    constructor(props) {
      super(props)
      const { theme } = props

      // define empty objects so they can be reassigned later
      this.__ROCKETSTYLE__ = {
        keys: {},
        themes: {}
      }

      this.__ROCKETSTYLE__.themes.base = calculateValues(
        options.theme,
        theme,
        config.css
      )

      generateThemes(this.__ROCKETSTYLE__.themes, theme, options)
      generateKeys(this.__ROCKETSTYLE__.keys, this.__ROCKETSTYLE__.themes, options)

      this.__ROCKETSTYLE__.KEYWORDS = [
        ...this.__ROCKETSTYLE__.keys.states,
        ...this.__ROCKETSTYLE__.keys.sizes,
        ...this.__ROCKETSTYLE__.keys.variants,
        ...this.__ROCKETSTYLE__.keys.multiple,
        'state',
        'size',
        'variant',
        'multiple'
      ]
    }

    render() {
      const finalElement = (consumerData = {}) => {
        const newProps = calculateValues(options.attrs, this.props, {
          createElement
        })

        const styledAttributes = calculateStyledAttrs({
          props: pick(
            { ...consumerData, ...this.props },
            this.__ROCKETSTYLE__.KEYWORDS
          ),
          states: this.__ROCKETSTYLE__.keys,
          dimensions: options.dimensions,
          useBooleans: options.useBooleans
        })

        // calculated final theme which will be passed to styled component
        const rocketstyle = calculateTheme({
          styledAttributes,
          themes: this.__ROCKETSTYLE__.themes,
          config: options
        })

        const renderedComponent = createElement(__STYLED_COMPONENT__, {
          ...consumerData,
          ...newProps,
          ...omit(this.props, ['theme']),
          rocketstyle
        })

        if (options.provider) {
          return (
            <Context.Provider value={styledAttributes}>
              {renderedComponent}
            </Context.Provider>
          )
        }

        return renderedComponent
      }

      if (options.consumer) {
        return (
          <Context.Consumer>
            {value => finalElement(options.consumer(value))}
          </Context.Consumer>
        )
      }

      return finalElement()
    }
  }

  let ExtendedComponent = forwardRef((props, ref) => (
    <EnhancedComponent {...props} ref={ref} />
  ))
  ExtendedComponent = config.withTheme(ExtendedComponent)

  if (options.compose && Object.values(options.compose).length > 0) {
    ExtendedComponent = compose(Object.values(options.compose))(ExtendedComponent)
  }

  // ------------------------------------------------------
  // This will hoist and generate dynamically next static methods
  // for all dimensions available in configuration
  // ------------------------------------------------------
  hoistNonReactStatics(EnhancedComponent, options.component)
  generateComponentStatics({
    context: ExtendedComponent,
    dimensionKeys: [...options.dimensionKeys, ...RESERVED_STATIC_KEYS],
    func: cloneAndEnhance,
    opts: options
  })
  // ------------------------------------------------------
  ExtendedComponent.displayName = options.name
  ExtendedComponent.IS_ROCKETSTYLE = true
  // ------------------------------------------------------
  ExtendedComponent.config = (opts = {}) => {
    const get = key => opts[key] || options[key]

    const result = {
      provider: get('provider'),
      consumer: get('consumer'),
      DEBUG: get('DEBUG'),
      name: get('name'),
      compose: get('compose'),
      component: get('component'),
      attrs: get('attrs'),
      theme: get('theme'),
      styles: get('styles'),
      ...generateConfigEnhancer({
        dimensionKeys: options.dimensionKeys,
        func: get
      })
    }

    return cloneAndEnhance(result, options)
  }

  // ExtendedComponent.__ROCKETSTYLE__ = {}

  // generateComponentStaticHelpers({
  //   context: ExtendedComponent.__ROCKETSTYLE__,
  //   dimensionKeys: options.dimensionKeys,
  //   func: item => calculateValues(
  //     CONFIG[item],
  //     __ROCKETSTYLE_CONFIG__.styled.theme,
  //     __ROCKETSTYLE_CONFIG__.styled.css,
  //   ),
  // })

  return ExtendedComponent
}

// ------------------------------------------------------

const defaultDimensions = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: ['multiple', { multi: true }]
}

const rocketstyle = ({
  dimensions = defaultDimensions,
  useBooleans = true
} = {}) => ({ name, component }) => {
  if (!name) {
    throw Error('Component name is missing in params')
  }
  if (!component) {
    throw Error('Rendered component is missing in params')
  }

  return styleComponent({
    name,
    component,
    dimensions,
    dimensionKeys: Object.keys(dimensions),
    isDimensionMultiKey: key =>
      // check if key is an array and if it has `multi` set to true
      // as an argument on index 1
      Array.isArray(dimensions[key]) && dimensions[key][1].multi === true,
    dimensionValues: Object.values(dimensions).map(item => {
      if (Array.isArray(item)) return item[0]
      return item
    }),
    useBooleans
  })
}

export default rocketstyle
