'use client'

import {
  createElement,
  forwardRef,
  type ComponentType,
  type FC,
  type ReactNode,
} from 'react'
import type { HTMLTags } from '~/html'

// ---------------------------------------------------------------------------
// CSSEngineConnector — the interface every connector package must satisfy
// ---------------------------------------------------------------------------

/**
 * Describes the shape of a CSS-in-JS engine connector.
 * Packages like `@vitus-labs/connector-styler`, `@vitus-labs/connector-emotion`,
 * and `@vitus-labs/connector-styled-components` export this shape.
 *
 * Required properties (`css`, `styled`, `provider`) are consumed by config
 * across all packages. Optional properties (`keyframes`, `createGlobalStyle`,
 * `useTheme`) are exposed for direct use in application code.
 */
export interface CSSEngineConnector {
  /** Tagged template for composable CSS fragments. */
  css: (strings: TemplateStringsArray, ...values: any[]) => any
  /** Component factory: `styled(tag)`\`...\`` → React component. */
  styled: ((
    tag: any,
    options?: any,
  ) => (strings: TemplateStringsArray, ...values: any[]) => any) &
    Record<string, any>
  /** ThemeProvider component wrapping children with a theme context. */
  provider: FC<{ theme: any; children: ReactNode }>
  /** Tagged template for @keyframes animations. */
  keyframes?: (strings: TemplateStringsArray, ...values: any[]) => any
  /** Factory for injecting global CSS. */
  createGlobalStyle?: (strings: TemplateStringsArray, ...values: any[]) => any
  /** Hook to read the current theme from the engine's context. */
  useTheme?: () => any
}

interface PlatformConfig {
  component: ComponentType | HTMLTags
  textComponent: ComponentType | HTMLTags
}

type InitConfig = Partial<CSSEngineConnector & PlatformConfig>

// ---------------------------------------------------------------------------
// Error helper
// ---------------------------------------------------------------------------

const notConfigured = (_name: string): never => {
  throw new Error(
    `[@vitus-labs/core] CSS engine not configured. ` +
      `Call init() with a connector before rendering.\n\n` +
      `  import { init } from '@vitus-labs/core'\n` +
      `  import * as connector from '@vitus-labs/connector-styler'\n` +
      `  init(connector)\n`,
  )
}

// ---------------------------------------------------------------------------
// Lazy styled delegate — defers styled component creation to first render
// ---------------------------------------------------------------------------

const createStyledDelegate = (self: Configuration) => {
  const createLazy = (
    tag: any,
    options: any,
    strings: TemplateStringsArray,
    values: any[],
  ) => {
    let Real: any = null

    const Lazy = forwardRef<unknown, Record<string, any>>((props, ref) => {
      if (!Real) {
        const engine = self._styled
        if (!engine) return notConfigured('styled')
        Real = options
          ? engine(tag, options)(strings, ...values)
          : engine(tag)(strings, ...values)
      }
      return createElement(Real, { ...props, ref })
    })

    Lazy.displayName = `styled(${
      typeof tag === 'string'
        ? tag
        : tag.displayName || tag.name || 'Component'
    })`

    return Lazy
  }

  const factory = (tag: any, options?: any) => {
    return (strings: TemplateStringsArray, ...values: any[]) => {
      // Fast path: engine already available → create immediately
      if (self._styled) {
        return options
          ? self._styled(tag, options)(strings, ...values)
          : self._styled(tag)(strings, ...values)
      }
      // Lazy path: defer to first render
      return createLazy(tag, options, strings, values)
    }
  }

  return new Proxy(factory as any, {
    get(_target: unknown, prop: string) {
      if (prop === 'prototype' || prop === '$$typeof') return undefined
      // styled.div`...` shorthand
      return (strings: TemplateStringsArray, ...values: any[]) => {
        if (self._styled) {
          return (self._styled as any)[prop](strings, ...values)
        }
        return createLazy(prop, undefined, strings, values)
      }
    },
  })
}

// ---------------------------------------------------------------------------
// Configuration singleton
// ---------------------------------------------------------------------------

/**
 * Singleton configuration that bridges the UI system with the chosen
 * CSS-in-JS engine. All packages reference `config.css`, `config.styled`,
 * etc. — the engine is swapped via `init()` with a connector.
 *
 * The `css` and `styled` properties are **stable delegate functions** that
 * can be safely destructured at module level (`const { styled, css } = config`).
 * They internally read the latest engine reference set by `init()`.
 *
 * When destructured before `init()` is called:
 * - `css` returns a thunk (function) that resolves at render time
 * - `styled` returns a lazy component that creates the real component on first render
 */
class Configuration {
  // Private engine references — null until init() is called
  _css: CSSEngineConnector['css'] | null = null
  _styled: CSSEngineConnector['styled'] | null = null
  _provider: CSSEngineConnector['provider'] | null = null
  _keyframes: CSSEngineConnector['keyframes'] | null = null
  _createGlobalStyle: CSSEngineConnector['createGlobalStyle'] | null = null
  _useTheme: CSSEngineConnector['useTheme'] | null = null

  // Platform defaults
  component: ComponentType | HTMLTags = 'div'
  textComponent: ComponentType | HTMLTags = 'span'

  /**
   * Stable CSS delegate. When the engine is available, delegates immediately.
   * When not (module load time before init), returns a thunk that resolves
   * at render time — all CSS-in-JS engines treat functions as interpolations.
   */
  css = (strings: TemplateStringsArray, ...values: any[]): any => {
    if (this._css) return this._css(strings, ...values)
    // Thunk — resolved at render time by the engine's interpolation handler
    return () => {
      const engine = this._css
      if (!engine) return notConfigured('css')
      return engine(strings, ...values)
    }
  }

  /**
   * Stable styled delegate (Proxy). Supports `styled(tag)` and `styled.div`.
   * When the engine is not yet available, returns a lazy forwardRef component
   * that creates the real styled component on first render.
   */
  styled: CSSEngineConnector['styled']

  /** The external ThemeProvider from the configured engine. */
  get ExternalProvider(): CSSEngineConnector['provider'] | null {
    return this._provider
  }

  /** Keyframes factory from the configured engine, or null. */
  get keyframes(): CSSEngineConnector['keyframes'] | null {
    return this._keyframes ?? null
  }

  /** Global style factory from the configured engine, or null. */
  get createGlobalStyle(): CSSEngineConnector['createGlobalStyle'] | null {
    return this._createGlobalStyle ?? null
  }

  /** Theme hook from the configured engine, or null. */
  get useTheme(): CSSEngineConnector['useTheme'] | null {
    return this._useTheme ?? null
  }

  constructor() {
    this.styled = createStyledDelegate(this)
  }

  /**
   * Initialize or swap the CSS-in-JS engine. Must be called before any
   * component renders (typically at the app entry point).
   *
   * @example
   * ```typescript
   * import { init } from '@vitus-labs/core'
   * import * as connector from '@vitus-labs/connector-styler'
   * init(connector)
   * ```
   */
  init = (props: InitConfig) => {
    if (props.css) this._css = props.css
    if (props.styled) this._styled = props.styled
    if (props.provider) this._provider = props.provider
    if (props.keyframes) this._keyframes = props.keyframes
    if (props.createGlobalStyle) this._createGlobalStyle = props.createGlobalStyle
    if (props.useTheme) this._useTheme = props.useTheme
    if (props.component) this.component = props.component
    if (props.textComponent) this.textComponent = props.textComponent
  }
}

const config = new Configuration()

const { init } = config

export default config
export { init }
