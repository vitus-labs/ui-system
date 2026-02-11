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
  forwardRef,
  useInsertionEffect,
  useRef,
} from 'react'

import { filterProps } from './forward'
import { type Interpolation, normalizeCSS, resolve } from './resolve'
import { isDynamic } from './shared'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

type Tag = string | ComponentType<any>

const IS_SERVER = typeof document === 'undefined'

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
  const boost = options?.boost ?? false

  // STATIC FAST PATH: no function interpolations → compute class once at creation time
  if (!hasDynamicValues) {
    const cssText = normalizeCSS(resolve(strings, values, {}))
    const staticClassName = cssText.trim() ? sheet.insert(cssText, boost) : ''

    const StaticStyled = forwardRef<unknown, Record<string, any>>(
      ({ as: asProp, className: userCls, ...props }, ref) => {
        const finalTag = asProp || tag
        const finalCls = mergeClassNames(staticClassName, userCls)
        const finalProps =
          typeof finalTag === 'string'
            ? applyPropFilter(props, customFilter)
            : props

        return createElement(finalTag, {
          ...finalProps,
          className: finalCls || undefined,
          ref,
        })
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
      const cssText = normalizeCSS(resolve(strings, values, allProps))

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
          sheet.insert(cssText, boost)
          insertedRef.current = true
        }
      }

      // Client: inject in useInsertionEffect (before DOM paint, concurrent-mode safe).
      // Skip entirely when CSS hasn't changed (insertedRef stays true).
      useInsertionEffect(() => {
        if (!insertedRef.current && lastCssRef.current.trim()) {
          sheet.insert(lastCssRef.current, boost)
          insertedRef.current = true
        }
      })

      const finalTag = asProp || tag
      const finalCls = mergeClassNames(className, userCls)
      const finalProps =
        typeof finalTag === 'string'
          ? applyPropFilter(props, customFilter)
          : props

      return createElement(finalTag, {
        ...finalProps,
        className: finalCls || undefined,
        ref,
      })
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
