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
    const originalCss = config.css
    const originalStyled = config.styled
    const originalProvider = config.ExternalProvider
    const originalComponent = config.component
    const originalTextComponent = config.textComponent

    afterEach(() => {
      // restore defaults
      init({
        css: originalCss,
        styled: originalStyled,
        provider: originalProvider,
        component: originalComponent,
        textComponent: originalTextComponent,
      })
    })

    it('updates css', () => {
      const mockCss = (() => '') as any
      init({ css: mockCss })
      expect(config.css).toBe(mockCss)
    })

    it('updates styled', () => {
      const mockStyled = (() => '') as any
      init({ styled: mockStyled })
      expect(config.styled).toBe(mockStyled)
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
      expect(config.css).toBe(originalCss)
    })

    it('does nothing with empty object', () => {
      init({})
      expect(config.component).toBe('div')
      expect(config.textComponent).toBe('span')
    })
  })
})
