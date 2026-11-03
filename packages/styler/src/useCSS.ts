'use client'

/**
 * Hook that resolves a CSSResult template with props, injects CSS
 * into the shared stylesheet, and returns the className.
 *
 * Client: injected via useInsertionEffect, like styled(). Use this when you
 * need computed CSS class names on plain elements without the overhead of a
 * styled component layer.
 *
 * SSR limitation: the hook only returns a className, so it has no element
 * to carry a React 19 `<style precedence>` — on the server it returns the
 * (deterministic) className but emits no CSS. The rules are injected when
 * the client hydrates. Use `styled()` for content that must be styled in
 * the server HTML.
 */
import { useInsertionEffect, useRef } from 'react'
import { type CSSResult, normalizeCSS, resolve } from './resolve'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

export function useCSS(
  template: CSSResult,
  props?: Record<string, any>,
  boost?: boolean,
): string {
  const theme = useTheme()
  const allProps = props ? { ...props, theme } : { theme }
  const cssText = normalizeCSS(
    resolve(template.strings, template.values, allProps),
  )

  const cacheRef = useRef({ css: '', className: '' })
  // Single emptiness check — normalizeCSS already stripped whitespace, so
  // any non-empty cssText is meaningful. `.trim()` is O(n) and used to
  // fire three times per render; one zero-cost length check is enough.
  const hasContent = cssText.length > 0
  let className: string

  if (cssText === cacheRef.current.css) {
    className = cacheRef.current.className
  } else {
    if (hasContent) {
      // No server-side insert: nothing would ever flush the shared buffer
      // into the response, and it grew for the life of the process.
      className = sheet.getClassName(cssText, boost)
    } else {
      className = ''
    }
    cacheRef.current = { css: cssText, className }
  }

  useInsertionEffect(() => {
    if (cssText.length > 0) sheet.insert(cssText, boost)
  }, [cssText, boost])

  return className
}
