import { render, screen } from '@testing-library/react'
import { Provider, breakpoints } from '@vitus-labs/unistyle'
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
      expect(Element.VITUS_LABS__COMPONENT).toBe(
        '@vitus-labs/elements/Element',
      )
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
        <Element
          beforeContent={<span data-testid="before">Before</span>}
        >
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
        <Element tag="img" data-testid="img" alt="test" src="test.png" />,
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
})
