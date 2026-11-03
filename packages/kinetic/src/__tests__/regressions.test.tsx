/**
 * Regression tests for the 2026-11 kinetic audit (settle/restore of inline
 * styles, reduced-motion flips, reversal flashes, Collapse measurement and
 * reversal, transitioncancel / no-animation completion, SSR appear,
 * Stagger callbacks, mergeLeaving).
 */
import { act, render } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import Collapse from '../Collapse'
import { kinetic } from '../index'
import Stagger from '../Stagger'
import Transition from '../Transition'
import { mergeLeaving } from '../utils'

// ─── fixtures ─────────────────────────────────────────────────────────

const mm = { matches: false, listeners: new Set<(e: unknown) => void>() }
const setReduced = (v: boolean) => {
  mm.matches = v
  for (const l of mm.listeners) l({ matches: v })
}
let rafQ: (() => void)[] = []
const flushRaf = (n = 4) => {
  for (let i = 0; i < n; i++) {
    const c = rafQ
    rafQ = []
    for (const f of c) f()
  }
}
const fire = (el: Element, type = 'transitionend') => {
  const e = new Event(type, { bubbles: true })
  Object.defineProperty(e, 'target', { value: el })
  el.dispatchEvent(e)
}

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      get matches() {
        return mm.matches
      },
      media: query,
      addEventListener: (_: string, l: (e: unknown) => void) =>
        mm.listeners.add(l),
      removeEventListener: (_: string, l: (e: unknown) => void) =>
        mm.listeners.delete(l),
      addListener() {},
      removeListener() {},
      dispatchEvent: () => true,
      onchange: null,
    }),
  })
  setReduced(false)
  vi.useFakeTimers()
  rafQ = []
  vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
    rafQ.push(cb)
    return rafQ.length
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const fadeUp = {
  enterStyle: { opacity: 0, transform: 'translateY(16px)' },
  enterToStyle: { opacity: 1, transform: 'translateY(0)' },
  enterTransition: 'all 300ms ease-out',
  leaveStyle: { opacity: 1, transform: 'translateY(0)' },
  leaveToStyle: { opacity: 0, transform: 'translateY(16px)' },
  leaveTransition: 'all 200ms ease-in',
}
const blurIn = {
  enterStyle: { filter: 'blur(8px)' },
  enterToStyle: { filter: 'blur(0px)' },
  enterTransition: 'all 300ms',
}
const clipTop = {
  enterStyle: { clipPath: 'inset(0 0 100% 0)' },
  enterToStyle: { clipPath: 'inset(0 0 0 0)' },
  enterTransition: 'all 300ms',
}

const enterOnce = (preset: object, style?: object) => {
  const ui = (show: boolean) => (
    <Transition show={show} {...preset}>
      <div data-t style={style}>
        hi
      </div>
    </Transition>
  )
  const r = render(ui(false))
  r.rerender(ui(true))
  const el = r.container.querySelector('[data-t]') as HTMLElement
  act(() => flushRaf())
  return { ...r, el, ui }
}

// ─── #1 / #8 settle restores inline styles ────────────────────────────

describe('settled stages restore the inline styles a phase wrote', () => {
  for (const [name, preset, prop] of [
    ['fadeUp', fadeUp, 'transform'],
    ['blurIn', blurIn, 'filter'],
    ['clipTop', clipTop, 'clipPath'],
  ] as const) {
    it(`${name}: no ${prop} left inline after entered`, () => {
      const { el } = enterOnce(preset)
      expect((el.style as any)[prop]).not.toBe('')
      act(() => fire(el))
      expect((el.style as any)[prop]).toBe('')
      expect(el.style.transition).toBe('')
    })
  }

  it("keeps the child's own inline transform / transition", () => {
    const style = {
      transition: 'background-color 1s',
      transform: 'rotate(45deg)',
    }
    const { el } = enterOnce(fadeUp, style)
    expect(el.style.transform).toBe('translateY(0)')
    act(() => fire(el))
    expect({
      transition: el.style.transition,
      transform: el.style.transform,
    }).toEqual(style)
  })

  it('clears leave styles once hidden (unmount=false)', () => {
    const ui = (show: boolean) => (
      <Transition show={show} unmount={false} {...fadeUp}>
        <div data-t>hi</div>
      </Transition>
    )
    const { rerender, container } = render(ui(true))
    const el = container.querySelector('[data-t]') as HTMLElement
    rerender(ui(false))
    act(() => flushRaf())
    expect(el.style.opacity).toBe('0')
    act(() => fire(el))
    expect(el.style.display).toBe('none')
    expect(el.style.opacity).toBe('')
    expect(el.style.transform).toBe('')
  })

  it('kinetic() transition restores too', () => {
    const K = kinetic('div').preset(fadeUp)
    const { rerender, container } = render(<K show={false}>x</K>)
    rerender(<K show>x</K>)
    const el = container.firstChild as HTMLElement
    act(() => flushRaf())
    act(() => fire(el))
    expect(el.style.transform).toBe('')
  })

  it('Stagger leaves no transition-delay behind', () => {
    const items = (ks: string[]) =>
      ks.map((k) => (
        <div key={k} data-k={k}>
          {k}
        </div>
      ))
    const { rerender, container } = render(
      <Stagger show={false} {...fadeUp}>
        {items(['a', 'b', 'c'])}
      </Stagger>,
    )
    rerender(
      <Stagger show {...fadeUp}>
        {items(['a', 'b', 'c'])}
      </Stagger>,
    )
    const c = container.querySelector('[data-k=c]') as HTMLElement
    expect(c.style.transitionDelay).toBe('100ms')
    act(() => flushRaf())
    for (const el of container.querySelectorAll('[data-k]')) act(() => fire(el))
    expect(c.style.transitionDelay).toBe('')
    // #12: removing a sibling must not re-apply a delay via the style prop
    rerender(
      <Stagger show {...fadeUp}>
        {items(['b', 'c'])}
      </Stagger>,
    )
    expect(c.style.transitionDelay).toBe('')
  })
})

// ─── #2 reduced motion flipped on mid-transition ──────────────────────

describe('reduced motion turned on mid-transition completes the phase', () => {
  it('Transition', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()
    const ui = (show: boolean) => (
      <Transition
        show={show}
        {...fadeUp}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      >
        <div data-t>hi</div>
      </Transition>
    )
    const { rerender, container } = render(ui(true))
    rerender(ui(false))
    act(() => flushRaf(1))
    act(() => setReduced(true))
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
    expect(container.querySelector('[data-t]')).toBeNull()
  })

  it('kinetic() transition', () => {
    const K = kinetic('div').preset(fadeUp)
    const { rerender, container } = render(<K show>x</K>)
    rerender(<K show={false}>x</K>)
    act(() => setReduced(true))
    expect(container.firstChild).toBeNull()
  })

  it('kinetic() stagger (TransitionItem)', () => {
    const S = kinetic('ul').preset(fadeUp).stagger()
    const onAfterEnter = vi.fn()
    const ui = (show: boolean) => (
      <S show={show} onAfterEnter={onAfterEnter}>
        <li key="a">a</li>
        <li key="b">b</li>
      </S>
    )
    const { rerender, container } = render(ui(false))
    rerender(ui(true))
    act(() => setReduced(true))
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
    expect((container.querySelector('li') as HTMLElement).style.opacity).toBe(
      '',
    )
  })
})

// ─── #5 reversing mid-flight does not snap to the start state ─────────

describe('reversing an in-flight phase', () => {
  it('leave during enter does not write leaveStyle (opacity 1) first', () => {
    const { el, rerender, ui } = enterOnce(fadeUp)
    const writes: string[] = []
    const proto = Object.getPrototypeOf(el.style)
    const desc = Object.getOwnPropertyDescriptor(proto, 'opacity')
    Object.defineProperty(el.style, 'opacity', {
      configurable: true,
      get() {
        return desc?.get?.call(this)
      },
      set(v) {
        writes.push(String(v))
        desc?.set?.call(this, v)
      },
    })
    rerender(ui(false))
    expect(writes).toEqual([])
    expect(el.style.transition).toBe('all 200ms ease-in')
    act(() => flushRaf())
    expect(writes).toEqual(['0'])
  })

  it('restores the original values after a reversed phase settles', () => {
    const style = { transform: 'rotate(45deg)' }
    const { el, rerender, ui } = enterOnce(fadeUp, style)
    rerender(ui(false))
    act(() => flushRaf())
    rerender(ui(true))
    act(() => flushRaf())
    act(() => fire(el))
    expect(el.style.transform).toBe('rotate(45deg)')
    expect(el.style.opacity).toBe('')
  })
})

// ─── #3 / #4 Collapse ─────────────────────────────────────────────────

describe('Collapse', () => {
  const trackHeights = (w: HTMLElement) => {
    const heights: string[] = []
    let o: object | null = w.style
    let desc: PropertyDescriptor | undefined
    while (o && !desc) {
      desc = Object.getOwnPropertyDescriptor(o, 'height')
      o = Object.getPrototypeOf(o)
    }
    Object.defineProperty(w.style, 'height', {
      configurable: true,
      get() {
        return desc?.get?.call(this)
      },
      set(v) {
        heights.push(v)
        desc?.set?.call(this, v)
      },
    })
    return heights
  }

  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      height: 120,
    } as DOMRect)
  })

  it('content is a BFC so child margins are measured', () => {
    const { container } = render(
      <Collapse show>
        <p>x</p>
      </Collapse>,
    )
    const content = (container.firstChild as HTMLElement)
      .firstChild as HTMLElement
    expect(content.style.display).toBe('flow-root')
  })

  it('re-open during close starts from the current height', () => {
    const { rerender, container } = render(
      <Collapse show>
        <p>x</p>
      </Collapse>,
    )
    const w = container.firstChild as HTMLElement
    rerender(
      <Collapse show={false}>
        <p>x</p>
      </Collapse>,
    )
    const heights = trackHeights(w)
    rerender(
      <Collapse show>
        <p>x</p>
      </Collapse>,
    )
    expect(heights).toEqual(['120px', '200px'])
  })

  it('close during open starts from the current height', () => {
    const { rerender, container } = render(
      <Collapse show={false}>
        <p>x</p>
      </Collapse>,
    )
    const w = container.firstChild as HTMLElement
    rerender(
      <Collapse show>
        <p>x</p>
      </Collapse>,
    )
    const heights = trackHeights(w)
    rerender(
      <Collapse show={false}>
        <p>x</p>
      </Collapse>,
    )
    expect(heights).toEqual(['120px', '0px'])
  })

  it('kinetic().collapse() reverses from the current height too', () => {
    const C = kinetic('div').collapse()
    const { rerender, container } = render(<C show>x</C>)
    const w = container.firstChild as HTMLElement
    rerender(<C show={false}>x</C>)
    const heights = trackHeights(w)
    rerender(<C show>x</C>)
    expect(heights).toEqual(['120px', '200px'])
    expect((w.firstChild as HTMLElement).style.display).toBe('flow-root')
  })

  it('reduced motion turned on mid-collapse completes', () => {
    const onLeave = vi.fn()
    const onAfterLeave = vi.fn()
    const ui = (show: boolean) => (
      <Collapse show={show} onLeave={onLeave} onAfterLeave={onAfterLeave}>
        <p>x</p>
      </Collapse>
    )
    const { rerender } = render(ui(true))
    rerender(ui(false))
    act(() => setReduced(true))
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })
})

// ─── #9 completion without transitionend ──────────────────────────────

describe('completion without a transitionend', () => {
  it('transitioncancel completes the phase', () => {
    const onAfterEnter = vi.fn()
    const ui = (show: boolean) => (
      <Transition show={show} {...fadeUp} onAfterEnter={onAfterEnter}>
        <div data-t>hi</div>
      </Transition>
    )
    const { rerender, container } = render(ui(false))
    rerender(ui(true))
    const el = container.querySelector('[data-t]') as HTMLElement
    act(() => flushRaf())
    act(() => fire(el, 'transitioncancel'))
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('ignores a transitioncancel before the "to" state is applied', () => {
    const onAfterEnter = vi.fn()
    const ui = (show: boolean) => (
      <Transition show={show} {...fadeUp} onAfterEnter={onAfterEnter}>
        <div data-t>hi</div>
      </Transition>
    )
    const { rerender, container } = render(ui(false))
    rerender(ui(true))
    const el = container.querySelector('[data-t]') as HTMLElement
    act(() => flushRaf(1))
    act(() => fire(el, 'transitioncancel'))
    expect(onAfterEnter).not.toHaveBeenCalled()
  })

  it('completes 3 frames in when getAnimations() reports nothing running', () => {
    ;(HTMLElement.prototype as any).getAnimations = () => []
    try {
      const onAfterEnter = vi.fn()
      const ui = (show: boolean) => (
        <Collapse show={show} onAfterEnter={onAfterEnter}>
          <p />
        </Collapse>
      )
      const { rerender } = render(ui(false))
      rerender(ui(true))
      act(() => flushRaf(2))
      expect(onAfterEnter).not.toHaveBeenCalled()
      act(() => flushRaf(1))
      expect(onAfterEnter).toHaveBeenCalledTimes(1)
    } finally {
      delete (HTMLElement.prototype as any).getAnimations
    }
  })

  it('waits while getAnimations() reports a running animation', () => {
    ;(HTMLElement.prototype as any).getAnimations = () => [{}]
    try {
      const onAfterEnter = vi.fn()
      const { el } = enterOnce({ ...fadeUp, onAfterEnter })
      act(() => flushRaf())
      expect(onAfterEnter).not.toHaveBeenCalled()
      act(() => fire(el, 'animationend'))
      expect(onAfterEnter).toHaveBeenCalledTimes(1)
    } finally {
      delete (HTMLElement.prototype as any).getAnimations
    }
  })
})

// ─── #11 SSR with appear ──────────────────────────────────────────────

describe('SSR with appear renders the start state', () => {
  const hydrate = (ui: React.ReactElement) => {
    const html = renderToString(ui)
    const host = document.createElement('div')
    host.innerHTML = html
    document.body.appendChild(host)
    const errors: unknown[] = []
    const err = vi.spyOn(console, 'error').mockImplementation((...a) => {
      errors.push(a)
    })
    act(() => {
      hydrateRoot(host, ui, { onRecoverableError: (e) => errors.push(e) })
    })
    err.mockRestore()
    return { html, host, errors }
  }

  it('Transition', () => {
    const { html, host, errors } = hydrate(
      <Transition show appear {...fadeUp} enterFrom="from">
        <div data-t>content</div>
      </Transition>,
    )
    expect(html).toContain('content')
    expect(html).toContain('opacity:0')
    expect(html).toContain('class="from"')
    expect(errors).toEqual([])
    // the client then animates from there
    const el = host.querySelector('[data-t]') as HTMLElement
    expect(el.style.transition).toBe('all 300ms ease-out')
    act(() => flushRaf())
    expect(el.style.opacity).toBe('1')
  })

  it('Collapse', () => {
    const { html, errors } = hydrate(
      <Collapse show appear>
        <p>content</p>
      </Collapse>,
    )
    expect(html).toContain('content')
    expect(html).toContain('height:0')
    expect(errors).toEqual([])
  })

  it('kinetic() transition', () => {
    const K = kinetic('section').preset(fadeUp)
    const { html, errors } = hydrate(
      <K show appear>
        content
      </K>,
    )
    expect(html).toContain('content')
    expect(html).toContain('opacity:0')
    expect(errors).toEqual([])
  })

  it('show without appear is unchanged', () => {
    const html = renderToString(
      <Transition show {...fadeUp}>
        <div>content</div>
      </Transition>,
    )
    expect(html).toBe('<div>content</div>')
  })
})

// ─── #6 / #12 Stagger callbacks ───────────────────────────────────────

describe('Stagger callbacks', () => {
  const kids = (ks: string[]) =>
    ks.map((k) => (
      <div key={k} data-k={k}>
        {k}
      </div>
    ))

  for (const reverseLeave of [false, true]) {
    it(`onAfterLeave survives a child added mid-leave (reverseLeave=${reverseLeave})`, () => {
      const onAfterLeave = vi.fn()
      const p = { ...fadeUp, reverseLeave, onAfterLeave }
      const { rerender, container } = render(
        <Stagger show {...p}>
          {kids(['a', 'b'])}
        </Stagger>,
      )
      rerender(
        <Stagger show={false} {...p}>
          {kids(['a', 'b'])}
        </Stagger>,
      )
      rerender(
        <Stagger show={false} {...p}>
          {reverseLeave ? kids(['z', 'a', 'b']) : kids(['a', 'b', 'c'])}
        </Stagger>,
      )
      act(() => flushRaf())
      const leaving = [...container.querySelectorAll('[data-k]')]
      act(() => fire(leaving[0] as Element))
      expect(onAfterLeave).not.toHaveBeenCalled()
      for (const el of leaving) act(() => fire(el))
      expect(container.querySelectorAll('[data-k]').length).toBe(0)
      expect(onAfterLeave).toHaveBeenCalledTimes(1)
    })
  }

  it('kinetic().stagger() onAfterLeave survives a child added mid-leave', () => {
    const S = kinetic('ul').preset(fadeUp).stagger()
    const onAfterLeave = vi.fn()
    const ui = (show: boolean, ks: string[]) => (
      <S show={show} onAfterLeave={onAfterLeave}>
        {ks.map((k) => (
          <li key={k} data-k={k}>
            {k}
          </li>
        ))}
      </S>
    )
    const { rerender, container } = render(ui(true, ['a', 'b']))
    rerender(ui(false, ['a', 'b']))
    rerender(ui(false, ['a', 'b', 'c']))
    act(() => flushRaf())
    for (const el of container.querySelectorAll('[data-k]')) act(() => fire(el))
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('onAfterLeave fires once under reduced motion', () => {
    setReduced(true)
    const onAfterLeave = vi.fn()
    const { rerender } = render(
      <Stagger show {...fadeUp} onAfterLeave={onAfterLeave}>
        {kids(['a', 'b', 'c'])}
      </Stagger>,
    )
    rerender(
      <Stagger show={false} {...fadeUp} onAfterLeave={onAfterLeave}>
        {kids(['a', 'b', 'c'])}
      </Stagger>,
    )
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('onAfterEnter fires once (last child), like kinetic().stagger()', () => {
    const onAfterEnter = vi.fn()
    const ui = (show: boolean) => (
      <Stagger show={show} {...fadeUp} onAfterEnter={onAfterEnter}>
        {kids(['a', 'b', 'c'])}
      </Stagger>
    )
    const { rerender, container } = render(ui(false))
    rerender(ui(true))
    act(() => flushRaf())
    for (const el of container.querySelectorAll('[data-k]')) act(() => fire(el))
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })
})

// ─── #10 mergeLeaving ─────────────────────────────────────────────────

describe('mergeLeaving', () => {
  // The previous O(n²) implementation, kept as the ordering oracle.
  const reference = <E,>(
    current: { key: string | number; element: E }[],
    leaving: Map<string | number, E>,
    prevOrder: (string | number)[],
  ) => {
    const result = [...current]
    let at = 0
    for (const key of prevOrder) {
      const i = result.findIndex((r) => r.key === key)
      if (i >= 0) at = i + 1
      else if (leaving.has(key))
        result.splice(at++, 0, { key, element: leaving.get(key) as E })
    }
    return result
  }

  it('returns `current` itself when nothing is leaving', () => {
    const current = [1, 2, 3].map((k) => ({ key: k, element: k }))
    expect(mergeLeaving(current, new Map(), [3, 2, 1])).toBe(current)
  })

  it('matches the reference ordering (randomised)', () => {
    let seed = 42
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed / 2147483648
    }
    for (let run = 0; run < 300; run++) {
      const n = 1 + Math.floor(rnd() * 12)
      const prevOrder = Array.from({ length: n }, (_, i) => i)
      const leaving = new Map<number, number>()
      const current: { key: number; element: number }[] = []
      for (const k of prevOrder) {
        const r = rnd()
        if (r < 0.35) leaving.set(k, k)
        else if (r < 0.9) current.push({ key: k, element: k })
      }
      // shuffle survivors sometimes + add new keys
      if (rnd() < 0.3) current.sort(() => rnd() - 0.5)
      if (rnd() < 0.5) current.splice(0, 0, { key: 100 + run, element: -1 })
      expect(mergeLeaving(current, leaving, prevOrder)).toEqual(
        reference(current, leaving, prevOrder),
      )
    }
  })
})
