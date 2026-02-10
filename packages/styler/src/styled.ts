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
 * - useInsertionEffect for safe concurrent-mode style injection
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
  useInsertionEffect,
  useRef,
} from 'react'

import { filterProps } from './forward'
import { type Interpolation, resolve } from './resolve'
import { isDynamic } from './shared'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

type Tag = string | ComponentType<any>

const IS_SERVER = typeof document === 'undefined'

export interface StyledOptions {
  /** Custom prop filter. Return true to forward the prop to the DOM element. */
  shouldForwardProp?: (prop: string) => boolean
}

const getDisplayName = (tag: Tag): string =>
  typeof tag === 'string'
    ? tag
    : (tag as ComponentType).displayName ||
      (tag as ComponentType).name ||
      'Component'

const mergeClassNames = (
  generated: string,
  user: string | undefined,
): string => {
  if (!user) return generated
  if (!generated) return user
  return `${generated} ${user}`
}

const applyPropFilter = (
  props: Record<string, unknown>,
  customFilter?: (prop: string) => boolean,
): Record<string, unknown> => {
  if (customFilter) {
    const filtered: Record<string, unknown> = {}
    for (const key in props) {
      if (customFilter(key)) {
        filtered[key] = props[key]
      }
    }
    return filtered
  }
  return filterProps(props)
}

const createStyledComponent = (
  tag: Tag,
  strings: TemplateStringsArray,
  values: Interpolation[],
  options?: StyledOptions,
) => {
  const hasDynamicValues = values.some(isDynamic)
  const customFilter = options?.shouldForwardProp

  // STATIC FAST PATH: no function interpolations → compute class once at creation time
  if (!hasDynamicValues) {
    const cssText = resolve(strings, values, {})
    const staticClassName = cssText.trim() ? sheet.insert(cssText) : ''

    const staticRule = staticClassName ? `.${staticClassName}{${cssText}}` : ''

    const StaticStyled = forwardRef<unknown, Record<string, any>>(
      ({ as: asProp, className: userCls, ...props }, ref) => {
        const finalTag = asProp || tag
        const finalCls = mergeClassNames(staticClassName, userCls)
        const finalProps =
          typeof finalTag === 'string'
            ? applyPropFilter(props, customFilter)
            : props

        const el = createElement(finalTag, {
          ...finalProps,
          className: finalCls || undefined,
          ref,
        })

        // Render inline <style> alongside element for SSR + hydration match
        if (staticRule) {
          return createElement(
            Fragment,
            null,
            createElement('style', {
              'data-vl': '',
              dangerouslySetInnerHTML: { __html: staticRule },
            }),
            el,
          )
        }

        return el
      },
    )

    StaticStyled.displayName = `styled(${getDisplayName(tag)})`
    return StaticStyled
  }

  // DYNAMIC PATH: resolve on every render, cache by CSS string identity.
  // useInsertionEffect injects the rule before DOM paint.
  const DynamicStyled = forwardRef<unknown, Record<string, any>>(
    ({ as: asProp, className: userCls, ...props }, ref) => {
      const theme = useTheme()
      const allProps = { ...props, theme }
      const cssText = resolve(strings, values, allProps)

      const lastCssRef = useRef('')
      const lastClsRef = useRef('')
      const insertedRef = useRef(false)

      let className: string
      if (cssText === lastCssRef.current) {
        // Cache hit: same CSS string → reuse last className
        className = lastClsRef.current
      } else {
        // Cache miss: compute new className
        className = cssText.trim() ? sheet.getClassName(cssText) : ''
        lastCssRef.current = cssText
        lastClsRef.current = className
        insertedRef.current = false
      }

      // SSR: insert immediately during render (useInsertionEffect doesn't run on server)
      if (IS_SERVER) {
        if (!insertedRef.current && cssText.trim()) {
          sheet.insert(cssText)
          insertedRef.current = true
        }
      }

      // Track whether useInsertionEffect has run (client-only, after hydration)
      const mountedRef = useRef(false)

      // Client: inject in useInsertionEffect (before DOM paint, concurrent-mode safe).
      // Skip entirely when CSS hasn't changed (insertedRef stays true).
      useInsertionEffect(() => {
        mountedRef.current = true
        if (!insertedRef.current && lastCssRef.current.trim()) {
          sheet.insert(lastCssRef.current)
          insertedRef.current = true
        }
      })

      const finalTag = asProp || tag
      const finalCls = mergeClassNames(className, userCls)
      const finalProps =
        typeof finalTag === 'string'
          ? applyPropFilter(props, customFilter)
          : props

      const el = createElement(finalTag, {
        ...finalProps,
        className: finalCls || undefined,
        ref,
      })

      // Render inline <style> on first render (SSR + hydration match).
      // After useInsertionEffect fires, the sheet handles styles.
      if (!mountedRef.current && className) {
        return createElement(
          Fragment,
          null,
          createElement('style', {
            'data-vl': '',
            dangerouslySetInnerHTML: {
              __html: `.${className}{${cssText}}`,
            },
          }),
          el,
        )
      }

      return el
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
