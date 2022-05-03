/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import React, { useMemo, forwardRef } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { config, omit, pick, compose, render } from '@vitus-labs/core'
import { useLocalContext } from '~/context/localContext'
import { useRef, useTheme } from '~/hooks'
import { createLocalProvider, rocketstyleAttrsHoc } from '~/internal'
import {
  createStaticsChainingEnhancers,
  createStaticsEnhancers,
} from '~/utils/statics'
import {
  getTheme,
  getThemeMode,
  themeModeCallback,
  getThemeFromChain,
  getDimensionThemes,
} from '~/utils/theme'
import { orOptions, chainReservedOptions } from '~/utils/chaining'
import { calculateHocsFuncs } from '~/utils/compose'
import { calculateStyles } from '~/utils/styles'
import { getDimensionsMap } from '~/utils/dimensions'
import {
  pickStyledAttrs,
  calculateStylingAttrs,
  calculateChainOptions,
} from '~/utils/attrs'
import {
  PSEUDO_KEYS,
  CONFIG_KEYS,
  STYLING_KEYS,
} from '~/constants/reservedKeys'

import type { RocketStyleComponent } from '~/types/rocketstyle'
import type { Configuration } from '~/types/configuration'
import type { RocketComponent } from '~/types/rocketComponent'

// --------------------------------------------------------
// cloneAndEnhance
// helper function which allows function chaining
// always returns rocketComponent with static functions
// assigned
// --------------------------------------------------------
type CloneAndEnhance = (
  opts: Partial<Configuration>,
  defaultOpts: Configuration
) => ReturnType<typeof rocketComponent>

const cloneAndEnhance: CloneAndEnhance = (opts, defaultOpts) =>
  rocketComponent({
    ...defaultOpts,
    statics: { ...defaultOpts.statics, ...opts.statics },
    compose: { ...defaultOpts.compose, ...opts.compose },
    ...orOptions(CONFIG_KEYS, opts, defaultOpts),
    ...chainReservedOptions(
      [...defaultOpts.dimensionKeys, ...STYLING_KEYS],
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
const rocketComponent: RocketComponent<any> = (options) => {
  const { component, styles } = options
  const { styled } = config

  // const _calculateChainOptions = calculateChainOptions(options.attrs)
  const _calculateStylingAttrs = calculateStylingAttrs({
    multiKeys: options.multiKeys,
    useBooleans: options.useBooleans,
  })

  const componentName =
    options.name || options.component.displayName || options.component.name

  // create styled component with all options.styles if available
  const STYLED_COMPONENT =
    component.IS_ROCKETSTYLE || options.styled === false
      ? component
      : styled(component)`
          ${calculateStyles(styles)};
        `

  // --------------------------------------------------------
  // COMPONENT - Final component to be rendered
  // --------------------------------------------------------
  const RenderComponent = options.provider
    ? createLocalProvider(STYLED_COMPONENT)
    : STYLED_COMPONENT

  // --------------------------------------------------------
  // THEME - Calculated theme
  // --------------------------------------------------------
  const __MEMOIZED_BASE_THEME__ = new WeakMap()
  const __MEMOIZED_DIMENSION_THEME__ = new WeakMap()
  const __MEMOIZED_MODE_BASE_THEME__ = {
    light: new WeakMap(),
    dark: new WeakMap(),
  }
  const __MEMOIZED_MODE_DIMENSION_THEME__ = {
    light: new WeakMap(),
    dark: new WeakMap(),
  }

  // --------------------------------------------------------
  // COMPOSE - high-order components
  // --------------------------------------------------------
  const hocsFuncs = [
    rocketstyleAttrsHoc(options),
    ...calculateHocsFuncs(options.compose),
  ] as ((arg: any) => any)[]

  // --------------------------------------------------------
  // ENHANCED COMPONENT (returned component)
  // --------------------------------------------------------
  // .attrs() chaining option is calculated in HOC and passed as props already
  const EnhancedComponent = forwardRef(
    (
      {
        // @ts-ignore
        $rocketstyleRef, // it's forwarded from HOC which is always on top of all hocs
        ...props
      },
      ref
    ) => {
      // --------------------------------------------------
      // handle refs
      // (1) one is passed from inner HOC - $rocketstyleRef
      // (2) second one is used to be used directly (e.g. inside hocs)
      // --------------------------------------------------
      const internalRef = useRef({ $rocketstyleRef, ref })

      // --------------------------------------------------
      // hover - focus - pressed state passed via context from parent component
      // --------------------------------------------------
      const localCtx = useLocalContext(options.consumer)

      // --------------------------------------------------
      // general theme and theme mode dark / light passed in context
      // --------------------------------------------------
      const { theme, mode } = useTheme(options)

      // --------------------------------------------------
      // calculate themes for all defined styling dimensions
      // .theme(...) + defined dimensions like .states(...), .sizes(...), etc.
      // --------------------------------------------------

      // --------------------------------------------------
      // BASE / DEFAULT THEME Object
      // --------------------------------------------------
      const baseTheme = useMemo(
        () => {
          if (!__MEMOIZED_BASE_THEME__.has(theme)) {
            __MEMOIZED_BASE_THEME__.set(
              theme,
              getThemeFromChain(options.theme, theme)
            )
          }

          return __MEMOIZED_BASE_THEME__.get(theme)
        },
        // recalculate this only when theme mode changes dark / light
        [theme]
      )

      // --------------------------------------------------
      // DIMENSION(S) THEMES Object
      // --------------------------------------------------
      const themes = useMemo(
        () => {
          if (!__MEMOIZED_DIMENSION_THEME__.has(theme)) {
            __MEMOIZED_DIMENSION_THEME__.set(
              theme,
              getDimensionThemes(theme, options)
            )
          }

          return __MEMOIZED_DIMENSION_THEME__.get(theme)
        },
        // recalculate this only when theme object changes
        [theme]
      )

      // --------------------------------------------------
      // BASE / DEFAULT MODE THEME Object
      // --------------------------------------------------
      const currentModeBaseTheme = useMemo(
        () => {
          const helper = __MEMOIZED_MODE_BASE_THEME__[mode]

          if (!helper.has(baseTheme)) {
            helper.set(baseTheme, getThemeMode(baseTheme, mode))
          }

          return helper.get(baseTheme)
        },
        // recalculate this only when theme mode changes dark / light
        [mode, baseTheme]
      )

      // --------------------------------------------------
      // DIMENSION(S) MODE THEMES Object
      // --------------------------------------------------
      const currentModeThemes = useMemo(
        () => {
          const helper = __MEMOIZED_MODE_DIMENSION_THEME__[mode]

          if (!helper.has(themes)) {
            helper.set(themes, getThemeMode(themes, mode))
          }

          return helper.get(themes)
        },
        // recalculate this only when theme mode changes dark / light
        [mode, themes]
      )

      // --------------------------------------------------
      // calculate reserved Keys defined in dimensions as styling keys
      // there is no need to calculate this each time - keys are based on
      // dimensions definitions
      // --------------------------------------------------
      const { keysMap: dimensions, keywords: reservedPropNames } = useMemo(
        () =>
          getDimensionsMap({
            themes,
            useBooleans: options.useBooleans,
          }),
        []
      )

      const RESERVED_STYLING_PROPS_KEYS = useMemo(
        () => Object.keys(reservedPropNames),
        []
      )

      // --------------------------------------------------
      // get final props which are (latest has the highest priority):
      // (1) merged styling from context,
      // (2) `attrs` chaining method, and from
      // (3) passing them directly to component
      // --------------------------------------------------
      const { pseudo, ...mergeProps } = {
        ...localCtx,
        ...props,
      }

      // --------------------------------------------------
      // pseudo rocket state
      // calculate final component pseudo state including pseudo state
      // from props and override by pseudo props from context
      // --------------------------------------------------
      const pseudoRocketstate = {
        ...pseudo,
        ...pick(props, PSEUDO_KEYS),
      }

      // --------------------------------------------------
      // rocketstate
      // calculate final component state including pseudo state
      // passed as $rocketstate prop
      // --------------------------------------------------
      const rocketstate = _calculateStylingAttrs({
        props: pickStyledAttrs(mergeProps, reservedPropNames),
        dimensions,
      })

      const finalRocketstate = { ...rocketstate, pseudo: pseudoRocketstate }

      // --------------------------------------------------
      // rocketstyle
      // calculated (based on styling props) final theme which will be passed
      // to our styled component
      // passed as $rocketstyle prop
      // --------------------------------------------------
      const rocketstyle = getTheme({
        rocketstate,
        themes: currentModeThemes,
        baseTheme: currentModeBaseTheme,
      })

      // --------------------------------------------------
      // final props
      // final props passed to WrappedComponent
      // excluding: styling props
      // including: $rocketstyle, $rocketstate
      // --------------------------------------------------
      const finalProps = {
        // this removes styling state from props and passes its state
        // under rocketstate key only
        ...omit(mergeProps, [...RESERVED_STYLING_PROPS_KEYS, ...PSEUDO_KEYS]),
        // if enforced to pass styling props, we pass them directly
        ...(options.passProps ? pick(mergeProps, options.passProps) : {}),
        ref: ref || $rocketstyleRef ? internalRef : undefined,
        // state props passed to styled component only, therefore the `$` symbol
        $rocketstyle: rocketstyle,
        $rocketstate: finalRocketstate,
      }

      // all the development stuff injected
      if (process.env.NODE_ENV !== 'production') {
        finalProps['data-rocketstyle'] = componentName
      }

      return <RenderComponent {...finalProps} />
    }
  )

  // ------------------------------------------------------
  // This will hoist and generate dynamically next static methods
  // for all dimensions available in configuration
  // ------------------------------------------------------
  const RocketComponent = compose(...hocsFuncs)(EnhancedComponent)
  RocketComponent.IS_ROCKETSTYLE = true
  RocketComponent.displayName = componentName

  hoistNonReactStatics(RocketComponent, options.component)

  // ------------------------------------------------------
  // enhance for chaining methods
  // ------------------------------------------------------
  createStaticsChainingEnhancers({
    context: RocketComponent,
    dimensionKeys: options.dimensionKeys,
    func: cloneAndEnhance,
    options,
  })

  // ------------------------------------------------------
  RocketComponent.IS_ROCKETSTYLE = true
  RocketComponent.displayName = componentName
  RocketComponent.is = {}
  // ------------------------------------------------------

  // ------------------------------------------------------
  // enhance for statics
  // ------------------------------------------------------
  createStaticsEnhancers({
    context: RocketComponent.is,
    opts: options.statics,
  })

  RocketComponent.config = (opts = {}) => {
    const result = pick(opts, CONFIG_KEYS)

    return cloneAndEnhance(result, options as Configuration)
  }

  RocketComponent.statics = (opts = {}) =>
    cloneAndEnhance({ statics: opts }, options as Configuration)

  RocketComponent.getStaticDimensions = (theme) => {
    const themes = useTheme({ theme, options, cb: themeModeCallback })

    return {
      dimensions: themes.dimensions,
      useBooleans: options.useBooleans,
      multiKeys: options.multiKeys,
    }
  }

  RocketComponent.getDefaultAttrs = (props, theme, mode) => {
    const result = calculateChainOptions(options.attrs)([
      props,
      theme,
      {
        render,
        mode,
        isDark: mode === 'light',
        isLight: mode === 'dark',
      },
    ])

    return result
  }

  return RocketComponent as RocketStyleComponent
}

export default rocketComponent
