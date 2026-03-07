import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import config, { init } from '../config'

describe('Configuration', () => {
  it('has default component as div', () => {
    expect(config.component).toBe('div')
  })

  it('has default textComponent as span', () => {
    expect(config.textComponent).toBe('span')
  })

  it('has css function', () => {
    expect(config.css).toBeDefined()
    expect(typeof config.css).toBe('function')
  })

  it('has styled function', () => {
    expect(config.styled).toBeDefined()
    expect(typeof config.styled).toBe('function')
  })

  it('has ExternalProvider', () => {
    expect(config.ExternalProvider).toBeDefined()
  })

  describe('init', () => {
    const originalCss = config._css
    const originalStyled = config._styled
    const originalProvider = config._provider
    const originalKeyframes = config._keyframes
    const originalCreateGlobalStyle = config._createGlobalStyle
    const originalUseTheme = config._useTheme
    const originalComponent = config.component
    const originalTextComponent = config.textComponent
    const originalCreateMediaQueries = config.createMediaQueries

    afterEach(() => {
      // restore defaults
      config._css = originalCss
      config._styled = originalStyled
      config._provider = originalProvider
      config._keyframes = originalKeyframes
      config._createGlobalStyle = originalCreateGlobalStyle
      config._useTheme = originalUseTheme
      config.component = originalComponent
      config.textComponent = originalTextComponent
      config.createMediaQueries = originalCreateMediaQueries
    })

    it('updates css engine', () => {
      const mockCss = (() => '') as any
      init({ css: mockCss })
      expect(config._css).toBe(mockCss)
    })

    it('updates styled engine', () => {
      const mockStyled = (() => '') as any
      init({ styled: mockStyled })
      expect(config._styled).toBe(mockStyled)
    })

    it('updates provider', () => {
      const MockProvider = (() => null) as any
      init({ provider: MockProvider })
      expect(config.ExternalProvider).toBe(MockProvider)
    })

    it('updates component', () => {
      init({ component: 'section' })
      expect(config.component).toBe('section')
    })

    it('updates textComponent', () => {
      init({ textComponent: 'p' })
      expect(config.textComponent).toBe('p')
    })

    it('updates keyframes', () => {
      const mockKeyframes = (() => 'anim') as any
      init({ keyframes: mockKeyframes })
      expect(config.keyframes).toBe(mockKeyframes)
    })

    it('updates createGlobalStyle', () => {
      const mockGlobal = (() => 'global') as any
      init({ createGlobalStyle: mockGlobal })
      expect(config.createGlobalStyle).toBe(mockGlobal)
    })

    it('updates useTheme', () => {
      const mockUseTheme = (() => ({})) as any
      init({ useTheme: mockUseTheme })
      expect(config.useTheme).toBe(mockUseTheme)
    })

    it('updates createMediaQueries', () => {
      const mockCreateMQ = (() => ({})) as any
      init({ createMediaQueries: mockCreateMQ })
      expect(config.createMediaQueries).toBe(mockCreateMQ)
    })

    it('only updates provided fields', () => {
      init({ component: 'article' })
      expect(config.component).toBe('article')
      expect(config.textComponent).toBe('span')
      expect(config._css).toBe(originalCss)
    })

    it('does nothing with empty object', () => {
      init({})
      expect(config.component).toBe('div')
      expect(config.textComponent).toBe('span')
    })

    it('css delegate function is stable across init calls', () => {
      const cssBefore = config.css
      init({ css: (() => '') as any })
      expect(config.css).toBe(cssBefore)
    })

    it('styled delegate function is stable across init calls', () => {
      const styledBefore = config.styled
      init({ styled: (() => '') as any })
      expect(config.styled).toBe(styledBefore)
    })

    it('can be called multiple times to swap engine', () => {
      const first = (() => 'first') as any
      const second = (() => 'second') as any
      init({ css: first })
      expect(config._css).toBe(first)
      init({ css: second })
      expect(config._css).toBe(second)
    })
  })

  describe('getters return null when engine not configured', () => {
    const originalKeyframes = config._keyframes
    const originalCreateGlobalStyle = config._createGlobalStyle
    const originalUseTheme = config._useTheme
    const originalProvider = config._provider

    beforeEach(() => {
      config._keyframes = null
      config._createGlobalStyle = null
      config._useTheme = null
      config._provider = null
    })

    afterEach(() => {
      config._keyframes = originalKeyframes
      config._createGlobalStyle = originalCreateGlobalStyle
      config._useTheme = originalUseTheme
      config._provider = originalProvider
    })

    it('keyframes returns null', () => {
      expect(config.keyframes).toBeNull()
    })

    it('createGlobalStyle returns null', () => {
      expect(config.createGlobalStyle).toBeNull()
    })

    it('useTheme returns null', () => {
      expect(config.useTheme).toBeNull()
    })

    it('ExternalProvider returns null', () => {
      expect(config.ExternalProvider).toBeNull()
    })
  })

  describe('css delegate', () => {
    const originalCss = config._css

    afterEach(() => {
      config._css = originalCss
    })

    it('delegates directly when engine is available', () => {
      const mockCss = vi.fn((..._args: any[]) => 'css-result')
      config._css = mockCss as any
      const strings = Object.assign(['color: red'] as any, {
        raw: ['color: red'],
      })
      const result = config.css(strings)
      expect(mockCss).toHaveBeenCalledWith(strings)
      expect(result).toBe('css-result')
    })

    it('returns a thunk when engine is not yet configured', () => {
      config._css = null
      const strings = Object.assign(['color: red'] as any, {
        raw: ['color: red'],
      })
      const result = config.css(strings)
      expect(typeof result).toBe('function')
    })

    it('thunk resolves when engine becomes available before call', () => {
      config._css = null
      const strings = Object.assign(['color: red'] as any, {
        raw: ['color: red'],
      })
      const thunk = config.css(strings)

      // Now set the engine
      const mockCss = vi.fn((..._args: any[]) => 'resolved-css')
      config._css = mockCss as any

      const result = thunk()
      expect(mockCss).toHaveBeenCalledWith(strings)
      expect(result).toBe('resolved-css')
    })

    it('thunk throws when engine is still not configured', () => {
      config._css = null
      const strings = Object.assign(['color: red'] as any, {
        raw: ['color: red'],
      })
      const thunk = config.css(strings)

      expect(() => thunk()).toThrow('CSS engine not configured')
    })
  })

  describe('styled delegate', () => {
    const originalStyled = config._styled

    afterEach(() => {
      config._styled = originalStyled
    })

    it('fast path: creates component immediately when engine is available', () => {
      const mockComponent = (props: any) => createElement('div', props)
      const mockStyledTag = vi.fn((..._args: any[]) => mockComponent)
      const mockStyled = vi.fn((_tag: any) => mockStyledTag) as any
      config._styled = mockStyled

      const strings = Object.assign([''] as any, { raw: [''] })
      const result = config.styled('div')(strings)
      expect(mockStyled).toHaveBeenCalledWith('div')
      expect(result).toBe(mockComponent)
    })

    it('fast path with options: passes options to engine', () => {
      const mockComponent = (props: any) => createElement('div', props)
      const mockStyledTag = vi.fn((..._args: any[]) => mockComponent)
      const mockStyled = vi.fn((_tag: any, _opts?: any) => mockStyledTag) as any
      config._styled = mockStyled

      const options = { shouldForwardProp: () => true }
      const strings = Object.assign([''] as any, { raw: [''] })
      const result = config.styled('div', options)(strings)
      expect(mockStyled).toHaveBeenCalledWith('div', options)
      expect(result).toBe(mockComponent)
    })

    it('lazy path: returns a component when engine not available', () => {
      config._styled = null
      const strings = Object.assign([''] as any, { raw: [''] })
      const LazyComponent = config.styled('div')(strings)
      expect(LazyComponent).toBeDefined()
      expect(LazyComponent.displayName).toBe('styled(div)')
    })

    it('lazy component renders once engine is set', () => {
      config._styled = null
      const strings = Object.assign(['color: red'] as any, {
        raw: ['color: red'],
      })
      const LazyComponent = config.styled('div')(strings)

      // Now set up a real-ish engine
      const RealComponent = (props: any) =>
        createElement('div', { 'data-styled': true, ...props })
      const mockStyledTag = vi.fn((..._args: any[]) => RealComponent)
      const mockStyled = vi.fn((_tag: any) => mockStyledTag) as any
      config._styled = mockStyled

      const html = renderToStaticMarkup(createElement(LazyComponent, null))
      expect(html).toContain('data-styled')
      expect(mockStyled).toHaveBeenCalledWith('div')
    })

    it('lazy component with options renders correctly', () => {
      config._styled = null
      const options = { shouldForwardProp: () => true }
      const strings = Object.assign(['color: red'] as any, {
        raw: ['color: red'],
      })
      const LazyComponent = config.styled('div', options)(strings)

      const RealComponent = (props: any) =>
        createElement('div', { 'data-opts': true, ...props })
      const mockStyledTag = vi.fn((..._args: any[]) => RealComponent)
      const mockStyled = vi.fn((_tag: any, _opts?: any) => mockStyledTag) as any
      config._styled = mockStyled

      const html = renderToStaticMarkup(createElement(LazyComponent, null))
      expect(html).toContain('data-opts')
      expect(mockStyled).toHaveBeenCalledWith('div', options)
    })

    it('lazy component throws if engine still not set at render', () => {
      config._styled = null
      const strings = Object.assign([''] as any, { raw: [''] })
      const LazyComponent = config.styled('div')(strings)

      expect(() => {
        renderToStaticMarkup(createElement(LazyComponent, null))
      }).toThrow('CSS engine not configured')
    })

    it('lazy component caches Real component after first render', () => {
      config._styled = null
      const strings = Object.assign([''] as any, { raw: [''] })
      const LazyComponent = config.styled('div')(strings)

      const RealComponent = (props: any) => createElement('div', props)
      const mockStyledTag = vi.fn((..._args: any[]) => RealComponent)
      const mockStyled = vi.fn((_tag: any) => mockStyledTag) as any
      config._styled = mockStyled

      renderToStaticMarkup(createElement(LazyComponent, null))
      renderToStaticMarkup(createElement(LazyComponent, null))
      // Engine factory called only once due to caching
      expect(mockStyled).toHaveBeenCalledTimes(1)
    })

    describe('displayName', () => {
      it('uses string tag directly', () => {
        config._styled = null
        const strings = Object.assign([''] as any, { raw: [''] })
        const C = config.styled('span')(strings)
        expect(C.displayName).toBe('styled(span)')
      })

      it('uses component displayName', () => {
        config._styled = null
        const MyComponent = () => null
        MyComponent.displayName = 'MyCustomName'
        const strings = Object.assign([''] as any, { raw: [''] })
        const C = config.styled(MyComponent)(strings)
        expect(C.displayName).toBe('styled(MyCustomName)')
      })

      it('uses component name when no displayName', () => {
        config._styled = null
        function NamedComponent() {
          return null
        }
        const strings = Object.assign([''] as any, { raw: [''] })
        const C = config.styled(NamedComponent)(strings)
        expect(C.displayName).toBe('styled(NamedComponent)')
      })

      it('falls back to Component when no name', () => {
        config._styled = null
        const strings = Object.assign([''] as any, { raw: [''] })
        // Use an object with call signature but no displayName/name
        const anon = { displayName: '', name: '' }
        const C = config.styled(anon)(strings)
        expect(C.displayName).toBe('styled(Component)')
      })
    })
  })

  describe('styled Proxy shorthand (styled.div)', () => {
    const originalStyled = config._styled

    afterEach(() => {
      config._styled = originalStyled
    })

    it('returns undefined for prototype and $$typeof', () => {
      expect((config.styled as any).prototype).toBeUndefined()
      expect((config.styled as any).$$typeof).toBeUndefined()
    })

    it('fast path: delegates styled.div to engine when available', () => {
      const RealComponent = (props: any) => createElement('div', props)
      const mockTagFn = vi.fn((..._args: any[]) => RealComponent)
      const mockStyled = Object.assign(
        vi.fn((_tag: any) => mockTagFn),
        { div: mockTagFn },
      ) as any
      config._styled = mockStyled

      const strings = Object.assign(['color: blue'] as any, {
        raw: ['color: blue'],
      })
      const result = (config.styled as any).div(strings)
      expect(mockTagFn).toHaveBeenCalledWith(strings)
      expect(result).toBe(RealComponent)
    })

    it('lazy path: creates lazy component for styled.div when engine not set', () => {
      config._styled = null
      const strings = Object.assign([''] as any, { raw: [''] })
      const LazyComponent = (config.styled as any).div(strings)
      expect(LazyComponent).toBeDefined()
      expect(LazyComponent.displayName).toBe('styled(div)')
    })

    it('lazy styled.div renders once engine is available', () => {
      config._styled = null
      const strings = Object.assign([''] as any, { raw: [''] })
      const LazyComponent = (config.styled as any).section(strings)
      expect(LazyComponent.displayName).toBe('styled(section)')

      const RealComponent = (props: any) => createElement('section', props)
      const mockTagFn = vi.fn((..._args: any[]) => RealComponent)
      const mockStyled = Object.assign(
        vi.fn((_tag: any) => mockTagFn),
        { section: mockTagFn },
      ) as any
      config._styled = mockStyled

      const html = renderToStaticMarkup(createElement(LazyComponent, null))
      expect(html).toContain('section')
    })
  })
})
