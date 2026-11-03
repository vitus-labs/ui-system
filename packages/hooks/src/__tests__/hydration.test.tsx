/**
 * Regression: hooks that read browser state (matchMedia, innerWidth,
 * localStorage) used to read it in `useState` initializers. The server
 * rendered the defaults, the hydrating client's first render read the real
 * values, and React threw "Hydration failed …" (recoverable error + full
 * client re-render). They now use `useSyncExternalStore` with a server
 * snapshot, so hydration renders the server values and React re-renders
 * with the real ones right after.
 */
import { Provider } from '@vitus-labs/core'
import { act, createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import useBreakpoint from '../useBreakpoint'
import useColorScheme from '../useColorScheme'
import useLocalStorage from '../useLocalStorage'
import useMediaQuery from '../useMediaQuery'
import useReducedMotion from '../useReducedMotion'

const theme = { rootSize: 16, breakpoints: { xs: 0, md: 768, lg: 992 } }

const installBrowserState = () => {
  // Client environment: wide viewport, every media query matches, and a
  // persisted localStorage value — all different from the server defaults.
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: 1200,
  })
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: true,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }),
  })
  const store = new Map<string, string>([['scheme', JSON.stringify('dark')]])
  const stub = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: () => null,
    length: 0,
  }
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: stub,
  })
}

const App = () => {
  const mq = useMediaQuery('(min-width: 1px)')
  const bp = useBreakpoint()
  const [stored] = useLocalStorage('scheme', 'light')
  const scheme = useColorScheme()
  const reduced = useReducedMotion()
  return createElement(
    'p',
    null,
    `mq=${mq} bp=${bp} ls=${stored} cs=${scheme} rm=${reduced}`,
  )
}

const Root = () => createElement(Provider as any, { theme }, createElement(App))

// What a real server (no window) renders.
const SERVER_TEXT = 'mq=false bp=xs ls=light cs=light rm=false'
const CLIENT_TEXT = 'mq=true bp=lg ls=dark cs=dark rm=true'

let host: HTMLDivElement
let prevAct: unknown

beforeEach(() => {
  prevAct = (globalThis as any).IS_REACT_ACT_ENVIRONMENT
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
  installBrowserState()
  host = document.createElement('div')
  document.body.appendChild(host)
})

afterEach(() => {
  host.remove()
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = prevAct
})

describe('SSR hydration', () => {
  it('server render uses the server-safe defaults even when window exists', () => {
    const html = renderToString(createElement(Root))
    expect(html).toContain(SERVER_TEXT)
  })

  it('hydrates server markup without a mismatch, then syncs to client values', async () => {
    // Markup a real (window-less) server produces. renderToString under
    // jsdom can't stand in for it — jsdom has a window, so the old
    // useState-initializer code read browser state even "on the server".
    host.innerHTML = `<p>${SERVER_TEXT}</p>`
    const errors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => {
      root = hydrateRoot(host, createElement(Root), {
        onRecoverableError: (e) => errors.push(e),
      })
    })
    expect(errors).toEqual([])
    expect(host.textContent).toBe(CLIENT_TEXT)
    act(() => root?.unmount())
  })

  it('client-only render gets the real values on the first render', async () => {
    const seen: string[] = []
    const Probe = () => {
      const mq = useMediaQuery('(min-width: 1px)')
      const bp = useBreakpoint()
      const [stored] = useLocalStorage('scheme', 'light')
      seen.push(`${mq} ${bp} ${stored}`)
      return null
    }
    const root = createRoot(host)
    await act(async () => {
      root.render(
        createElement(Provider as any, { theme }, createElement(Probe)),
      )
    })
    expect(seen[0]).toBe('true lg dark')
    act(() => root.unmount())
  })
})
