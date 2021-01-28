import hoistNonReactStatics from 'hoist-non-react-statics'
import { config, omit, pick, compose, renderContent } from '@vitus-labs/core'
import React, {
  createContext,
  forwardRef,
  useEffect,
  useMemo,
  useContext,
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

  const ProviderComponent = ({
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    onMouseDown,
    onFocus,
    onBlur,
    $rocketstate,
    ...props
  }) => {
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

    const updatedState = { ...$rocketstate, pseudo: pseudo.state }

    return (
      <Context.Provider value={updatedState}>
        <STYLED_COMPONENT
          {...props}
          {...pseudo.events}
          // @ts-ignore
          $rocketstate={updatedState}
        />
      </Context.Provider>
    )
  }

  const FinalComponent = options.provider ? ProviderComponent : STYLED_COMPONENT

  // --------------------------------------------------------
  // ENHANCED COMPONENT (returned component)
  // --------------------------------------------------------
  // @ts-ignore
  const EnhancedComponent: RocketComponent = forwardRef(
    // @ts-ignore
    ({ onMount, ...props }, ref) => {
      // general theme passed in context
      const theme = useContext(config.context)
      const rocketstyleCtx = options.consumer ? useContext(Context) : {}

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

      // first we need to calculate final props which are
      // being returned by using `attr` chaining method
      const calculatedAttrs = useMemo(
        () =>
          calculateChainOptions(
            options.attrs,
            [
              props,
              theme,
              {
                renderContent,
              },
            ],
            false
          ),
        [theme, props]
      )

      // get final props which are
      // (1) merged from context,
      // (2) `attrs` chaining method, and from
      // (3) passing them directly to component
      const mergeProps = {
        ...(options.consumer
          ? // @ts-ignore
            options.consumer((cb) => cb(rocketstyleCtx))
          : {}),
        ...calculatedAttrs,
        ...props,
      }

      // final component state including pseudo state
      const rocketstate: Record<string, unknown> = useMemo(
        () =>
          calculateStyledAttrs({
            props: mergeProps,
            multiKeys: options.multiKeys,
            dimensions,
            useBooleans: options.useBooleans,
          }),
        [mergeProps, __ROCKETSTYLE__]
      )

      // calculated final theme which will be passed to our styled component
      // under $rocketstyle prop
      const rocketstyle = useMemo(
        () =>
          calculateTheme({
            props: rocketstate,
            themes,
            baseTheme,
          }),
        [rocketstate, __ROCKETSTYLE__]
      )

      const passProps = {
        // this removes styling state from props and passes its state
        // under rocketstate key only
        ...omit(mergeProps, [...reservedPropNames, 'pseudo']),
        ref,
        $rocketstyle: rocketstyle,
        $rocketstate: rocketstate,
        'data-rocketstyle': componentName,
      }

      return <FinalComponent {...passProps} />
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
  // @ts-ignore
  ExtendedComponent.config = (opts = {}) => {
    const result = pick(opts, RESERVED_OR_KEYS)

    return cloneAndEnhance(result, options)
  }

  return ExtendedComponent as RocketComponent
}

export default styleComponent
