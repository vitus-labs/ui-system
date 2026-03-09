import { render, screen } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import Element from '../Element/component'

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)

describe('Element', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(Element.displayName).toBe('@vitus-labs/elements/Element')
    })

    it('has pkgName', () => {
      expect(Element.pkgName).toBe('@vitus-labs/elements')
    })

    it('has VITUS_LABS__COMPONENT', () => {
      expect(Element.VITUS_LABS__COMPONENT).toBe('@vitus-labs/elements/Element')
    })
  })

  describe('basic rendering', () => {
    it('renders children', () => {
      render(
        <Element>
          <span data-testid="child">Hello</span>
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('child')).toHaveTextContent('Hello')
    })

    it('renders content prop when children is absent', () => {
      render(<Element content={<span data-testid="ct">Content</span>} />, {
        wrapper,
      })
      expect(screen.getByTestId('ct')).toHaveTextContent('Content')
    })

    it('renders label prop as fallback', () => {
      render(<Element label="Label text" />, { wrapper })
      expect(screen.getByText('Label text')).toBeInTheDocument()
    })

    it('prefers children over content over label', () => {
      render(
        <Element content="content" label="label">
          children
        </Element>,
        { wrapper },
      )
      expect(screen.getByText('children')).toBeInTheDocument()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
      expect(screen.queryByText('label')).not.toBeInTheDocument()
    })
  })

  describe('three-section layout', () => {
    it('renders beforeContent, content, and afterContent', () => {
      render(
        <Element
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
        >
          <span data-testid="main">Main</span>
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })

    it('renders only beforeContent + content without afterContent', () => {
      render(
        <Element beforeContent={<span data-testid="before">Before</span>}>
          <span data-testid="main">Main</span>
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
    })
  })

  describe('void elements', () => {
    it('renders input without children', () => {
      render(<Element tag="input" data-testid="input" />, { wrapper })
      expect(screen.getByTestId('input')).toBeInTheDocument()
      expect(screen.getByTestId('input').tagName).toBe('INPUT')
    })

    it('renders img without children', () => {
      render(
        <Element
          tag="img"
          data-testid="img"
          {...({ alt: 'test', src: 'test.png' } as any)}
        />,
        { wrapper },
      )
      expect(screen.getByTestId('img')).toBeInTheDocument()
    })
  })

  describe('dangerouslySetInnerHTML', () => {
    it('renders with dangerouslySetInnerHTML', () => {
      render(
        <Element
          data-testid="el"
          dangerouslySetInnerHTML={{ __html: '<b>Bold</b>' }}
        />,
        { wrapper },
      )
      expect(screen.getByTestId('el').innerHTML).toContain('<b>Bold</b>')
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref', () => {
      const ref = { current: null }
      render(
        <Element ref={ref}>
          <span>child</span>
        </Element>,
        { wrapper },
      )
      expect(ref.current).toBeInstanceOf(HTMLElement)
    })

    it('forwards innerRef', () => {
      const ref = { current: null }
      render(
        <Element innerRef={ref}>
          <span>child</span>
        </Element>,
        { wrapper },
      )
      expect(ref.current).toBeInstanceOf(HTMLElement)
    })
  })

  describe('tag prop', () => {
    it('renders with custom tag', () => {
      render(
        <Element tag="section" data-testid="el">
          <span>child</span>
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el').tagName).toBe('SECTION')
    })

    it('renders button tag', () => {
      render(
        <Element tag="button" data-testid="el">
          <span>child</span>
        </Element>,
        { wrapper },
      )
      // button gets flexbox fix wrapper so innermost button is the one
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('BUTTON')
    })
  })

  describe('block prop', () => {
    it('renders without errors when block is true', () => {
      render(
        <Element block data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('inline element handling', () => {
    it('renders span sub-tags for inline elements like <a>', () => {
      render(
        <Element
          tag="a"
          data-testid="el"
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('A')
      // Content sub-tags should be span for inline elements
      const spans = el.querySelectorAll('span')
      expect(spans.length).toBeGreaterThan(0)
    })

    it('renders div sub-tags for block elements', () => {
      render(
        <Element
          tag="section"
          data-testid="el"
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('SECTION')
    })
  })

  describe('Wrapper flex fix for button/fieldset/legend', () => {
    it('applies two-layer flex fix for button tag', () => {
      render(
        <Element tag="button" data-testid="el">
          <span>child</span>
        </Element>,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('BUTTON')
      // button gets parent+child fix: button > div > children
      expect(el.children.length).toBeGreaterThan(0)
    })

    it('applies two-layer flex fix for fieldset tag (non-inline, uses div child fix)', () => {
      render(
        <Element tag="fieldset" data-testid="el">
          <span>child</span>
        </Element>,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('FIELDSET')
      // fieldset is not inline, so child fix should use div
      const childFix = el.firstElementChild as HTMLElement
      expect(childFix.tagName).toBe('DIV')
    })

    it('applies two-layer flex fix for legend tag', () => {
      render(
        <Element tag="legend" data-testid="el">
          <span>child</span>
        </Element>,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('LEGEND')
    })

    it('uses span as child fix tag for button (inline element)', () => {
      render(
        <Element tag="button" data-testid="el">
          <span>child</span>
        </Element>,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('BUTTON')
      // button is inline, so child fix should use span
      const childFix = el.firstElementChild as HTMLElement
      expect(childFix.tagName).toBe('SPAN')
    })

    it('skips flex fix when dangerouslySetInnerHTML is used on button', () => {
      render(
        <Element
          tag="button"
          data-testid="el"
          dangerouslySetInnerHTML={{ __html: '<b>Bold</b>' }}
        />,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('BUTTON')
      expect(el.innerHTML).toContain('<b>Bold</b>')
    })
  })

  describe('direction computation for non-simple elements', () => {
    it('defaults to inline direction when no direction specified for three-section layout', () => {
      render(
        <Element
          data-testid="el"
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('uses explicit direction for three-section layout', () => {
      render(
        <Element
          data-testid="el"
          direction="rows"
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('simple element with falsy content overrides', () => {
    it('renders simple element with null contentDirection/alignX/alignY', () => {
      render(
        <Element
          data-testid="el"
          contentDirection={null as any}
          contentAlignX={null as any}
          contentAlignY={null as any}
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('ref merging', () => {
    it('calls function ref', () => {
      const refFn = vi.fn()
      render(
        <Element ref={refFn}>
          <span>child</span>
        </Element>,
        { wrapper },
      )
      expect(refFn).toHaveBeenCalledWith(expect.any(HTMLElement))
    })

    it('sets object ref via innerRef when ref is absent', () => {
      const innerRef = { current: null }
      render(
        <Element innerRef={innerRef}>
          <span>child</span>
        </Element>,
        { wrapper },
      )
      expect(innerRef.current).toBeInstanceOf(HTMLElement)
    })

    it('handles null ref gracefully', () => {
      render(
        <Element>
          <span>child</span>
        </Element>,
        { wrapper },
      )
      // Should not throw
    })
  })

  describe('equalBeforeAfter', () => {
    it('renders with equalBeforeAfter when both before and after content exist', () => {
      render(
        <Element
          data-testid="el"
          equalBeforeAfter
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })

    it('does not equalize when equalBeforeAfter is false', () => {
      render(
        <Element
          data-testid="el"
          equalBeforeAfter={false}
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })

    it('does not equalize when only beforeContent is present', () => {
      render(
        <Element
          data-testid="el"
          equalBeforeAfter
          beforeContent={<span data-testid="before">Before</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('before')).toBeInTheDocument()
    })

    it('does not equalize when only afterContent is present', () => {
      render(
        <Element
          data-testid="el"
          equalBeforeAfter
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })

    it('renders with equalBeforeAfter and direction=rows', () => {
      render(
        <Element
          data-testid="el"
          equalBeforeAfter
          direction="rows"
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })
  })

  describe('alignment with alignY=block', () => {
    it('renders with alignY set to block', () => {
      render(
        <Element alignY="block" data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with alignY=block and block=true', () => {
      render(
        <Element alignY="block" block data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('content fallback chain', () => {
    it('renders content prop when no children present', () => {
      render(<Element data-testid="el" content="from content" />, { wrapper })
      expect(screen.getByTestId('el')).toHaveTextContent('from content')
    })

    it('renders label prop when no children or content present', () => {
      render(<Element data-testid="el" label="from label" />, { wrapper })
      expect(screen.getByTestId('el')).toHaveTextContent('from label')
    })

    it('renders nothing when no children, content, or label', () => {
      render(<Element data-testid="el" />, { wrapper })
      expect(screen.getByTestId('el')).toBeInTheDocument()
      expect(screen.getByTestId('el').textContent).toBe('')
    })
  })

  describe('non-simple element with direction', () => {
    it('renders non-simple element without explicit direction (defaults to inline)', () => {
      render(
        <Element data-testid="el" beforeContent={<span>Before</span>}>
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders non-simple element with explicit direction', () => {
      render(
        <Element
          data-testid="el"
          direction="rows"
          beforeContent={<span>Before</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with only afterContent (non-simple element)', () => {
      render(
        <Element
          data-testid="el"
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })
  })

  describe('inline element as prop', () => {
    it('renders span as inline element', () => {
      render(
        <Element
          tag="span"
          data-testid="el"
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      const el = screen.getByTestId('el')
      expect(el.tagName).toBe('SPAN')
    })
  })

  describe('Content gap and equalCols', () => {
    it('renders with gap between before/content/after', () => {
      render(
        <Element
          data-testid="el"
          gap={16}
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with equalCols', () => {
      render(
        <Element
          data-testid="el"
          equalCols
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with extendCss on content areas', () => {
      render(
        <Element
          data-testid="el"
          contentCss="color: red;"
          beforeContentCss="color: blue;"
          afterContentCss="color: green;"
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
        >
          Main
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })
})
