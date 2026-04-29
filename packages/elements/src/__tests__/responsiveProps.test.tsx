import { render, screen } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import Element from '../Element/component'

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)

describe('Element responsive props', () => {
  describe('single values', () => {
    it('renders with alignX as string', () => {
      render(
        <Element alignX="center" data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with alignY as string', () => {
      render(
        <Element alignY="top" data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with direction as string', () => {
      render(
        <Element direction="rows" data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with gap as number', () => {
      render(
        <Element
          gap={16}
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with block as boolean', () => {
      render(
        <Element block data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with equalCols as boolean', () => {
      render(
        <Element
          equalCols
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('array values (positional breakpoints)', () => {
    it('renders with alignX as array', () => {
      render(
        <Element alignX={['left', 'center', 'right'] as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with alignY as array', () => {
      render(
        <Element alignY={['top', 'center', 'bottom'] as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with direction as array', () => {
      render(
        <Element direction={['rows', 'inline'] as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with gap as array', () => {
      render(
        <Element
          gap={[8, 16, 24] as any}
          beforeContent={<span>Before</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with block as array', () => {
      render(
        <Element block={[false, true] as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with equalCols as array', () => {
      render(
        <Element
          equalCols={[false, true] as any}
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('breakpoint object values', () => {
    it('renders with alignX as breakpoint object', () => {
      render(
        <Element
          alignX={{ xs: 'left', md: 'center', xl: 'right' } as any}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with alignY as breakpoint object', () => {
      render(
        <Element alignY={{ xs: 'top', lg: 'center' } as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with direction as breakpoint object', () => {
      render(
        <Element
          direction={{ xs: 'rows', md: 'inline' } as any}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with gap as breakpoint object', () => {
      render(
        <Element
          gap={{ xs: 8, md: 16, lg: 24 } as any}
          beforeContent={<span>Before</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with block as breakpoint object', () => {
      render(
        <Element block={{ xs: false, md: true } as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('combined responsive props', () => {
    it('renders with multiple responsive props simultaneously', () => {
      render(
        <Element
          alignX={{ xs: 'left', md: 'center' } as any}
          alignY={['top', 'center'] as any}
          direction={{ xs: 'rows', lg: 'inline' } as any}
          block={[false, true] as any}
          gap={16}
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
          data-testid="el"
        >
          <span data-testid="main">Main</span>
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })

    it('renders with responsive content directions', () => {
      render(
        <Element
          contentDirection={{ xs: 'rows', md: 'inline' } as any}
          beforeContentDirection={{ xs: 'inline', lg: 'rows' } as any}
          afterContentDirection="inline"
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
          data-testid="el"
        >
          <span data-testid="main">Main</span>
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('main')).toBeInTheDocument()
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })

    it('renders with responsive content alignment', () => {
      render(
        <Element
          contentAlignX={{ xs: 'left', md: 'center' } as any}
          contentAlignY={['top', 'center', 'bottom'] as any}
          beforeContentAlignX="left"
          afterContentAlignX="right"
          beforeContent={<span>Before</span>}
          afterContent={<span>After</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })
  })

  describe('responsive css prop', () => {
    it('renders with css as string', () => {
      render(
        <Element css="background: red;" data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with contentCss', () => {
      render(
        <Element
          contentCss="color: blue;"
          beforeContent={<span>Before</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
    })

    it('renders with beforeContentCss and afterContentCss', () => {
      render(
        <Element
          beforeContentCss="padding: 4px;"
          afterContentCss="padding: 8px;"
          beforeContent={<span data-testid="before">Before</span>}
          afterContent={<span data-testid="after">After</span>}
          data-testid="el"
        >
          content
        </Element>,
        { wrapper },
      )
      expect(screen.getByTestId('el')).toBeInTheDocument()
      expect(screen.getByTestId('before')).toBeInTheDocument()
      expect(screen.getByTestId('after')).toBeInTheDocument()
    })
  })

  describe('alignment values', () => {
    const alignXValues = [
      'left',
      'center',
      'right',
      'spaceBetween',
      'spaceAround',
      'block',
    ] as const

    const alignYValues = [
      'top',
      'center',
      'bottom',
      'spaceBetween',
      'spaceAround',
      'block',
    ] as const

    for (const value of alignXValues) {
      it(`renders with alignX="${value}"`, () => {
        render(
          <Element alignX={value} data-testid="el">
            content
          </Element>,
          { wrapper },
        )
        expect(screen.getByTestId('el')).toBeInTheDocument()
      })
    }

    for (const value of alignYValues) {
      it(`renders with alignY="${value}"`, () => {
        render(
          <Element alignY={value} data-testid="el">
            content
          </Element>,
          { wrapper },
        )
        expect(screen.getByTestId('el')).toBeInTheDocument()
      })
    }
  })

  describe('direction values', () => {
    const directionValues = [
      'inline',
      'rows',
      'reverseInline',
      'reverseRows',
    ] as const

    for (const value of directionValues) {
      it(`renders with direction="${value}"`, () => {
        render(
          <Element direction={value} data-testid="el">
            content
          </Element>,
          { wrapper },
        )
        expect(screen.getByTestId('el')).toBeInTheDocument()
      })
    }
  })

  // Regression coverage for the bug where the responsive `block` prop flipped
  // `display: flex ↔ inline-flex` correctly but never reset the companion
  // `align-self: stretch` / `width: 100%` / `height: 100%` set by the truthy
  // branch — leaving an "inline-flex" element still pegged to full width via
  // CSS cascade. The fix in Wrapper/styled.ts now always emits a value for
  // each property (auto when block is false), so non-matching breakpoints
  // override the prior breakpoint cleanly.
  describe('responsive block resets companion props at non-matching breakpoints', () => {
    /**
     * Walk the rendered element + all descendants and collect every CSS rule
     * (top-level + nested in @media) whose selector targets one of the
     * tree's own classes. This isolates the inspection from leftover rules
     * inserted by other tests in this suite, since the styler stylesheet
     * persists across renders. Wrapper styles live a couple levels deep,
     * so the descendants must be included.
     */
    const collectCssForTree = (root: HTMLElement) => {
      const seen = new Set<string>()
      const all = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
      for (const el of all) {
        for (const cls of Array.from(el.classList)) seen.add(cls)
      }
      const matches: string[] = []
      for (const styleEl of Array.from(
        document.querySelectorAll<HTMLStyleElement>('style[data-vl]'),
      )) {
        const sheet = styleEl.sheet
        if (!sheet) continue
        const visit = (rules: CSSRuleList) => {
          for (const rule of Array.from(rules)) {
            if (rule instanceof CSSStyleRule) {
              const cls =
                rule.selectorText.replace(/^\./, '').split(/[.:\s]/)[0] ?? ''
              if (seen.has(cls)) matches.push(rule.cssText)
            } else if (
              typeof CSSMediaRule !== 'undefined' &&
              rule instanceof CSSMediaRule
            ) {
              visit(rule.cssRules)
            }
          }
        }
        visit(sheet.cssRules)
      }
      return matches.join('\n')
    }

    it('block={{ xs: true, md: false }} emits explicit auto resets at md', () => {
      const { container } = render(
        <Element block={{ xs: true, md: false } as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      const css = collectCssForTree(container as HTMLElement)
      // Both branches of the responsive cascade must appear in the inserted CSS.
      // The `block: false` branch must include the explicit auto resets so
      // it overrides the `block: true` declarations from the smaller breakpoint.
      expect(css).toMatch(/align-self:\s*auto/)
      expect(css).toMatch(/width:\s*auto/)
      // And the `block: true` branch still emits the stretch/full-width values.
      expect(css).toMatch(/align-self:\s*stretch/)
      expect(css).toMatch(/width:\s*100%/)
    })

    it('block={{ xs: false, md: true }} emits both display values + paired sizing', () => {
      const { container } = render(
        <Element block={{ xs: false, md: true } as any} data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      const css = collectCssForTree(container as HTMLElement)
      // Both display values present (the existing-correct behavior).
      expect(css).toMatch(/display:\s*inline-flex/)
      expect(css).toMatch(/display:\s*flex/)
      // Both branches of the auto/stretch reset must appear.
      expect(css).toMatch(/align-self:\s*stretch/)
      expect(css).toMatch(/align-self:\s*auto/)
      expect(css).toMatch(/width:\s*100%/)
      expect(css).toMatch(/width:\s*auto/)
    })

    it('block + alignY="block" together emit both stretch and full-height values', () => {
      // Covers the simultaneous-truthy branch of all three ternaries
      // (`align-self: stretch`, `width: 100%`, `height: 100%`) in a single
      // render. Note: for simple-element children Element overrides
      // wrapperAlignY with contentAlignY, so we set it on `contentAlignY`
      // for the `t.alignY === 'block'` branch to actually reach the wrapper.
      const { container } = render(
        <Element block contentAlignY="block" data-testid="el">
          content
        </Element>,
        { wrapper },
      )
      const css = collectCssForTree(container as HTMLElement)
      expect(css).toMatch(/align-self:\s*stretch/)
      expect(css).toMatch(/width:\s*100%/)
      expect(css).toMatch(/height:\s*100%/)
    })
  })
})
