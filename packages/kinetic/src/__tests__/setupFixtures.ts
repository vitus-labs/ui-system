/**
 * Shared test fixtures for kinetic component tests.
 *
 * - `setupMatchMedia()` — install a window.matchMedia mock (always non-matching).
 *   Required because `useReducedMotion` → `useMediaQuery` reads matchMedia at mount.
 *
 * - `setupRaf()` — replace requestAnimationFrame with a controllable queue + fake
 *   timers. Returns `{ flushRaf }` to manually run queued callbacks. Restores the
 *   originals automatically on the next `afterEach`.
 *
 * - `fireTransitionEnd(el)` — dispatch a `transitionend` event with the element
 *   set as the event target (jsdom doesn't auto-set target on synthetic events).
 *
 * Usage:
 *   ```ts
 *   import { setupMatchMedia, setupRaf, fireTransitionEnd } from './setupFixtures'
 *
 *   setupMatchMedia()
 *   const { flushRaf } = setupRaf()
 *   ```
 */

/** Install a non-matching matchMedia mock. Call from a test file's top level. */
export const setupMatchMedia = () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })
}

/**
 * Install a controllable rAF queue + fake timers, restored after each test.
 * Returns a `flushRaf()` helper that runs (and clears) all queued callbacks.
 */
export const setupRaf = () => {
  let rafCallbacks: (() => void)[] = []
  const originalRaf = globalThis.requestAnimationFrame
  const originalCaf = globalThis.cancelAnimationFrame

  beforeEach(() => {
    vi.useFakeTimers()
    rafCallbacks = []

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: () => void) => {
        rafCallbacks.push(cb)
        return rafCallbacks.length
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.stubGlobal('requestAnimationFrame', originalRaf)
    vi.stubGlobal('cancelAnimationFrame', originalCaf)
  })

  const flushRaf = () => {
    const cbs = [...rafCallbacks]
    rafCallbacks = []
    for (const cb of cbs) cb()
  }

  return { flushRaf }
}

/** Dispatch a `transitionend` event on `el` with `target` set (jsdom workaround). */
export const fireTransitionEnd = (el: HTMLElement) => {
  const event = new Event('transitionend', { bubbles: true })
  Object.defineProperty(event, 'target', { value: el })
  el.dispatchEvent(event)
}

/** Dispatch an `animationend` event on `el` with `target` set (jsdom workaround). */
export const fireAnimationEnd = (el: HTMLElement) => {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'target', { value: el })
  el.dispatchEvent(event)
}
