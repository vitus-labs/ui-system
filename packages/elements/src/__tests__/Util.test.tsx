import { render, screen } from '@testing-library/react'
import Util from '../Util/component'

describe('Util', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(Util.displayName).toBe('@vitus-labs/elements/Util')
    })

    it('has pkgName', () => {
      expect(Util.pkgName).toBe('@vitus-labs/elements')
    })
  })

  describe('className injection', () => {
    it('injects string className', () => {
      render(
        <Util className="my-class">
          <div data-testid="child">Content</div>
        </Util>,
      )
      expect(screen.getByTestId('child')).toHaveClass('my-class')
    })

    it('joins array className', () => {
      render(
        <Util className={['cls-a', 'cls-b']}>
          <div data-testid="child">Content</div>
        </Util>,
      )
      const el = screen.getByTestId('child')
      expect(el).toHaveClass('cls-a')
      expect(el).toHaveClass('cls-b')
    })
  })

  describe('style injection', () => {
    it('injects style object', () => {
      render(
        <Util style={{ color: 'red' }}>
          <div data-testid="child">Content</div>
        </Util>,
      )
      expect(screen.getByTestId('child')).toHaveStyle({
        color: 'rgb(255, 0, 0)',
      })
    })
  })

  describe('style only (no className)', () => {
    it('injects style without adding className', () => {
      render(
        <Util style={{ fontSize: '20px' }}>
          <div data-testid="child">Content</div>
        </Util>,
      )
      const el = screen.getByTestId('child')
      expect(el).toHaveStyle({ fontSize: '20px' })
      expect(el.className).toBe('')
    })
  })

  describe('className only (no style)', () => {
    it('injects className without adding style', () => {
      render(
        <Util className="only-class">
          <div data-testid="child">Content</div>
        </Util>,
      )
      const el = screen.getByTestId('child')
      expect(el).toHaveClass('only-class')
      expect(el.getAttribute('style')).toBeNull()
    })
  })

  describe('both className and style', () => {
    it('injects both className and style', () => {
      render(
        <Util className="my-class" style={{ color: 'blue' }}>
          <div data-testid="child">Content</div>
        </Util>,
      )
      const el = screen.getByTestId('child')
      expect(el).toHaveClass('my-class')
      expect(el).toHaveStyle({ color: 'rgb(0, 0, 255)' })
    })
  })

  describe('no-op when no props', () => {
    it('renders children without modification when no className or style', () => {
      render(
        <Util>
          <div data-testid="child">Content</div>
        </Util>,
      )
      const el = screen.getByTestId('child')
      expect(el).toBeInTheDocument()
      expect(el.className).toBe('')
      expect(el.getAttribute('style')).toBeNull()
    })
  })
})
