import { render, screen, act } from '@testing-library/react'
import Portal from '../Portal/component'

describe('Portal', () => {
  describe('statics', () => {
    it('has displayName', () => {
      expect(Portal.displayName).toBe('@vitus-labs/elements/Portal')
    })

    it('has pkgName', () => {
      expect(Portal.pkgName).toBe('@vitus-labs/elements')
    })
  })

  describe('rendering', () => {
    it('renders children into document.body', async () => {
      render(
        <Portal>
          <span data-testid="portal-child">Hello</span>
        </Portal>,
      )
      // Portal renders asynchronously via useEffect + useState
      expect(
        await screen.findByTestId('portal-child'),
      ).toHaveTextContent('Hello')
    })

    it('renders into custom DOMLocation', async () => {
      const container = document.createElement('div')
      container.setAttribute('data-testid', 'custom-root')
      document.body.appendChild(container)

      render(
        <Portal DOMLocation={container}>
          <span data-testid="custom-child">Custom</span>
        </Portal>,
      )

      expect(
        await screen.findByTestId('custom-child'),
      ).toHaveTextContent('Custom')
      // Child should be inside the custom container's subtree
      expect(container.querySelector('[data-testid="custom-child"]')).toBeTruthy()

      document.body.removeChild(container)
    })

    it('creates element with specified tag', async () => {
      render(
        <Portal tag="section">
          <span data-testid="sec-child">Content</span>
        </Portal>,
      )
      expect(
        await screen.findByTestId('sec-child'),
      ).toBeInTheDocument()
      // The portal wrapper should be a section element
      const sections = document.body.querySelectorAll('section')
      expect(sections.length).toBeGreaterThan(0)
    })

    it('cleans up DOM element on unmount', async () => {
      const { unmount } = render(
        <Portal>
          <span data-testid="cleanup-child">Temp</span>
        </Portal>,
      )
      expect(
        await screen.findByTestId('cleanup-child'),
      ).toBeInTheDocument()

      // Count divs before unmount
      const divsBefore = document.body.querySelectorAll(':scope > div').length

      unmount()

      const divsAfter = document.body.querySelectorAll(':scope > div').length
      expect(divsAfter).toBeLessThan(divsBefore)
    })
  })
})
