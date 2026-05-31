import { useCallback, useEffect, useRef, useState } from 'react'

export type UseCopyToClipboardReturn = readonly [
  copied: boolean,
  copy: (text: string) => Promise<boolean>,
  reset: () => void,
]

export type UseCopyToClipboard = (resetMs?: number) => UseCopyToClipboardReturn

/**
 * Copy text to the clipboard with a transient "copied" flag (auto-resets
 * after `resetMs`, default 2000). Falls back to the legacy
 * `document.execCommand('copy')` path on browsers without the async
 * Clipboard API (or when invoked outside a user gesture / on an HTTP
 * origin where the API rejects).
 *
 * @example
 * ```tsx
 * const [copied, copy] = useCopyToClipboard()
 * <button onClick={() => copy('hello')}>{copied ? '✓ Copied' : 'Copy'}</button>
 * ```
 */
const useCopyToClipboard: UseCopyToClipboard = (resetMs = 2000) => {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setCopied(false)
  }, [])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let ok = false
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          ok = true
        } else if (typeof document !== 'undefined') {
          // Legacy fallback for non-secure contexts / older browsers.
          const ta = document.createElement('textarea')
          ta.value = text
          ta.setAttribute('readonly', '')
          ta.style.position = 'absolute'
          ta.style.left = '-9999px'
          document.body.appendChild(ta)
          ta.select()
          // biome-ignore lint/suspicious/noExplicitAny: deprecated API, no current types
          ok = (document as any).execCommand('copy') === true
          document.body.removeChild(ta)
        }
      } catch {
        ok = false
      }

      if (ok) {
        setCopied(true)
        if (timerRef.current !== null) clearTimeout(timerRef.current)
        if (resetMs > 0) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null
            setCopied(false)
          }, resetMs)
        }
      }
      return ok
    },
    [resetMs],
  )

  // Clean up the reset timer on unmount.
  useEffect(
    () => () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    },
    [],
  )

  return [copied, copy, reset] as const
}

export default useCopyToClipboard
