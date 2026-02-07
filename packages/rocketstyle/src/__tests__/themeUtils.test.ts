import {
  themeModeCallback,
  getThemeFromChain,
  getDimensionThemes,
  calculateChainOptions,
  getTheme,
  getThemeByMode,
} from '../utils/theme'

describe('themeModeCallback', () => {
  it('returns light value for light mode', () => {
    const cb = themeModeCallback('lightVal', 'darkVal')
    expect(cb('light')).toBe('lightVal')
  })

  it('returns light value when mode is falsy', () => {
    const cb = themeModeCallback('lightVal', 'darkVal')
    expect(cb(undefined as any)).toBe('lightVal')
    expect(cb('' as any)).toBe('lightVal')
  })

  it('returns dark value for dark mode', () => {
    const cb = themeModeCallback('lightVal', 'darkVal')
    expect(cb('dark')).toBe('darkVal')
  })
})

describe('getThemeFromChain', () => {
  it('returns empty for empty array', () => {
    expect(getThemeFromChain([], {})).toEqual({})
  })

  it('returns empty for null', () => {
    expect(getThemeFromChain(null, {})).toEqual({})
  })

  it('returns empty for undefined', () => {
    expect(getThemeFromChain(undefined, {})).toEqual({})
  })

  it('evaluates chain of callbacks and deep-merges results', () => {
    const fn1 = (theme: any) => ({ color: 'blue' })
    const fn2 = (theme: any) => ({ bg: theme.primary })
    const result = getThemeFromChain([fn1, fn2], { primary: 'red' })
    expect(result).toEqual({ color: 'blue', bg: 'red' })
  })

  it('later callbacks override earlier ones', () => {
    const fn1 = () => ({ color: 'blue' })
    const fn2 = () => ({ color: 'red' })
    const result = getThemeFromChain([fn1, fn2], {})
    expect(result).toEqual({ color: 'red' })
  })

  it('passes themeModeCallback and config.css to each callback', () => {
    const fn = jest.fn(() => ({}))
    getThemeFromChain([fn], { rootSize: 16 })
    expect(fn).toHaveBeenCalledWith(
      { rootSize: 16 },
      expect.any(Function),
      expect.anything(),
    )
  })
})

describe('getDimensionThemes', () => {
  it('returns empty for empty dimensions', () => {
    expect(getDimensionThemes({}, { dimensions: {} })).toEqual({})
  })

  it('returns empty when dimensions is falsy', () => {
    expect(getDimensionThemes({}, { dimensions: undefined })).toEqual({})
  })

  it('processes dimension theme chains', () => {
    const theme = { primaryColor: 'blue' }
    const options = {
      dimensions: { states: 'state' },
      states: [
        (t: any) => ({
          primary: { color: t.primaryColor },
          secondary: { color: 'green' },
        }),
      ],
    }
    const result = getDimensionThemes(theme, options)
    expect(result.state).toEqual({
      primary: { color: 'blue' },
      secondary: { color: 'green' },
    })
  })

  it('skips dimensions without callback arrays', () => {
    const options = {
      dimensions: { states: 'state', sizes: 'size' },
      states: [() => ({ primary: { color: 'red' } })],
    }
    const result = getDimensionThemes({}, options)
    expect(result.state).toEqual({ primary: { color: 'red' } })
    expect(result.size).toBeUndefined()
  })

  it('strips nullable values from results', () => {
    const options = {
      dimensions: { states: 'state' },
      states: [() => ({ primary: { color: 'red' }, secondary: null })],
    }
    const result = getDimensionThemes({}, options)
    expect(result.state.primary).toEqual({ color: 'red' })
    expect(result.state.secondary).toBeUndefined()
  })

  it('handles multi-key dimensions', () => {
    const options = {
      dimensions: { multiple: { propName: 'multiple', multi: true } },
      multiple: [() => ({ a: { weight: 'bold' } })],
    }
    const result = getDimensionThemes({}, options)
    expect(result.multiple).toEqual({ a: { weight: 'bold' } })
  })

  it('skips empty callback arrays', () => {
    const options = {
      dimensions: { states: 'state' },
      states: [],
    }
    const result = getDimensionThemes({}, options)
    expect(result.state).toBeUndefined()
  })
})

describe('calculateChainOptions (theme)', () => {
  it('returns empty for null', () => {
    expect(calculateChainOptions(null, [])).toEqual({})
  })

  it('returns empty for undefined', () => {
    expect(calculateChainOptions(undefined, [])).toEqual({})
  })

  it('returns empty for empty array', () => {
    expect(calculateChainOptions([], [])).toEqual({})
  })

  it('evaluates chain and deep-merges results', () => {
    const fn1 = () => ({ nested: { a: 1 } })
    const fn2 = () => ({ nested: { b: 2 } })
    const result = calculateChainOptions([fn1, fn2], [])
    expect(result).toEqual({ nested: { a: 1, b: 2 } })
  })

  it('passes args to each function', () => {
    const fn = jest.fn(() => ({}))
    calculateChainOptions([fn], ['arg1', 'arg2'])
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

describe('getTheme', () => {
  it('returns baseTheme when rocketstate has no matching dimension themes', () => {
    const result = getTheme({
      rocketstate: { state: 'unknown' },
      themes: { state: {} },
      baseTheme: { color: 'blue' },
    })
    expect(result.color).toBe('blue')
  })

  it('merges dimension theme into baseTheme', () => {
    const result = getTheme({
      rocketstate: { state: 'primary' },
      themes: { state: { primary: { color: 'red' } } },
      baseTheme: { color: 'blue', bg: 'white' },
    })
    expect(result.color).toBe('red')
    expect(result.bg).toBe('white')
  })

  it('handles array values for multi-key dimensions', () => {
    const result = getTheme({
      rocketstate: { multiple: ['a', 'b'] },
      themes: {
        multiple: { a: { weight: 'bold' }, b: { style: 'italic' } },
      },
      baseTheme: {},
    })
    expect(result.weight).toBe('bold')
    expect(result.style).toBe('italic')
  })

  it('later dimensions override earlier ones', () => {
    const result = getTheme({
      rocketstate: { state: 'primary', size: 'large' },
      themes: {
        state: { primary: { fontSize: 14 } },
        size: { large: { fontSize: 20 } },
      },
      baseTheme: {},
    })
    expect(result.fontSize).toBe(20)
  })

  it('does not mutate baseTheme', () => {
    const baseTheme = { color: 'blue' }
    getTheme({
      rocketstate: { state: 'primary' },
      themes: { state: { primary: { color: 'red' } } },
      baseTheme,
    })
    expect(baseTheme.color).toBe('blue')
  })
})

describe('getThemeByMode', () => {
  it('returns scalar values as-is', () => {
    const result = getThemeByMode({ color: 'red', size: 16 }, 'light')
    expect(result).toEqual({ color: 'red', size: 16 })
  })

  it('recursively processes nested objects', () => {
    const result = getThemeByMode({ nested: { color: 'red' } }, 'light')
    expect(result).toEqual({ nested: { color: 'red' } })
  })

  it('resolves mode callbacks for light', () => {
    const cb = themeModeCallback('lightColor', 'darkColor')
    const result = getThemeByMode({ color: cb }, 'light')
    expect(result.color).toBe('lightColor')
  })

  it('resolves mode callbacks for dark', () => {
    const cb = themeModeCallback('lightColor', 'darkColor')
    const result = getThemeByMode({ color: cb }, 'dark')
    expect(result.color).toBe('darkColor')
  })

  it('resolves nested mode callbacks', () => {
    const cb = themeModeCallback('lightBg', 'darkBg')
    const result = getThemeByMode({ nested: { bg: cb } }, 'light')
    expect(result.nested.bg).toBe('lightBg')
  })

  it('handles mixed values and mode callbacks', () => {
    const cb = themeModeCallback('#fff', '#000')
    const result = getThemeByMode(
      { bg: cb, fontSize: 16, nested: { color: 'static' } },
      'dark',
    )
    expect(result.bg).toBe('#000')
    expect(result.fontSize).toBe(16)
    expect(result.nested.color).toBe('static')
  })
})
