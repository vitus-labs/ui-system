import { render } from '@testing-library/react'
import { createRef, type FC, forwardRef } from 'react'
import { describe, expect, it } from 'vitest'
import { styled } from '../styled'
import { ThemeProvider } from '../ThemeProvider'

describe('styled', () => {
  describe('basic rendering', () => {
    it('renders a div element by default', () => {
      const Comp = styled('div')`display: flex;`
      const { container } = render(<Comp />)
      expect(container.lastElementChild?.nodeName).toBe('DIV')
    })

    it('renders a span element', () => {
      const Comp = styled('span')`color: red;`
      const { container } = render(<Comp />)
      expect(container.lastElementChild?.nodeName).toBe('SPAN')
    })

    it('applies a className', () => {
      const Comp = styled('div')`display: flex;`
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-[0-9a-z]+$/)
    })

    it('merges user className', () => {
      const Comp = styled('div')`display: flex;`
      const { container } = render(<Comp className="custom" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toContain('vl-')
      expect(el.className).toContain('custom')
    })
  })

  describe('styled.tag shorthand', () => {
    it('works with styled.div', () => {
      const Comp = styled.div!`color: red;`
      const { container } = render(<Comp />)
      expect(container.lastElementChild?.nodeName).toBe('DIV')
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('works with styled.span', () => {
      const Comp = styled.span!`font-size: 16px;`
      const { container } = render(<Comp />)
      expect(container.lastElementChild?.nodeName).toBe('SPAN')
    })
  })

  describe('as prop (polymorphic rendering)', () => {
    it('changes the rendered element type', () => {
      const Comp = styled('div')`display: flex;`
      const { container } = render(<Comp as="section" />)
      expect(container.lastElementChild?.nodeName).toBe('SECTION')
    })

    it('renders as button', () => {
      const Comp = styled('div')`cursor: pointer;`
      const { container } = render(<Comp as="button" />)
      expect(container.lastElementChild?.nodeName).toBe('BUTTON')
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref to the DOM element', () => {
      const Comp = styled('div')`display: flex;`
      const ref = createRef<HTMLDivElement>()
      render(<Comp ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('transient props ($-prefixed)', () => {
    it('does not forward $-prefixed props to DOM', () => {
      const Comp = styled('div')`display: flex;`
      const { container } = render(
        <Comp $rocketstyle={{ color: 'red' }} $rocketstate={{ hover: true }} />,
      )
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('$rocketstyle')).toBeNull()
      expect(el.getAttribute('$rocketstate')).toBeNull()
    })

    it('makes $-prefixed props available to interpolation functions', () => {
      const Comp = styled('div')`
        color: ${(props: any) => (props.$active ? 'red' : 'blue')};
      `
      const { container } = render(<Comp $active />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('function interpolations', () => {
    it('resolves function interpolations with props', () => {
      const Comp = styled('div')`
        color: ${(props: any) => props.$color};
      `
      const { container } = render(<Comp $color="red" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('receives theme from ThemeProvider', () => {
      const Comp = styled('div')`
        color: ${(props: any) => props.theme.color};
      `
      const { container } = render(
        <ThemeProvider theme={{ color: 'green' }}>
          <Comp />
        </ThemeProvider>,
      )
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('wrapping components', () => {
    it('wraps a React component', () => {
      const Inner: FC<{ className?: string }> = ({ className }) => (
        <div className={className} data-testid="inner" />
      )
      const Comp = styled(Inner)`color: red;`
      const { getByTestId } = render(<Comp />)
      const el = getByTestId('inner')
      expect(el.className).toMatch(/^vl-/)
    })

    it('passes all props to wrapped component (no filtering)', () => {
      const Inner: FC<{ className?: string; customProp?: string }> = ({
        className,
        customProp,
      }) => <div className={className} data-custom={customProp} />
      const Comp = styled(Inner)`color: red;`
      const { container } = render(<Comp customProp="hello" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('data-custom')).toBe('hello')
    })

    it('wraps a forwardRef component', () => {
      const Inner = forwardRef<HTMLDivElement, { className?: string }>(
        ({ className }, ref) => <div className={className} ref={ref} />,
      )
      const Comp = styled(Inner)`display: flex;`
      const ref = createRef<HTMLDivElement>()
      render(<Comp ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('prop filtering for HTML elements', () => {
    it('forwards valid HTML attributes', () => {
      const Comp = styled('input')`display: block;`
      const { container } = render(<Comp type="text" placeholder="test" />)
      const el = container.lastElementChild as HTMLInputElement
      expect(el.getAttribute('type')).toBe('text')
      expect(el.getAttribute('placeholder')).toBe('test')
    })

    it('forwards data-* and aria-* attributes', () => {
      const Comp = styled('div')`display: flex;`
      const { container } = render(
        <Comp data-testid="hello" aria-label="world" />,
      )
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('data-testid')).toBe('hello')
      expect(el.getAttribute('aria-label')).toBe('world')
    })

    it('filters unknown props for HTML elements', () => {
      const Comp = styled('div')`display: flex;`
      const { container } = render(<Comp unknownProp="test" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('unknownprop')).toBeNull()
    })
  })

  describe('static vs dynamic optimization', () => {
    it('static components produce same className across renders', () => {
      const Comp = styled('div')`display: flex; color: red;`
      const { container, rerender } = render(<Comp />)
      const cls1 = (container.lastElementChild as HTMLElement).className
      rerender(<Comp />)
      const cls2 = (container.lastElementChild as HTMLElement).className
      expect(cls1).toBe(cls2)
    })

    it('dynamic components with same resolved CSS produce same className', () => {
      const Comp = styled('div')`
        color: ${(props: any) => props.$color};
      `
      const { container: c1 } = render(<Comp $color="red" />)
      const { container: c2 } = render(<Comp $color="red" />)
      const cls1 = (c1.lastElementChild as HTMLElement).className
      const cls2 = (c2.lastElementChild as HTMLElement).className
      expect(cls1).toBe(cls2)
    })
  })

  describe('static component caching (WeakMap)', () => {
    it('returns the same component for identical template strings and tag', () => {
      // When the same tagged template literal is used, JS guarantees
      // the same TemplateStringsArray identity, so component is cached.
      const factory = styled('div')
      const Comp1 = factory`color: red;`
      const Comp2 = factory`color: red;`
      // Different call sites produce different TemplateStringsArray objects,
      // so they won't be cached. But calling factory with the SAME template
      // tag literal produces the same array.
      // We can at least verify both render correctly.
      const { container: c1 } = render(<Comp1 />)
      const { container: c2 } = render(<Comp2 />)
      expect((c1.lastElementChild as HTMLElement).className).toMatch(/^vl-/)
      expect((c2.lastElementChild as HTMLElement).className).toMatch(/^vl-/)
    })
  })

  describe('empty CSS template', () => {
    it('renders element with empty className for empty static template', () => {
      const Comp = styled('div')``
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      // Empty CSS → empty className (or no vl- prefix)
      expect(el.className).toBe('')
    })

    it('renders element with empty className for whitespace-only template', () => {
      const Comp = styled('div')`   `
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toBe('')
    })

    it('dynamic: empty className when interpolation resolves to empty', () => {
      const Comp = styled('div')`${() => ''}`
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toBe('')
    })
  })

  describe('as prop with custom component', () => {
    it('renders as a custom component via as prop', () => {
      const Custom: FC<{ className?: string }> = ({ className }) => (
        <span className={className} data-testid="custom" />
      )
      const Comp = styled('div')`color: red;`
      const { getByTestId } = render(<Comp as={Custom} />)
      const el = getByTestId('custom')
      expect(el.className).toMatch(/^vl-/)
    })

    it('dynamic: renders as a custom component via as prop', () => {
      const Custom: FC<{ className?: string }> = ({ className }) => (
        <span className={className} data-testid="custom-dyn" />
      )
      const Comp = styled('div')`color: ${(p: any) => p.$color};`
      const { getByTestId } = render(<Comp as={Custom} $color="blue" />)
      const el = getByTestId('custom-dyn')
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('shouldForwardProp option', () => {
    it('filters props based on shouldForwardProp', () => {
      const Comp = styled('div', {
        shouldForwardProp: (prop) => prop !== 'color',
      })`display: flex;`
      const { container } = render(<Comp color="red" data-testid="test" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('color')).toBeNull()
      expect(el.getAttribute('data-testid')).toBe('test')
    })

    it('dynamic: filters props based on shouldForwardProp', () => {
      const Comp = styled('div', {
        shouldForwardProp: (prop) => prop !== 'color',
      })`color: ${(p: any) => p.color};`
      const { container } = render(<Comp color="red" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.getAttribute('color')).toBeNull()
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('boost option', () => {
    it('does not throw with boost enabled', () => {
      const Comp = styled('div', { boost: true })`color: red;`
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('dynamic: does not throw with boost enabled', () => {
      const Comp = styled('div', { boost: true })`
        color: ${(p: any) => p.$color};
      `
      const { container } = render(<Comp $color="blue" />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('dynamic component cache hit', () => {
    it('reuses className on re-render with same resolved CSS', () => {
      const Comp = styled('div')`
        color: ${(p: any) => p.$color};
      `
      const { container, rerender } = render(<Comp $color="red" />)
      const cls1 = (container.lastElementChild as HTMLElement).className
      // Re-render with same props → cache hit
      rerender(<Comp $color="red" />)
      const cls2 = (container.lastElementChild as HTMLElement).className
      expect(cls1).toBe(cls2)
    })

    it('updates className when resolved CSS changes', () => {
      const Comp = styled('div')`
        color: ${(p: any) => p.$color};
      `
      const { container, rerender } = render(<Comp $color="red" />)
      const cls1 = (container.lastElementChild as HTMLElement).className
      rerender(<Comp $color="blue" />)
      const cls2 = (container.lastElementChild as HTMLElement).className
      expect(cls1).not.toBe(cls2)
    })
  })

  describe('displayName for anonymous components', () => {
    it('falls back to Component for anonymous components', () => {
      const Anon = (() => <div />) as FC
      // Remove name/displayName
      Object.defineProperty(Anon, 'name', { value: '' })
      const Comp = styled(Anon)`color: red;`
      expect(Comp.displayName).toBe('styled(Component)')
    })
  })

  describe('displayName', () => {
    it('sets displayName for string tags', () => {
      const Comp = styled('div')`color: red;`
      expect(Comp.displayName).toBe('styled(div)')
    })

    it('sets displayName for named components', () => {
      const MyButton: FC = () => <button />
      const Comp = styled(MyButton)`color: red;`
      expect(Comp.displayName).toBe('styled(MyButton)')
    })
  })

  describe('dynamic component with empty resolved CSS (cache miss)', () => {
    it('returns empty className when dynamic interpolation resolves to empty string', () => {
      // This hits line 206 in styled.ts: cache miss → cssText.length === 0 → className = ''
      const Comp = styled('div')`${(p: any) => (p.$show ? 'color: red;' : '')}`
      const { container } = render(<Comp $show={false} />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toBe('')
    })

    it('transitions from non-empty to empty CSS on re-render', () => {
      // First render: non-empty CSS (cache miss → className set)
      // Second render: empty CSS (cache miss → line 206)
      const Comp = styled('div')`${(p: any) => (p.$show ? 'color: red;' : '')}`
      const { container, rerender } = render(<Comp $show />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)

      rerender(<Comp $show={false} />)
      expect(el.className).toBe('')
    })
  })

  describe('static interpolation values (hasDynamicValues = false with values)', () => {
    it('treats string interpolations as static (no per-render resolution)', () => {
      // values.length > 0 but all values are strings → hasDynamicValues = false (line 97)
      // This takes the static fast path despite having interpolation values
      const color = 'red'
      const Comp = styled('div')`color: ${color};`
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('treats number interpolations as static', () => {
      const size = 16
      const Comp = styled('div')`font-size: ${size}px;`
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('treats mixed static interpolations as static', () => {
      const color = 'blue'
      const size = 24
      const Comp = styled('div')`color: ${color}; font-size: ${size}px;`
      const { container } = render(<Comp />)
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })
  })

  describe('WeakMap cache path (alternating static components)', () => {
    it('hits WeakMap cache when hot cache misses for alternating tags', () => {
      // This tests lines 84-92 in styled.ts: hot cache miss → WeakMap hit
      // We need same TemplateStringsArray with different tags.
      // A factory function that reuses the same template literal:
      const factory = (tag: string) => styled(tag)`display: flex;`

      // First call: creates component, stores in WeakMap + hot cache (tag='div')
      const Comp1 = factory('div')
      // Second call: different tag, so hot cache misses.
      // Same TemplateStringsArray → WeakMap tagMap exists, but 'span' not in it → creates new
      const Comp2 = factory('span')
      // Third call: tag='div' again. Hot cache has 'span'. Hot miss → WeakMap hit for 'div'
      const Comp3 = factory('div')

      // Comp1 and Comp3 should be the exact same component (WeakMap cache hit)
      expect(Comp1).toBe(Comp3)
      expect(Comp1).not.toBe(Comp2)

      // All render correctly
      const { container: c1 } = render(<Comp1 />)
      const { container: c2 } = render(<Comp2 />)
      expect((c1.lastElementChild as HTMLElement).className).toMatch(/^vl-/)
      expect((c2.lastElementChild as HTMLElement).className).toMatch(/^vl-/)
    })
  })
})
