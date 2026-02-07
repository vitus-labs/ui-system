import { renderHook, act } from '@testing-library/react'
import { type ReactNode, createContext, useContext } from 'react'
import usePseudoState from '../hooks/usePseudoState'
import useRocketstyleRef from '../hooks/useRef'
import useThemeAttrs from '../hooks/useTheme'
import { useLocalContext, LocalProvider } from '../context/localContext'

describe('usePseudoState', () => {
  it('returns initial state with all false', () => {
    const { result } = renderHook(() => usePseudoState({}))
    expect(result.current.state).toEqual({
      hover: false,
      focus: false,
      pressed: false,
    })
  })

  it('returns event handlers', () => {
    const { result } = renderHook(() => usePseudoState({}))
    expect(typeof result.current.events.onMouseEnter).toBe('function')
    expect(typeof result.current.events.onMouseLeave).toBe('function')
    expect(typeof result.current.events.onMouseDown).toBe('function')
    expect(typeof result.current.events.onMouseUp).toBe('function')
    expect(typeof result.current.events.onFocus).toBe('function')
    expect(typeof result.current.events.onBlur).toBe('function')
  })

  it('sets hover on mouseEnter', () => {
    const { result } = renderHook(() => usePseudoState({}))
    act(() => {
      result.current.events.onMouseEnter({} as any)
    })
    expect(result.current.state.hover).toBe(true)
  })

  it('clears hover and pressed on mouseLeave', () => {
    const { result } = renderHook(() => usePseudoState({}))
    act(() => {
      result.current.events.onMouseEnter({} as any)
      result.current.events.onMouseDown({} as any)
    })
    expect(result.current.state.hover).toBe(true)
    expect(result.current.state.pressed).toBe(true)
    act(() => {
      result.current.events.onMouseLeave({} as any)
    })
    expect(result.current.state.hover).toBe(false)
    expect(result.current.state.pressed).toBe(false)
  })

  it('sets pressed on mouseDown, clears on mouseUp', () => {
    const { result } = renderHook(() => usePseudoState({}))
    act(() => {
      result.current.events.onMouseDown({} as any)
    })
    expect(result.current.state.pressed).toBe(true)
    act(() => {
      result.current.events.onMouseUp({} as any)
    })
    expect(result.current.state.pressed).toBe(false)
  })

  it('sets focus on focus, clears on blur', () => {
    const { result } = renderHook(() => usePseudoState({}))
    act(() => {
      result.current.events.onFocus({} as any)
    })
    expect(result.current.state.focus).toBe(true)
    act(() => {
      result.current.events.onBlur({} as any)
    })
    expect(result.current.state.focus).toBe(false)
  })

  it('calls user-provided event handlers', () => {
    const onMouseEnter = jest.fn()
    const onMouseLeave = jest.fn()
    const onMouseDown = jest.fn()
    const onMouseUp = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()

    const { result } = renderHook(() =>
      usePseudoState({
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
        onFocus,
        onBlur,
      }),
    )

    const mockEvent = {} as any
    act(() => {
      result.current.events.onMouseEnter(mockEvent)
      result.current.events.onMouseLeave(mockEvent)
      result.current.events.onMouseDown(mockEvent)
      result.current.events.onMouseUp(mockEvent)
      result.current.events.onFocus(mockEvent)
      result.current.events.onBlur(mockEvent)
    })

    expect(onMouseEnter).toHaveBeenCalledWith(mockEvent)
    expect(onMouseLeave).toHaveBeenCalledWith(mockEvent)
    expect(onMouseDown).toHaveBeenCalledWith(mockEvent)
    expect(onMouseUp).toHaveBeenCalledWith(mockEvent)
    expect(onFocus).toHaveBeenCalledWith(mockEvent)
    expect(onBlur).toHaveBeenCalledWith(mockEvent)
  })
})

describe('useRocketstyleRef', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() =>
      useRocketstyleRef({ $rocketstyleRef: undefined, ref: undefined }),
    )
    expect(result.current).toHaveProperty('current')
  })

  it('exposes internal ref to $rocketstyleRef', () => {
    let capturedRef: any = null
    const rocketstyleRef = (val: any) => {
      capturedRef = val
    }
    renderHook(() =>
      useRocketstyleRef({ $rocketstyleRef: rocketstyleRef, ref: undefined }),
    )
    expect(capturedRef).toBeNull() // initial value is null
  })

  it('exposes internal ref to outer ref', () => {
    let capturedRef: any = null
    const outerRef = (val: any) => {
      capturedRef = val
    }
    renderHook(() =>
      useRocketstyleRef({ $rocketstyleRef: undefined, ref: outerRef }),
    )
    expect(capturedRef).toBeNull()
  })
})

describe('useThemeAttrs', () => {
  // Import the context from core (via the rocketstyle re-export)
  // We need to use the same context that useTheme reads from
  const { context } = require('../context/context')

  const createWrapper =
    (value: any) =>
    ({ children }: { children: ReactNode }) => (
      <context.Provider value={value}>{children}</context.Provider>
    )

  it('returns default values when no context', () => {
    const { result } = renderHook(() => useThemeAttrs({ inversed: false }))
    expect(result.current.theme).toEqual({})
    expect(result.current.mode).toBe('light')
    expect(result.current.isLight).toBe(true)
  })

  it('reads theme from context', () => {
    const wrapper = createWrapper({
      theme: { rootSize: 16 },
      mode: 'light',
      isDark: false,
      isLight: true,
    })
    const { result } = renderHook(() => useThemeAttrs({ inversed: false }), {
      wrapper,
    })
    expect(result.current.theme).toEqual({ rootSize: 16 })
    expect(result.current.mode).toBe('light')
  })

  it('inverts mode when inversed is true', () => {
    const wrapper = createWrapper({
      theme: { rootSize: 16 },
      mode: 'light',
      isDark: false,
      isLight: true,
    })
    const { result } = renderHook(() => useThemeAttrs({ inversed: true }), {
      wrapper,
    })
    expect(result.current.mode).toBe('dark')
    expect(result.current.isDark).toBe(true)
    expect(result.current.isLight).toBe(false)
  })

  it('inverts dark to light', () => {
    const wrapper = createWrapper({
      theme: {},
      mode: 'dark',
      isDark: true,
      isLight: false,
    })
    const { result } = renderHook(() => useThemeAttrs({ inversed: true }), {
      wrapper,
    })
    expect(result.current.mode).toBe('light')
    expect(result.current.isDark).toBe(false)
    expect(result.current.isLight).toBe(true)
  })
})

describe('useLocalContext', () => {
  it('returns default pseudo when no consumer', () => {
    const { result } = renderHook(() => useLocalContext(null))
    expect(result.current).toEqual({ pseudo: {} })
  })

  it('returns default pseudo when consumer is undefined', () => {
    const { result } = renderHook(() => useLocalContext(undefined))
    expect(result.current).toEqual({ pseudo: {} })
  })

  it('calls consumer with getter function', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LocalProvider value={{ pseudo: { hover: true } }}>
        {children}
      </LocalProvider>
    )

    const consumer = (getter: any) =>
      getter((ctx: any) => ({ myPseudo: ctx.pseudo }))

    const { result } = renderHook(() => useLocalContext(consumer), { wrapper })
    expect(result.current.myPseudo).toEqual({ hover: true })
  })
})
