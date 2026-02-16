'use client'

/**
 * Hook that resolves a CSSResult template with props, injects CSS
 * into the shared stylesheet, and returns the className.
 *
 * Same injection strategy as styled() — useInsertionEffect on client,
 * direct sheet.insert() on SSR — but without the component wrapper.
 * Use this when you need computed CSS class names on plain elements
 * without the overhead of a styled component layer.
 */
import { useInsertionEffect, useRef } from 'react'
import { type CSSResult, normalizeCSS, resolve } from './resolve'
import { sheet } from './sheet'
import { useTheme } from './ThemeProvider'

const IS_SERVER = typeof document === 'undefined'

export function useCSS(
  template: CSSResult,
  props?: Record<string, any>,
  boost?: boolean,
): string {
  const theme = useTheme()
  const allProps = theme ? { ...props, theme } : (props ?? {})
  const cssText = normalizeCSS(
    resolve(template.strings, template.values, allProps),
  )

  const cacheRef = useRef({ css: '', className: '' })
  let className: string

  if (cssText === cacheRef.current.css) {
    className = cacheRef.current.className
  } else {
    if (cssText.trim()) {
      className = sheet.getClassName(cssText)
      if (IS_SERVER) sheet.insert(cssText, boost)
    } else {
      className = ''
    }
    cacheRef.current = { css: cssText, className }
  }

  useInsertionEffect(() => {
    if (cssText.trim()) sheet.insert(cssText, boost)
  }, [cssText, boost])

  return className
}
