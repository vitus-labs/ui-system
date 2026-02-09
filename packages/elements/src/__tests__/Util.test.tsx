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

  describe('no-op when no props', () => {
    it('renders children without modification when no className or style', () => {
      render(
        <Util>
          <div data-testid="child">Content</div>
        </Util>,
      )
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  })
})
