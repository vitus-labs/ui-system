import { CONTROL_TYPES } from '../constants/controls'
import { init, rocketstories } from '../init'
import renderMainBase from '../stories/base/renderMain'
import renderRenderBase from '../stories/base/renderRender'
import getTheme from '../utils/theme'

// Mock window.__VITUS_LABS_STORIES__ for getTheme
beforeAll(() => {
  ;(window as any).__VITUS_LABS_STORIES__ = {
    decorators: { theme: { rootSize: 16 } },
  }
})

describe('CONTROL_TYPES', () => {
  it('is an array of control type strings', () => {
    expect(Array.isArray(CONTROL_TYPES)).toBe(true)
    expect(CONTROL_TYPES).toContain('text')
    expect(CONTROL_TYPES).toContain('number')
    expect(CONTROL_TYPES).toContain('boolean')
    expect(CONTROL_TYPES).toContain('select')
    expect(CONTROL_TYPES).toContain('multi-select')
    expect(CONTROL_TYPES).toContain('radio')
    expect(CONTROL_TYPES).toContain('color')
    expect(CONTROL_TYPES).toContain('object')
    expect(CONTROL_TYPES).toContain('function')
    expect(CONTROL_TYPES).toContain('component')
  })
})

describe('getTheme utility', () => {
  it('reads theme from window global', () => {
    const theme = getTheme()
    expect(theme).toEqual({ rootSize: 16 })
  })
})

describe('init and rocketstories factories', () => {
  const MockComponent = (_props: any) => null
  MockComponent.displayName = 'MockButton'

  it('rocketstories creates a builder from component', () => {
    const builder = rocketstories(MockComponent)
    expect(builder).toBeDefined()
    expect(builder.CONFIG).toBeDefined()
    expect(builder.CONFIG.component).toBe(MockComponent)
    expect(builder.CONFIG.name).toBe('MockButton')
  })

  it('rocketstories sets default storyOptions', () => {
    const builder = rocketstories(MockComponent)
    expect(builder.CONFIG.storyOptions.gap).toBe(16)
    expect(builder.CONFIG.storyOptions.direction).toBe('rows')
    expect(builder.CONFIG.storyOptions.alignY).toBe('top')
    expect(builder.CONFIG.storyOptions.alignX).toBe('left')
  })

  it('rocketstories accepts custom storyOptions', () => {
    const builder = rocketstories(MockComponent, {
      storyOptions: { gap: 32 },
    })
    expect(builder.CONFIG.storyOptions.gap).toBe(32)
    expect(builder.CONFIG.storyOptions.direction).toBe('rows')
  })

  it('rocketstories accepts decorators', () => {
    const decorator = () => null
    const builder = rocketstories(MockComponent, {
      decorators: [decorator],
    })
    expect(builder.CONFIG.decorators).toContain(decorator)
  })

  it('init creates a curried factory', () => {
    const factory = init({ storyOptions: { gap: 24 } })
    const builder = factory(MockComponent)
    expect(builder).toBeDefined()
    expect(builder.CONFIG.storyOptions.gap).toBe(24)
  })

  it('init passes decorators through', () => {
    const decorator = () => null
    const factory = init({ decorators: [decorator] })
    const builder = factory(MockComponent)
    expect(builder.CONFIG.decorators).toContain(decorator)
  })

  it('uses component.name when displayName is missing', () => {
    const Unnamed = function MyComp() {
      return null
    }
    const builder = rocketstories(Unnamed as any)
    expect(builder.CONFIG.name).toBe('MyComp')
  })
})

describe('createRocketStories builder', () => {
  const MockComponent = (_props: any) => null
  MockComponent.displayName = 'TestComp'

  it('has all chaining methods', () => {
    const builder = rocketstories(MockComponent)
    expect(typeof builder.attrs).toBe('function')
    expect(typeof builder.controls).toBe('function')
    expect(typeof builder.storyOptions).toBe('function')
    expect(typeof builder.config).toBe('function')
    expect(typeof builder.replaceComponent).toBe('function')
    expect(typeof builder.decorators).toBe('function')
  })

  it('has all output methods', () => {
    const builder = rocketstories(MockComponent)
    expect(typeof builder.main).toBe('function')
    expect(typeof builder.dimension).toBe('function')
    expect(typeof builder.render).toBe('function')
    expect(typeof builder.list).toBe('function')
  })

  it('.attrs() returns new builder with merged attrs', () => {
    const builder = rocketstories(MockComponent)
    const enhanced = builder.attrs({ label: 'test' })
    expect(enhanced.CONFIG.attrs.label).toBe('test')
    expect(enhanced).not.toBe(builder)
  })

  it('.storyOptions() returns new builder with merged options', () => {
    const builder = rocketstories(MockComponent)
    const enhanced = builder.storyOptions({ gap: 32 })
    expect(enhanced.CONFIG.storyOptions.gap).toBe(32)
  })

  it('.controls() returns new builder with merged controls', () => {
    const builder = rocketstories(MockComponent)
    const enhanced = builder.controls({ label: 'text' as any })
    expect(enhanced.CONFIG.controls.label).toBe('text')
  })

  it('.config() returns new builder preserving existing config', () => {
    // cloneAndEhnance uses `defaultOptions.name || options.name`
    // existing name takes priority over config name
    const builder = rocketstories(MockComponent)
    const enhanced = builder.config({ storyOptions: { gap: 48 } })
    expect(enhanced.CONFIG.storyOptions.gap).toBe(48)
    expect(enhanced.CONFIG.name).toBe('TestComp')
  })

  it('.config() with prefix adds prefix to name', () => {
    const builder = rocketstories(MockComponent)
    const enhanced = builder.config({ prefix: 'Components' })
    expect(enhanced.CONFIG.name).toContain('Components')
  })

  it('.replaceComponent() returns new builder with new component', () => {
    const OtherComponent = () => null
    OtherComponent.displayName = 'Other'
    const builder = rocketstories(MockComponent)
    const enhanced = builder.replaceComponent(OtherComponent as any)
    expect(enhanced.CONFIG.component).toBe(OtherComponent)
  })

  it('.decorators() appends decorators', () => {
    const dec1 = () => null
    const dec2 = () => null
    const builder = rocketstories(MockComponent, { decorators: [dec1] })
    const enhanced = builder.decorators([dec2] as any)
    expect(enhanced.CONFIG.decorators).toContain(dec1)
    expect(enhanced.CONFIG.decorators).toContain(dec2)
  })

  it('.init returns component, title, and decorators', () => {
    const builder = rocketstories(MockComponent)
    const initResult = builder.init
    expect(initResult.component).toBe(MockComponent)
    expect(initResult.title).toBe('TestComp')
    expect(Array.isArray(initResult.decorators)).toBe(true)
  })

  it('chaining is immutable', () => {
    const builder = rocketstories(MockComponent)
    const enhanced = builder.attrs({ label: 'test' })
    expect(builder.CONFIG.attrs).toEqual({})
    expect(enhanced.CONFIG.attrs.label).toBe('test')
  })

  it('dimension returns null for non-rocketstyle components', () => {
    const builder = rocketstories(MockComponent)
    const result = builder.dimension('state' as any)
    expect(result).toBeNull()
  })

  it('main() returns a story component for non-rocketstyle', () => {
    const builder = rocketstories(MockComponent)
    const story = builder.main()
    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
    expect(story.argTypes).toBeDefined()
  })

  it('render() returns a story component', () => {
    const renderer = (_props: any) => null
    const builder = rocketstories(MockComponent)
    const story = builder.render(renderer as any)
    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
  })
})

describe('StoryHoc (base)', () => {
  it('attaches args and argTypes to story', () => {
    const renderMain = renderMainBase
    const MockComp = (_props: any) => null
    MockComp.displayName = 'Mock'

    const story = renderMain({
      component: MockComp,
      name: 'Mock',
      attrs: { label: 'Hello' },
      controls: { label: 'text' },
    })

    expect(story.args).toEqual({ label: 'Hello' })
    expect(story.argTypes).toBeDefined()
    expect(story.argTypes.label).toBeDefined()
  })
})

describe('base renderRender', () => {
  it('wraps custom render function as story', () => {
    const renderRender = renderRenderBase
    const customRender = (_props: any) => null

    const storyFactory = renderRender(customRender)
    const story = storyFactory({
      component: () => null,
      name: 'Test',
      attrs: {},
      controls: {},
    })

    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
  })
})
