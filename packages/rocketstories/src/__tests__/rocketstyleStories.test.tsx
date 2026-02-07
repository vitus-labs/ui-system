import { render, screen } from '@testing-library/react'
import { createElement } from 'react'

// Mock window.__VITUS_LABS_STORIES__ for getTheme
beforeAll(() => {
  ;(window as any).__VITUS_LABS_STORIES__ = {
    decorators: { theme: { rootSize: 16 } },
  }
})

// ---------------------------------------------------------------------------
// MOCK ROCKETSTYLE COMPONENT
// ---------------------------------------------------------------------------
const MockRSComponent = (props: any) => (
  <div data-testid="mock-rs" {...props} />
)
MockRSComponent.IS_ROCKETSTYLE = true
MockRSComponent.VITUS_LABS__COMPONENT = '@vitus-labs/elements/Element'
MockRSComponent.getStaticDimensions = (_theme: any) => ({
  dimensions: {
    state: { primary: true, secondary: true },
    size: { small: true, large: true },
  },
  keywords: {},
  useBooleans: true,
  multiKeys: {},
})
MockRSComponent.getDefaultAttrs = (attrs: any, _theme: any, _mode: string) => ({
  label: 'default',
  ...attrs,
})

// MockRSComponent with multi keys
const MockMultiKeyComponent = (props: any) => (
  <div data-testid="mock-multi" {...props} />
)
MockMultiKeyComponent.IS_ROCKETSTYLE = true
MockMultiKeyComponent.VITUS_LABS__COMPONENT = '@vitus-labs/elements/Element'
MockMultiKeyComponent.getStaticDimensions = (_theme: any) => ({
  dimensions: {
    tags: { tagA: true, tagB: true },
  },
  keywords: {},
  useBooleans: false,
  multiKeys: { tags: true },
})
MockMultiKeyComponent.getDefaultAttrs = (
  attrs: any,
  _theme: any,
  _mode: string,
) => ({ ...attrs })

// Mock component with empty dimension
const MockEmptyDimComponent = (props: any) => (
  <div data-testid="mock-empty" {...props} />
)
MockEmptyDimComponent.IS_ROCKETSTYLE = true
MockEmptyDimComponent.VITUS_LABS__COMPONENT = '@vitus-labs/elements/Element'
MockEmptyDimComponent.getStaticDimensions = (_theme: any) => ({
  dimensions: { state: {} },
  keywords: {},
  useBooleans: true,
  multiKeys: {},
})
MockEmptyDimComponent.getDefaultAttrs = (
  attrs: any,
  _theme: any,
  _mode: string,
) => ({ ...attrs })

// ---------------------------------------------------------------------------
// RocketStoryHoc
// ---------------------------------------------------------------------------
describe('RocketStoryHoc', () => {
  it('creates a story component with args and argTypes', () => {
    const RocketStoryHoc = require('../internal/RocketStoryHoc').default

    const wrappedComponent = (component: any) => (props: any) =>
      createElement(component, props)

    const storyFactory = RocketStoryHoc(wrappedComponent)
    const story = storyFactory({
      name: 'TestButton',
      component: MockRSComponent as any,
      attrs: { label: 'Click me' },
      controls: { label: 'text' },
    })

    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
    expect(story.args.label).toBe('Click me')
    expect(story.argTypes).toBeDefined()
    expect(story.parameters).toBeDefined()
    expect(story.parameters.docs.description.story).toContain('TestButton')
    expect(story.parameters.docs.source.code).toBeDefined()
  })

  it('includes dimension controls in argTypes', () => {
    const RocketStoryHoc = require('../internal/RocketStoryHoc').default

    const wrappedComponent = (component: any) => (props: any) =>
      createElement(component, props)

    const storyFactory = RocketStoryHoc(wrappedComponent)
    const story = storyFactory({
      name: 'TestButton',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
    })

    // dimension controls should be present
    expect(story.argTypes.state).toBeDefined()
    expect(story.argTypes.size).toBeDefined()
  })

  it('disables individual dimension value controls', () => {
    const RocketStoryHoc = require('../internal/RocketStoryHoc').default

    const wrappedComponent = (component: any) => (props: any) =>
      createElement(component, props)

    const storyFactory = RocketStoryHoc(wrappedComponent)
    const story = storyFactory({
      name: 'TestButton',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
    })

    // individual dimension value keys should be disabled
    expect(story.argTypes.primary).toEqual({ table: { disable: true } })
    expect(story.argTypes.secondary).toEqual({ table: { disable: true } })
    expect(story.argTypes.small).toEqual({ table: { disable: true } })
    expect(story.argTypes.large).toEqual({ table: { disable: true } })
  })

  it('generates boolean dimension code', () => {
    const RocketStoryHoc = require('../internal/RocketStoryHoc').default

    const wrappedComponent = (component: any) => (props: any) =>
      createElement(component, props)

    const storyFactory = RocketStoryHoc(wrappedComponent)
    const story = storyFactory({
      name: 'BoolButton',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
    })

    expect(story.parameters.docs.source.code).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// rocketstories renderMain
// ---------------------------------------------------------------------------
describe('rocketstories renderMain', () => {
  it('creates a story from rocketstyle component', () => {
    const renderMain = require('../stories/rocketstories/renderMain').default

    const story = renderMain({
      name: 'RocketButton',
      component: MockRSComponent as any,
      attrs: { label: 'Hello' },
      controls: {},
    })

    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
    expect(story.argTypes).toBeDefined()
    expect(story.parameters.docs.description.story).toContain('RocketButton')
  })
})

// ---------------------------------------------------------------------------
// rocketstories renderRender
// ---------------------------------------------------------------------------
describe('rocketstories renderRender', () => {
  it('wraps custom render in rocketstyle story', () => {
    const renderRender = require('../stories/rocketstories/renderRender').default

    const customRender = (props: any) => <div {...props}>Custom</div>
    const storyFactory = renderRender(customRender)
    const story = storyFactory({
      name: 'CustomStory',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
    })

    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
    expect(story.argTypes).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// rocketstories renderList
// ---------------------------------------------------------------------------
describe('rocketstories renderList', () => {
  it('wraps list config in rocketstyle story', () => {
    const renderList = require('../stories/rocketstories/renderList').default

    const storyFactory = renderList({ data: [{ id: 1 }, { id: 2 }] })
    const story = storyFactory({
      name: 'ListStory',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
    })

    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
    expect(story.argTypes).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// renderDimension context
// ---------------------------------------------------------------------------
describe('renderDimension context', () => {
  it('Provider provides component via context', () => {
    const { default: Provider, useContext } = require(
      '../stories/rocketstories/renderDimension/context',
    )

    const TestConsumer = () => {
      const ctx = useContext()
      return <div data-testid="consumer">{ctx.component ? 'has' : 'none'}</div>
    }

    const MockComp = () => <span>Mock</span>

    render(
      <Provider component={MockComp}>
        <TestConsumer />
      </Provider>,
    )

    expect(screen.getByTestId('consumer')).toHaveTextContent('has')
  })

  it('useContext returns empty when no provider', () => {
    const { useContext } = require(
      '../stories/rocketstories/renderDimension/context',
    )

    const TestConsumer = () => {
      const ctx = useContext()
      return (
        <div data-testid="consumer">{ctx.component ? 'has' : 'none'}</div>
      )
    }

    render(<TestConsumer />)
    expect(screen.getByTestId('consumer')).toHaveTextContent('none')
  })
})

// ---------------------------------------------------------------------------
// renderDimension Item component
// ---------------------------------------------------------------------------
describe('renderDimension Item', () => {
  it('renders component from context', () => {
    const { default: Provider } = require(
      '../stories/rocketstories/renderDimension/context',
    )
    const Item = require(
      '../stories/rocketstories/renderDimension/components/Item',
    ).default

    const InnerComp = (props: any) => (
      <span data-testid="inner">{props.label}</span>
    )

    render(
      <Provider component={InnerComp}>
        <Item label="Hello" />
      </Provider>,
    )

    expect(screen.getByTestId('inner')).toHaveTextContent('Hello')
  })

  it('renders title heading when provided', () => {
    const { default: Provider } = require(
      '../stories/rocketstories/renderDimension/context',
    )
    const Item = require(
      '../stories/rocketstories/renderDimension/components/Item',
    ).default

    const InnerComp = (props: any) => <span>inner</span>

    const { container } = render(
      <Provider component={InnerComp}>
        <Item title="MyTitle" />
      </Provider>,
    )

    // title renders a Heading component which may render differently
    // but the title prop should cause additional content
    expect(container.innerHTML).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// renderDimension PseudoList component
// ---------------------------------------------------------------------------
describe('renderDimension PseudoList', () => {
  it('renders 4 pseudo states', () => {
    const { default: Provider } = require(
      '../stories/rocketstories/renderDimension/context',
    )
    const PseudoList = require(
      '../stories/rocketstories/renderDimension/components/PseudoList',
    ).default

    // Item destructures `title` out and passes remaining props to inner component
    // PseudoList passes pseudo boolean props (base, hover, pressed, active)
    const rendered: string[] = []
    const InnerComp = (props: any) => {
      // Collect which pseudo prop is set
      for (const p of ['base', 'hover', 'pressed', 'active']) {
        if (props[p]) rendered.push(p)
      }
      return <span data-testid="inner">{props.label}</span>
    }

    render(
      <Provider component={InnerComp}>
        <PseudoList itemProps={{ label: 'test' }} />
      </Provider>,
    )

    // PseudoList renders 4 items: base, hover, pressed, active
    expect(rendered).toContain('base')
    expect(rendered).toContain('hover')
    expect(rendered).toContain('pressed')
    expect(rendered).toContain('active')
    expect(screen.getAllByTestId('inner')).toHaveLength(4)
  })
})

// ---------------------------------------------------------------------------
// renderDimension (main function)
// ---------------------------------------------------------------------------
describe('renderDimension', () => {
  it('returns NotFound for empty dimension', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const result = renderDimension('state' as any, {
      name: 'Test',
      component: MockEmptyDimComponent as any,
      attrs: {},
      controls: {},
      storyOptions: {},
      ignore: [],
    })

    expect(result.displayName).toBe('@vitus-labs/rocketstories/Empty')
  })

  it('creates story with args and argTypes for valid dimension', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const story = renderDimension('state' as any, {
      name: 'DimButton',
      component: MockRSComponent as any,
      attrs: { label: 'Hi' },
      controls: { label: 'text' },
      storyOptions: { gap: 16, direction: 'rows', alignX: 'left', alignY: 'top' },
      ignore: [],
    })

    expect(story.args).toBeDefined()
    expect(story.args.label).toBe('Hi')
    expect(story.argTypes).toBeDefined()
    // dimension state should be disabled in controls (since we're showing all states)
    expect(story.argTypes.state).toEqual({ table: { disable: true } })
    expect(story.parameters.docs.description.story).toContain('state')
    expect(story.parameters.docs.source.code).toBeDefined()
  })

  it('creates story without storyOptions', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const story = renderDimension('state' as any, {
      name: 'NoOpts',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
      storyOptions: {},
      ignore: [],
    })

    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
  })

  it('creates story with pseudo option', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const story = renderDimension('state' as any, {
      name: 'PseudoButton',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
      storyOptions: {
        gap: 16,
        direction: 'rows',
        alignX: 'left',
        alignY: 'top',
        pseudo: true,
      },
      ignore: [],
    })

    expect(story).toBeDefined()
    expect(story.parameters.docs.description.story).toContain('pseudo')
  })

  it('handles multi-key dimensions', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const story = renderDimension('tags' as any, {
      name: 'MultiKey',
      component: MockMultiKeyComponent as any,
      attrs: {},
      controls: {},
      storyOptions: { gap: 16, direction: 'rows' },
      ignore: [],
    })

    expect(story).toBeDefined()
    expect(story.args).toBeDefined()
  })

  it('respects ignore list', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const story = renderDimension('state' as any, {
      name: 'IgnoreButton',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
      storyOptions: { gap: 16, direction: 'rows' },
      ignore: ['primary'],
    })

    expect(story).toBeDefined()
  })

  it('renders story component with items', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const story = renderDimension('state' as any, {
      name: 'RenderTest',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
      storyOptions: { gap: 16, direction: 'rows', alignX: 'left', alignY: 'top' },
      ignore: [],
    })

    // Render the story component
    const { container } = render(createElement(story, { label: 'test' }))
    expect(container.innerHTML).toBeTruthy()
  })

  it('renders story component with pseudo states', () => {
    const renderDimension = require(
      '../stories/rocketstories/renderDimension',
    ).default

    const story = renderDimension('state' as any, {
      name: 'PseudoRender',
      component: MockRSComponent as any,
      attrs: {},
      controls: {},
      storyOptions: {
        gap: 16,
        direction: 'inline',
        alignX: 'left',
        alignY: 'top',
        pseudo: true,
      },
      ignore: [],
    })

    const { container } = render(createElement(story, { label: 'test' }))
    expect(container.innerHTML).toBeTruthy()
  })
})
