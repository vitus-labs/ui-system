// @ts-nocheck
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, {
  createContext,
  forwardRef,
  useEffect,
  useMemo,
  useContext,
} from 'react'
import { config, omit, pick, compose, renderContent } from '@vitus-labs/core'

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
const cloneAndEnhance = (opts, defaultOpts = {}) =>
  styleComponent({
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
const styleComponent = (options) => {
  const { component, styles } = options

  const componentName =
    options.name || options.component.displayName || options.component.name

  // create styled component with all options.styles if available
  const STYLED_COMPONENT = config.styled(component)`
    ${calculateStyles(styles, config.css)}
  `

  // --------------------------------------------------------
  // ENHANCED COMPONENT (returned component)
  // --------------------------------------------------------
  const EnhancedComponent = forwardRef(({ onMount, ...props }, ref) => {
    const theme = useContext(config.context)
    const pseudo = usePseudoState(props)

    const {
      __ROCKETSTYLE__: { KEYWORDS, keys, themes },
    } = useMemo(() => useTheme({ theme, options }), [theme])

    // if onMount is provided (useful for development tooling or so)
    useEffect(() => {
      if (onMount) {
        onMount(__ROCKETSTYLE__)
      }
    }, [])

    const finalElement = (ctxData = {}) => {
      const calculatedAttrs = calculateChainOptions(
        options.attrs,
        props,
        theme,
        {
          renderContent,
        }
      )

      const newProps = {
        ...ctxData,
        ...calculatedAttrs,
        ...props,
      }

      const styledAttributes = calculateStyledAttrs({
        props: pick(newProps, KEYWORDS),
        states: keys,
        dimensions: options.dimensions,
        useBooleans: options.useBooleans,
      })

      const rocketstate = {
        ...styledAttributes,
        pseudo: pseudo.pseudoState,
      }

      Object.values(styledAttributes).forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((item) => {
            rocketstate[item] = true
          })
        } else {
          rocketstate[item] = true
        }
      })

      // calculated final theme which will be passed to styled component
      const rocketstyle = calculateTheme({
        styledAttributes,
        themes,
        config: options,
      })

      const passProps = {
        // this removes styling state from props and passes its state
        // under rocketstate key only
        ...omit(newProps, KEYWORDS),
        ...(options.provider ? pseudo.events : {}),
        ref,
        $rocketstyle: rocketstyle,
        $rocketstate: rocketstate,
        'data-rocketstyle': componentName,
      }

      const renderedComponent = renderContent(STYLED_COMPONENT, passProps)

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

  let ExtendedComponent = EnhancedComponent

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
  ExtendedComponent.config = (opts = {}) => {
    const result = pick(opts, RESERVED_OR_KEYS)

    return cloneAndEnhance(result, options)
  }

  return ExtendedComponent
}

export default styleComponent
