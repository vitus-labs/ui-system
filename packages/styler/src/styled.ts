'use client'

/**
 * styled() component factory. Creates React components that inject CSS
 * class names from tagged template literals.
 *
 * Supports:
 * - styled('div')`...` and styled(Component)`...`
 * - styled.div`...` (via Proxy)
 * - `as` prop for polymorphic rendering
 * - forwardRef for ref forwarding
 * - $-prefixed transient props (not forwarded to DOM)
 * - Custom shouldForwardProp for per-component prop filtering
 * - Static path optimization (templates with no dynamic interpolations)
 * - React 19 `<style precedence>` for FOUC-free SSR and static export
 *
 * CSS nesting (`&` selectors) works natively — the resolver passes CSS
 * through without transformation, so `&:hover`, `&::before`, etc. work
 * as-is in browsers supporting CSS Nesting (all modern browsers).
 */
import {
  type ComponentType,
  createElement,
  Fragment,
  forwardRef,
  useRef,
} from 'react'
import { buildProps } from './forward'
import { type Interpolation, normalizeCSS, resolve } from './resolve'
import { isDynamic } from './shared'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

type Tag = string | ComponentType<any>

export interface StyledOptions {
  /** Custom prop filter. Return true to forward the prop to the DOM element. */
  shouldForwardProp?: (prop: string) => boolean
  /**
   * Double the class selector (`.vl-abc.vl-abc`) to raise specificity
   * from (0,1,0) to (0,2,0). Ensures this component's styles override
   * inner library components regardless of CSS source order.
   */
  boost?: boolean
}

const getDisplayName = (tag: Tag): string =>
  typeof tag === 'string'
    ? tag
    : (tag as ComponentType).displayName ||
      (tag as ComponentType).name ||
      'Component'

const createStyledComponent = (
  tag: Tag,
  strings: TemplateStringsArray,
  values: Interpolation[],
  options?: StyledOptions,
) => {
  const hasDynamicValues = values.some(isDynamic)
  const customFilter = options?.shouldForwardProp
  const boost = options?.boost ?? false

  // STATIC FAST PATH: no function interpolations → compute class once at creation time
  if (!hasDynamicValues) {
    const cssText = normalizeCSS(resolve(strings, values, {}))
    const { className: staticClassName, rules: staticRules } = cssText.trim()
      ? sheet.prepare(cssText, boost)
      : { className: '', rules: '' }

    // Populate sheet cache for has() queries and legacy useServerInsertedHTML
    if (cssText.trim()) sheet.insert(cssText, boost)

    // Pre-compute the <style> element once — it's immutable (same href/rules every render)
    const cachedStyleEl = staticClassName
      ? createElement(
          'style',
          { href: staticClassName, precedence: 'medium' },
          staticRules,
        )
      : null

    const StaticStyled = forwardRef<unknown, Record<string, any>>(
      (rawProps, ref) => {
        const finalTag = rawProps.as || tag
        const isDOM = typeof finalTag === 'string'
        const finalProps = buildProps(
          rawProps,
          staticClassName,
          ref,
          isDOM,
          customFilter,
        )

        const mainEl = createElement(finalTag, finalProps)

        // Skip Fragment when there's no CSS to inject
        if (!cachedStyleEl) return mainEl
        return createElement(Fragment, null, cachedStyleEl, mainEl)
      },
    )

    StaticStyled.displayName = `styled(${getDisplayName(tag)})`
    return StaticStyled
  }

  // DYNAMIC PATH: resolve on every render. React 19's <style precedence>
  // handles injection, dedup, and cleanup automatically.
  // useRef cache avoids recomputing sheet.prepare() + createElement('style')
  // when the resolved CSS text hasn't changed between renders.
  const DynamicStyled = forwardRef<unknown, Record<string, any>>(
    (rawProps, ref) => {
      const theme = useTheme()
      const allProps = { ...rawProps, theme }
      const cssText = normalizeCSS(resolve(strings, values, allProps))

      const cacheRef = useRef<{
        css: string
        className: string
        styleEl: ReturnType<typeof createElement> | null
      }>({ css: '', className: '', styleEl: null })

      let className: string
      let styleEl: ReturnType<typeof createElement> | null

      if (cssText === cacheRef.current.css) {
        // Cache hit — reuse className and pre-built style element
        className = cacheRef.current.className
        styleEl = cacheRef.current.styleEl
      } else {
        // Cache miss — recompute
        if (cssText.trim()) {
          const prepared = sheet.prepare(cssText, boost)
          className = prepared.className
          styleEl = createElement(
            'style',
            { href: prepared.className, precedence: 'medium' },
            prepared.rules,
          )
        } else {
          className = ''
          styleEl = null
        }
        cacheRef.current = { css: cssText, className, styleEl }
      }

      const finalTag = rawProps.as || tag
      const isDOM = typeof finalTag === 'string'
      const finalProps = buildProps(
        rawProps,
        className,
        ref,
        isDOM,
        customFilter,
      )

      const mainEl = createElement(finalTag, finalProps)

      if (!styleEl) return mainEl
      return createElement(Fragment, null, styleEl, mainEl)
    },
  )

  DynamicStyled.displayName = `styled(${getDisplayName(tag)})`
  return DynamicStyled
}

/** Factory function: styled(tag) returns a tagged template function. */
const styledFactory = (tag: Tag, options?: StyledOptions) => {
  const templateFn = (
    strings: TemplateStringsArray,
    ...values: Interpolation[]
  ) => createStyledComponent(tag, strings, values, options)

  return templateFn
}

/**
 * Main styled export. Supports both calling conventions:
 * - `styled('div')` or `styled(Component)` → returns tagged template function
 * - `styled('div', { shouldForwardProp })` → with custom prop filtering
 * - `styled.div` → shorthand via Proxy (no options)
 */
export const styled: typeof styledFactory &
  Record<
    string,
    (strings: TemplateStringsArray, ...values: Interpolation[]) => any
  > = new Proxy(styledFactory as any, {
  get(_target: unknown, prop: string) {
    if (prop === 'prototype' || prop === '$$typeof') return undefined
    // styled.div`...`, styled.span`...`, etc.
    return (strings: TemplateStringsArray, ...values: Interpolation[]) =>
      createStyledComponent(prop, strings, values)
  },
})
