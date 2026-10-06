import { act, render, renderHook } from '@testing-library/react'
import { Provider } from '@vitus-labs/core'
import { type ReactNode, useRef, useState } from 'react'
import useBreakpoint from '../useBreakpoint'
import useClickOutside from '../useClickOutside'
import useCopyToClipboard from '../useCopyToClipboard'
import useElementSize from '../useElementSize'
import useEventListener from '../useEventListener'
import useFocusTrap from '../useFocusTrap'
import useIntersection from '../useIntersection'
import useLocalStorage from '../useLocalStorage'
import useMediaQuery from '../useMediaQuery'
import useMergedRef from '../useMergedRef'
import useResizeObserver from '../useResizeObserver'

const tick = () => act(async () => {})

describe('useIntersection (stable options)', () => {
  class IO {
    static instances: IO[] = []
    cb: IntersectionObserverCallback
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb
      IO.instances.push(this)
    }
    observe = vi.fn()
    disconnect = vi.fn()
  }
  beforeEach(() => {
    IO.instances = []
    vi.stubGlobal('IntersectionObserver', IO)
  })
  afterEach(() => vi.unstubAllGlobals())

  const Comp = () => {
    const [ref, entry] = useIntersection({ threshold: [0, 0.5, 1] })
    return <div ref={ref} data-ratio={entry?.intersectionRatio ?? 'none'} />
  }

  it('does not recreate the observer when an inline threshold array is passed', () => {
    const { container, rerender } = render(<Comp />)
    expect(IO.instances).toHaveLength(1)
    act(() => {
      IO.instances[0]!.cb(
        [{ intersectionRatio: 0.5 } as IntersectionObserverEntry],
        IO.instances[0] as unknown as IntersectionObserver,
      )
    })
    rerender(<Comp />)
    expect(IO.instances).toHaveLength(1)
    expect(container.firstElementChild?.getAttribute('data-ratio')).toBe('0.5')
  })

  it('uses the last entry of a batched callback', () => {
    const { container } = render(<Comp />)
    act(() => {
      IO.instances[0]!.cb(
        [
          { intersectionRatio: 0.1 } as IntersectionObserverEntry,
          { intersectionRatio: 1 } as IntersectionObserverEntry,
        ],
        IO.instances[0] as unknown as IntersectionObserver,
      )
    })
    expect(container.firstElementChild?.getAttribute('data-ratio')).toBe('1')
  })
})

describe('useFocusTrap (attributes + late mount)', () => {
  it('picks up an element that becomes enabled', async () => {
    const container = document.createElement('div')
    const b1 = document.createElement('button')
    const b2 = document.createElement('button')
    b2.disabled = true
    container.append(b1, b2)
    document.body.appendChild(container)
    const ref = { current: container }
    renderHook(() => useFocusTrap(ref))

    b2.disabled = false
    await tick()
    b2.focus()
    const ev = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
    document.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(b1)
    container.remove()
  })

  it('traps a container that mounts after the hook', () => {
    const Comp = () => {
      const ref = useRef<HTMLDivElement>(null)
      const [open, setOpen] = useState(false)
      useFocusTrap(ref)
      return (
        <>
          <button
            type="button"
            data-testid="open"
            onClick={() => setOpen(true)}
          >
            open
          </button>
          {open && (
            <div ref={ref}>
              <button type="button" data-testid="inner">
                x
              </button>
            </div>
          )}
        </>
      )
    }
    const { getByTestId } = render(<Comp />)
    act(() => getByTestId('open').click())
    expect(document.activeElement).toBe(getByTestId('inner'))
  })
})

describe('late-mounting refs', () => {
  it('useResizeObserver observes an element mounted later', () => {
    const observed: Element[] = []
    class RO {
      observe(el: Element) {
        observed.push(el)
      }
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', RO)
    const Comp = () => {
      const ref = useRef<HTMLDivElement>(null)
      const [open, setOpen] = useState(false)
      useResizeObserver(ref)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            open
          </button>
          {open && <div ref={ref} data-testid="target" />}
        </>
      )
    }
    const { getByRole, getByTestId } = render(<Comp />)
    expect(observed).toHaveLength(0)
    act(() => getByRole('button').click())
    expect(observed).toContain(getByTestId('target'))
    vi.unstubAllGlobals()
  })

  it('useEventListener attaches to a ref element mounted later', () => {
    const handler = vi.fn()
    const Comp = () => {
      const ref = useRef<HTMLDivElement>(null)
      const [open, setOpen] = useState(false)
      useEventListener('click', handler, ref)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            open
          </button>
          {open && <div ref={ref} data-testid="target" />}
        </>
      )
    }
    const { getByRole, getByTestId } = render(<Comp />)
    act(() => getByRole('button').click())
    act(() => getByTestId('target').click())
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('useMergedRef (React 19 cleanups)', () => {
  it('runs cleanups returned by callback refs instead of calling them with null', () => {
    const cleanup = vi.fn()
    const withCleanup = vi.fn(() => cleanup)
    const plain = vi.fn()
    const obj = { current: null as HTMLDivElement | null }
    const Comp = () => {
      const merged = useMergedRef<HTMLDivElement>(withCleanup, plain, obj)
      return <div ref={merged} />
    }
    const { unmount, container } = render(<Comp />)
    expect(obj.current).toBe(container.firstElementChild)
    unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(withCleanup).not.toHaveBeenCalledWith(null)
    expect(plain).toHaveBeenLastCalledWith(null)
    expect(obj.current).toBeNull()
  })
})

describe('useCopyToClipboard', () => {
  afterEach(() => {
    Reflect.deleteProperty(document, 'execCommand')
    vi.restoreAllMocks()
  })

  it('falls back to execCommand when writeText rejects', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    })
    ;(document as any).execCommand = vi.fn(() => true)
    const { result } = renderHook(() => useCopyToClipboard())
    let ok = false
    await act(async () => {
      ok = await result.current[1]('hi')
    })
    expect(ok).toBe(true)
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(result.current[0]).toBe(true)
  })

  it('clears the reset timer on unmount', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    })
    const spy = vi.spyOn(globalThis, 'clearTimeout')
    const { result, unmount } = renderHook(() => useCopyToClipboard(5000))
    await act(async () => {
      await result.current[1]('hi')
    })
    spy.mockClear()
    unmount()
    expect(spy).toHaveBeenCalled()
  })
})

describe('useClickOutside', () => {
  it('fires once per tap even if both touch and mouse events are emitted', () => {
    const handler = vi.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)
    renderHook(() => useClickOutside({ current: el }, handler))
    document.dispatchEvent(new Event('pointerdown'))
    document.dispatchEvent(new Event('touchstart'))
    document.dispatchEvent(new Event('mousedown'))
    expect(handler).toHaveBeenCalledTimes(1)
    el.remove()
  })
})

describe('useBreakpoint', () => {
  it('re-syncs when the breakpoints change without a resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 800,
    })
    let bps: Record<string, number> = { xs: 0, md: 768 }
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider theme={{ breakpoints: bps }}>{children}</Provider>
    )
    const { result, rerender } = renderHook(() => useBreakpoint(), { wrapper })
    expect(result.current).toBe('md')
    bps = { a: 0, b: 2000 }
    rerender()
    expect(result.current).toBe('a')
  })
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      writable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, String(v)),
        removeItem: (k: string) => void store.delete(k),
      },
    })
  })

  it('keeps remove stable and the storage listener attached with an inline initialValue', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const { result, rerender } = renderHook(() =>
      useLocalStorage('k', { a: 1 }),
    )
    const remove = result.current[2]
    rerender()
    rerender()
    expect(result.current[2]).toBe(remove)
    expect(add.mock.calls.filter(([t]) => t === 'storage')).toHaveLength(1)
    add.mockRestore()
  })

  it('re-reads state when key changes', () => {
    localStorage.setItem('a', JSON.stringify('A'))
    localStorage.setItem('b', JSON.stringify('B'))
    const { result, rerender } = renderHook(
      ({ k }) => useLocalStorage(k, 'init'),
      { initialProps: { k: 'a' } },
    )
    expect(result.current[0]).toBe('A')
    rerender({ k: 'b' })
    expect(result.current[0]).toBe('B')
  })
})

describe('useElementSize', () => {
  it('uses the border box so the initial and observed sizes agree', () => {
    let cb: ResizeObserverCallback = () => {}
    class RO {
      constructor(c: ResizeObserverCallback) {
        cb = c
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', RO)
    const Comp = () => {
      const [ref, size] = useElementSize()
      return <div ref={ref} data-size={`${size.width}x${size.height}`} />
    }
    const { container } = render(<Comp />)
    act(() => {
      cb(
        [
          {
            contentRect: { width: 100, height: 50 },
            borderBoxSize: [{ inlineSize: 120, blockSize: 60 }],
          } as unknown as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      )
    })
    expect(container.firstElementChild?.getAttribute('data-size')).toBe(
      '120x60',
    )
    vi.unstubAllGlobals()
  })
})

describe('useMediaQuery', () => {
  it('does not throw when matchMedia is missing', () => {
    const original = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    })
    const { result } = renderHook(() => useMediaQuery('(min-width: 1px)'))
    expect(result.current).toBe(false)
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: original,
    })
  })
})
