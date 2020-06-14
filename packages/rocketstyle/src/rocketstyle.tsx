import React, { createContext, forwardRef, FC, ComponentType } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {
  config,
  omit,
  pick,
  difference,
  compose,
  renderContent,
} from '@vitus-labs/core'
import {
  chainOptions,
  calculateChainOptions,
  calculateStyles,
  calculateStyledAttrs,
  calculateTheme,
} from './utils'
import useTheme from './hooks/useTheme'
import usePseudoState from './hooks/usePseudoState'

const Context = createContext({})
const RESERVED_OR_KEYS = ['provider', 'consumer', 'DEBUG', 'name', 'component']
const RESERVED_CLONED_KEYS = ['theme', 'attrs', 'styles']
const RESERVED_STATIC_KEYS = [...RESERVED_CLONED_KEYS, 'compose', 'dimensions']


// --------------------------------------------------------
// styledComponent helpers for chaining attributes
// --------------------------------------------------------
const orOptions = (keys, opts, defaultOpts) => {
  const result = {}
  keys.forEach((item) => {
    result[item] = opts[item] || defaultOpts[item]
  })

  return result
}

const chainReservedOptions = (keys, opts, defaultOpts) => {
  const result = {}
  keys.forEach((item) => {
    result[item] = chainOptions(opts[item], defaultOpts[item])
  })

  return result
}

// --------------------------------------------------------
// helpers for create statics on class
// --------------------------------------------------------
const createStaticsEnhancers = ({ context, dimensionKeys, func, opts }) => {
  dimensionKeys.forEach((item) => {
    context[item] = (props) => func({ [item]: props }, opts)
  })
}

// --------------------------------------------------------
// cloneAndEnhance
// helper function which allows function chaining
// always returns styleComponent with static functions
// assigned
// --------------------------------------------------------
const cloneAndEnhance = <T,>(opts, defaultOpts: OptionsType) =>
  // eslint-disable-next-line no-use-before-define
  styleComponent<T>({
    ...defaultOpts,
    compose: { ...defaultOpts.compose, ...opts.compose },
    ...orOptions(RESERVED_OR_KEYS, opts, defaultOpts),
    ...chainReservedOptions(
      [...defaultOpts.dimensionKeys, ...RESERVED_CLONED_KEYS],
      opts,
      defaultOpts
    ),
  })

// --------------------------------------------------------
// styleComponent
// helper function which allows function chaining
// always returns a valid React component with static functions
// assigned, so it can be even rendered as a valid component
// or styles can be extended via its statics
// --------------------------------------------------------

type ComponentProps = {
  onMount: any
}


// Option types
export type OptionsType = {
  name:string,
  component: React.ComponentType<any>
  useBooleans: boolean
  dimensions: any
  dimensionKeys: any
  dimensionValues: any
  styles?: any
  attrs?: any
  compose?: any
  provider?: boolean
  consumer?: any
}

// default props that are used in all components
type StyleComponentType = {config: <T,>(opts: Partial<OptionsType>)=> StyleComponentType,IS_ROCKETSTYLE: boolean}

const styleComponent = <T,BaseType = any>(options:OptionsType) => {
  const { component, styles } = options

  const componentName:string =
    options.name || options.component.displayName || options.component.name

  // create styled component with all options.styles if available
  let STYLED_COMPONENT = component

  if (styles) {
    STYLED_COMPONENT = calculateStyles({
      component,
      styles,
      config,
    })
  }

  const EnhancedComponent = forwardRef(({ onMount, ...props }:ComponentProps, ref) => {
    const pseudo = usePseudoState(props)
    const {
      theme,
      __ROCKETSTYLE__: { KEYWORDS, keys, themes },
    } = useTheme({ options, onMount })

    const finalElement = (ctxData = {}) => {
      const calculatedAttrs = calculateChainOptions(
        options.attrs,
        props,
        theme,
        {
          renderContent,
        }
      )

      const newProps = omit({ ...ctxData, ...calculatedAttrs, ...props }, [
        'theme',
      ])

      const styledAttributes = calculateStyledAttrs({
        props: pick(newProps, KEYWORDS),
        states: keys,
        dimensions: options.dimensions,
        useBooleans: options.useBooleans,
      })

      const rocketstate = { ...styledAttributes, pseudo: pseudo.pseudoState }
      Object.values(styledAttributes).forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((item) => {
            rocketstate[item] = true
          })
        } else {
          // TODO verify
          rocketstate[item] = true
        }
      })

      // calculated final theme which will be passed to styled component
      const rocketstyle = calculateTheme({
        styledAttributes,
        themes,
        config: options,
      })

      // this removes styling state from props and passes its state
      // under rocketstate key only (except boolean valid HTML attributes)
      const passProps = omit(newProps, KEYWORDS)
      // if (config.isWeb) {
      //   const boolAttrs = require('./booleanTags')
      //   const propsOmmitedAttrs = difference(
      //     this[namespace].KEYWORDS,
      //     boolAttrs.default
      //   )
      //   passProps = omit(newProps, propsOmmitedAttrs)
      // } else {
      //   passProps = omit(newProps, this[namespace].KEYWORDS)
      // }

      let renderedComponent = renderContent(STYLED_COMPONENT, {
        ...passProps,
        ...pseudo.events,
        $rocketstyle: rocketstyle,
        $rocketstate: rocketstate,
        ref,
        'data-rocketstyle': componentName,
      })

      if (options.provider) {
        return (
          <Context.Provider value={rocketstate}>
            {renderedComponent}
          </Context.Provider>
        )
      }

      return renderedComponent
    }

    if (options.consumer) {
      return (
        <Context.Consumer>
          {(value) => finalElement(options.consumer(value))}
        </Context.Consumer>
      )
    }

    return finalElement()
  })


  let ExtendedComponent: BaseType & React.ComponentType<T> & StyleComponentType = config.withTheme(EnhancedComponent)

  const composeFuncs = Object.values(options.compose || {})
  if (composeFuncs.length > 0) {
    ExtendedComponent = compose(composeFuncs)(ExtendedComponent)
  }

  // ------------------------------------------------------
  // This will hoist and generate dynamically next static methods
  // for all dimensions available in configuration
  // ------------------------------------------------------
  hoistNonReactStatics(ExtendedComponent, options.component)
  createStaticsEnhancers({
    context: ExtendedComponent,
    dimensionKeys: [...options.dimensionKeys, ...RESERVED_STATIC_KEYS],
    func: cloneAndEnhance,
    opts: options,
  })
  // ------------------------------------------------------
  ExtendedComponent.IS_ROCKETSTYLE = true
  ExtendedComponent.displayName = componentName
  // ------------------------------------------------------
  // P is new props defined in each component
  ExtendedComponent.config = <P,>(opts = {}) => {
    const result = pick(opts, RESERVED_OR_KEYS)

    // clone component with -> new props & base props
    return cloneAndEnhance<T & P>(result, options)
  }

  return ExtendedComponent
}

export default styleComponent
