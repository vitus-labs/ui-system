import { render } from '@testing-library/react'
import { type FC, createRef, forwardRef } from 'react'
import { describe, expect, it } from 'vitest'
import { css } from '../css'
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
      const Comp = styled.div`color: red;`
      const { container } = render(<Comp />)
      expect(container.lastElementChild?.nodeName).toBe('DIV')
      const el = container.lastElementChild as HTMLElement
      expect(el.className).toMatch(/^vl-/)
    })

    it('works with styled.span', () => {
      const Comp = styled.span`font-size: 16px;`
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
      }) => (
        <div className={className} data-custom={customProp} />
      )
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
})
