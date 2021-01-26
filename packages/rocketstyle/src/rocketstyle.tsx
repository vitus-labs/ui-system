import hoistNonReactStatics from 'hoist-non-react-statics'
import { config, omit, pick, compose, renderContent } from '@vitus-labs/core'
import React, {
  createContext,
  forwardRef,
  useEffect,
  useMemo,
  useContext,
  ReactNode,
} from 'react'

import {
  chainOptions,
  calculateChainOptions,
  calculateStyles,
  calculateStyledAttrs,
  calculateTheme,
} from './utils'
import {
  RESERVED_OR_KEYS,
  RESERVED_CLONED_KEYS,
  RESERVED_STATIC_KEYS,
} from './constants'
import useTheme from './hooks/useTheme'
import usePseudoState from './hooks/usePseudoState'
import type {
  RocketComponent,
  StyleComponent,
  Configuration,
  PseudoState,
} from './types'

type TContext = Partial<
  {
    pseudo: PseudoState
  } & Record<string, unknown>
>

const Context = createContext<TContext>({})

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
    // eslint-disable-next-line no-param-reassign
    context[item] = (props) => func({ [item]: props }, opts)
  })
}

// --------------------------------------------------------
// cloneAndEnhance
// helper function which allows function chaining
// always returns styleComponent with static functions
// assigned
// --------------------------------------------------------
type CloneAndEnhance = <A extends Configuration, B extends Configuration>(
  opts: A,
  defaultOpts: B
) => ReturnType<typeof styleComponent>

const cloneAndEnhance: CloneAndEnhance = (opts, defaultOpts) =>
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
const styleComponent: StyleComponent = (options) => {
  const { component, styles } = options
  const { styled } = config

  const componentName =
    options.name || options.component.displayName || options.component.name

  // create styled component with all options.styles if available
  const STYLED_COMPONENT = component.IS_ROCKETSTYLE
    ? component
    : styled(component)`
        ${calculateStyles(styles, config.css)}
      `

  // --------------------------------------------------------
  // ENHANCED COMPONENT (returned component)
  // --------------------------------------------------------
  // @ts-ignore
  const EnhancedComponent: RocketComponent = forwardRef(
    // @ts-ignore
    ({ onMount, ...props }, ref) => {
      // general theme passed in context
      const theme = useContext(config.context)

      // desctructure events used for pseudo state detection
      const {
        onMouseEnter,
        onMouseLeave,
        onMouseUp,
        onMouseDown,
        onFocus,
        onBlur,
      } = props

      // pseudo hook to detect states hover / pressed / focus
      const pseudo = usePseudoState(
        {
          onMouseEnter,
          onMouseLeave,
          onMouseUp,
          onMouseDown,
          onFocus,
          onBlur,
        },
        options.provider
      )

      // calculate themes for all possible styling dimensions
      // eslint-disable-next-line no-underscore-dangle
      const __ROCKETSTYLE__ = useMemo(
        () => useTheme<typeof theme>({ theme, options }),
        [theme]
      )

      const {
        reservedPropNames,
        themes,
        dimensions,
        baseTheme,
      } = __ROCKETSTYLE__

      // if onMount is provided (useful for development tooling or so)
      // it will pass all available styling options in the callback
      useEffect(() => {
        const { multiKeys, dimensionKeys, dimensionValues } = options

        if (onMount) {
          onMount({
            multiKeys,
            dimensionKeys,
            dimensionValues,
            ...__ROCKETSTYLE__,
          })
        }
      }, [theme])

      type FinalElement = (ctxData?: Record<string, unknown>) => ReactNode

      const finalElement: FinalElement = (ctxData = {}) => {
        // first we need to calculate final props which are
        // being returned by using `attr` chaining method
        const calculatedAttrs = calculateChainOptions(
          options.attrs,
          [
            props,
            theme,
            {
              renderContent,
            },
          ],
          false
        )

        // get final props which are
        // (1) merged from context,
        // (2) `attrs` chaining method, and from
        // (3) passing them directly to component
        const componentProps = {
          ...ctxData,
          ...calculatedAttrs,
          ...props,
        }

        const styledProps = calculateStyledAttrs({
          props: componentProps,
          multiKeys: options.multiKeys,
          dimensions,
          useBooleans: options.useBooleans,
        })

        // final component state including pseudo state
        const rocketstate = {
          ...styledProps,
        }

        if (options.provider) {
          rocketstate.pseudo = pseudo.state
        }

        // if (options.useBooleans) {
        //   Object.values(styledProps).forEach((item) => {
        //     if (Array.isArray(item)) {
        //       item.forEach((item) => {
        //         rocketstate[item] = true
        //       })
        //     } else {
        //       rocketstate[item] = true
        //     }
        //   })
        // }

        // calculated final theme which will be passed to our styled component
        // under $rocketstyle prop
        const rocketstyle = calculateTheme({
          props: styledProps,
          themes,
          baseTheme,
        })

        const passProps = {
          // this removes styling state from props and passes its state
          // under rocketstate key only
          ...omit(componentProps, [...reservedPropNames, 'pseudo']),
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
            {(value) => finalElement(options.consumer((cb) => cb(value)))}
          </Context.Consumer>
        )
      }

      return finalElement()
    }
  )

  EnhancedComponent.IS_ROCKETSTYLE = true
  EnhancedComponent.displayName = componentName
  let ExtendedComponent = EnhancedComponent

  const composeFuncs = Object.values(options.compose || {})
  if (composeFuncs.length > 0) {
    ExtendedComponent = compose(...composeFuncs)(ExtendedComponent)
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

  return ExtendedComponent as RocketComponent
}

export default styleComponent
