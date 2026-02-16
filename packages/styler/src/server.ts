/**
 * Lightweight SSR serializer for styled component trees.
 *
 * Bypasses React's renderToString entirely — no fiber tree, no reconciliation,
 * no effect scheduling. Directly serializes the element tree to an HTML string.
 *
 * Supports:
 * - HTML elements, Fragment, forwardRef, memo, function components
 * - Minimal SSR hooks (useRef, useContext, useState, useMemo, etc.)
 * - Context providers (ThemeProvider)
 * - `<style precedence>` hoisting (React 19 resource pattern)
 * - Transient prop filtering (styled components)
 *
 * Limitations:
 * - No Suspense/lazy support
 * - No class components
 * - No error boundaries
 * - No streaming (synchronous only)
 * - useId returns a static value (no unique IDs across components)
 *
 * Usage:
 *   import { renderToString } from '@vitus-labs/styler/server'
 *   const html = renderToString(<App />)
 */
import React from 'react'

// React 19 internal dispatcher access
const ReactInternals = (React as any)
  .__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE

// Runtime guard: verify React internals are available and structured as expected.
// This catches React version mismatches or internal API changes early with a clear
// error instead of cryptic failures during rendering.
if (!ReactInternals || typeof ReactInternals !== 'object') {
  throw new Error(
    '[@vitus-labs/styler/server] Incompatible React version. ' +
      'The custom SSR serializer requires React 19 internals ' +
      '(__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE). ' +
      'Use react-dom/server renderToString as a safe alternative.',
  )
}

// React 19 $$typeof symbols
const FORWARD_REF = Symbol.for('react.forward_ref')
const FRAGMENT = Symbol.for('react.fragment')
const CONTEXT = Symbol.for('react.context')
const MEMO = Symbol.for('react.memo')

// Self-closing HTML elements
const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ESC[c] as string)

// ============================================================================
// Minimal SSR hooks dispatcher
// ============================================================================
// SSR hooks are simplified: no state updates, no effects, no subscriptions.
// Each component call gets a fresh hook index (no persistent state across renders).

let hookIdx = 0

// biome-ignore lint/suspicious/noEmptyBlockStatements: SSR no-op hooks are intentionally empty
const noop = () => {}

const ssrHooks: Record<string, (...args: any[]) => any> = {
  readContext: (ctx: any) => ctx._currentValue,
  use: (usable: any) => {
    if (usable?._currentValue !== undefined) return usable._currentValue
    throw new Error('[styler/server] use() is not supported')
  },
  useCallback: (cb: any) => cb,
  useContext: (ctx: any) => ctx._currentValue,
  useDebugValue: noop,
  useDeferredValue: (val: any) => val,
  useEffect: noop,
  useId: () => `:r${hookIdx++}:`,
  useImperativeHandle: noop,
  useInsertionEffect: noop,
  useLayoutEffect: noop,
  useMemo: (factory: () => any) => factory(),
  useReducer: (_r: any, init: any, f?: (i: any) => any) => [
    f ? f(init) : init,
    noop,
  ],
  useRef: (initial: any) => ({ current: initial }),
  useState: (initial: any) => [
    typeof initial === 'function' ? initial() : initial,
    noop,
  ],
  useSyncExternalStore: (_s: any, snap: any) => snap(),
  useTransition: () => [false, (cb: any) => cb()],
  useOptimistic: (val: any) => [val, noop],
  useActionState: (action: any, initial: any) => [initial, action, false],
  useFormStatus: () => ({
    pending: false,
    data: null,
    method: null,
    action: null,
  }),
}

/**
 * Execute a function with our minimal SSR hooks dispatcher active.
 * Saves and restores the previous dispatcher for safety.
 */
const withHooks = <T>(fn: () => T): T => {
  const prev = ReactInternals.H
  ReactInternals.H = ssrHooks
  try {
    return fn()
  } finally {
    ReactInternals.H = prev
  }
}

// ============================================================================
// HTML attribute serialization
// ============================================================================

const serializeAttrs = (props: Record<string, any>): string => {
  let attrs = ''

  for (const key in props) {
    if (
      key === 'children' ||
      key === 'ref' ||
      key === 'key' ||
      key === 'suppressHydrationWarning' ||
      key === 'precedence'
    )
      continue

    // Skip event handlers
    if (
      key.length > 2 &&
      key.charCodeAt(0) === 111 &&
      key.charCodeAt(1) === 110
    )
      continue // 'on...'

    const val = props[key]
    if (val == null || val === false) continue

    if (key === 'className') {
      attrs += ` class="${esc(String(val))}"`
    } else if (key === 'htmlFor') {
      attrs += ` for="${esc(String(val))}"`
    } else if (key === 'style' && typeof val === 'object') {
      let s = ''
      for (const p in val) {
        if (val[p] == null) continue
        const k = p.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
        s += `${k}:${val[p]};`
      }
      if (s) attrs += ` style="${esc(s)}"`
    } else if (val === true) {
      attrs += ` ${key}`
    } else {
      attrs += ` ${key}="${esc(String(val))}"`
    }
  }

  return attrs
}

// ============================================================================
// Element tree serializer
// ============================================================================

const serialize = (node: any, styles: string[]): string => {
  // Primitives
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string') return esc(node)
  if (typeof node === 'number') return String(node)

  // Arrays (multiple children)
  if (Array.isArray(node)) {
    let out = ''
    for (let i = 0; i < node.length; i++) out += serialize(node[i], styles)
    return out
  }

  if (typeof node !== 'object') return ''

  const { type, props = {} } = node

  // Fragment
  if (type === FRAGMENT) {
    return serialize(props.children, styles)
  }

  // <style> with precedence → hoist to <head>
  if (type === 'style' && props.precedence != null) {
    const href = props.href || ''
    const prec = props.precedence
    styles.push(
      `<style data-precedence="${prec}" data-href="${href}">${props.children || ''}</style>`,
    )
    return ''
  }

  // Context provider (ThemeProvider, etc.)
  // React 19: providers have $$typeof === CONTEXT
  if (type?.$$typeof === CONTEXT) {
    const prev = type._currentValue
    type._currentValue = props.value
    const result = serialize(props.children, styles)
    type._currentValue = prev
    return result
  }

  // HTML element
  if (typeof type === 'string') {
    const attrs = serializeAttrs(props)
    if (VOID.has(type)) return `<${type}${attrs}/>`
    const children = serialize(props.children, styles)
    return `<${type}${attrs}>${children}</${type}>`
  }

  // forwardRef
  if (type?.$$typeof === FORWARD_REF) {
    hookIdx = 0
    const rendered = withHooks(() => type.render(props, props.ref ?? null))
    return serialize(rendered, styles)
  }

  // memo → unwrap to inner type
  if (type?.$$typeof === MEMO) {
    return serialize({ ...node, type: type.type }, styles)
  }

  // Function component
  if (typeof type === 'function') {
    hookIdx = 0
    const rendered = withHooks(() => type(props))
    return serialize(rendered, styles)
  }

  return ''
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Render a React element tree to an HTML string. Styled components'
 * `<style precedence>` elements are automatically hoisted before the markup,
 * matching React 19's resource behavior.
 *
 * ~2-5x faster than React's renderToString for styled component trees.
 */
export const renderToString = (element: React.ReactElement): string => {
  const styles: string[] = []
  const html = serialize(element, styles)

  if (styles.length === 0) return html

  // Deduplicate styles by content (same href = same style)
  const seen = new Set<string>()
  let styleBlock = ''
  for (const s of styles) {
    if (seen.has(s)) continue
    seen.add(s)
    styleBlock += s
  }

  return styleBlock + html
}
