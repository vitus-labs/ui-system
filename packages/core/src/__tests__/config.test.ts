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
    const originalComponent = config.component
    const originalTextComponent = config.textComponent

    afterEach(() => {
      // restore defaults
      init({
        css: originalCss as any,
        styled: originalStyled as any,
        provider: originalProvider as any,
        component: originalComponent,
        textComponent: originalTextComponent,
      })
    })

    it('updates css engine', () => {
      const mockCss = (() => '') as any
      init({ css: mockCss })
      // config.css is a stable delegate; the internal engine ref is updated
      expect(config._css).toBe(mockCss)
    })

    it('updates styled engine', () => {
      const mockStyled = (() => '') as any
      init({ styled: mockStyled })
      // config.styled is a stable Proxy delegate; the internal engine ref is updated
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
      // The delegate function itself doesn't change — only the internal ref
      expect(config.css).toBe(cssBefore)
    })

    it('styled delegate function is stable across init calls', () => {
      const styledBefore = config.styled
      init({ styled: (() => '') as any })
      expect(config.styled).toBe(styledBefore)
    })
  })
})
