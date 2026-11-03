/**
 * Regression tests for the 2026-11 elements audit (Overlay): closed
 * click-to-open overlays listen on the trigger only, not on document.
 */
import { act, fireEvent, render, screen } from '@testing-library/react'
import { breakpoints, Provider } from '@vitus-labs/unistyle'
import { forwardRef } from 'react'
import { flushSync } from 'react-dom'
import Overlay from '../Overlay/component'

const Btn = forwardRef<HTMLButtonElement, any>(
  ({ active, showContent, hideContent, ...p }, ref) => (
    <button type="button" ref={ref} {...p} />
  ),
)

const wrapper = ({ children }: any) => (
  <Provider theme={breakpoints}>{children}</Provider>
)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('click listeners of closed overlays', () => {
  it('closed click-to-open overlays do not listen on document', () => {
    const add = vi.spyOn(document, 'addEventListener')
    const keys = Array.from({ length: 20 }, (_, i) => `o${i}`)
    render(
      <div>
        {keys.map((k) => (
          <Overlay key={k} trigger={<Btn>t</Btn>}>
            <div>c</div>
          </Overlay>
        ))}
      </div>,
      { wrapper },
    )
    expect(add.mock.calls.filter((c) => c[0] === 'click')).toHaveLength(0)
  })

  it('opens on trigger click and closes on click outside', () => {
    render(
      <>
        <button type="button" data-testid="outside">
          outside
        </button>
        <Overlay
          closeOn="clickOutsideContent"
          trigger={<Btn data-testid="t">t</Btn>}
        >
          <div data-testid="c">c</div>
        </Overlay>
      </>,
      { wrapper },
    )
    act(() => {
      fireEvent.click(screen.getByTestId('t'))
    })
    expect(screen.queryByTestId('c')).not.toBeNull()
    act(() => {
      fireEvent.click(screen.getByTestId('outside'))
    })
    expect(screen.queryByTestId('c')).toBeNull()
  })

  it('the opening click is not also handled as a close when React flushes mid-propagation', () => {
    render(
      <div data-testid="host">
        <Overlay closeOn="click" trigger={<Btn data-testid="t">t</Btn>}>
          <div data-testid="c">c</div>
        </Overlay>
      </div>,
      { wrapper },
    )
    // A real browser drains microtasks between listeners, so React commits
    // the open (and attaches the document listener) while the click is still
    // bubbling. flushSync reproduces that before the event reaches document.
    const host = screen.getByTestId('host')
    const flush = () => flushSync(() => {})
    host.addEventListener('click', flush)
    act(() => {
      fireEvent.click(screen.getByTestId('t'))
    })
    host.removeEventListener('click', flush)
    expect(screen.queryByTestId('c')).not.toBeNull()

    act(() => {
      fireEvent.click(document.body)
    })
    expect(screen.queryByTestId('c')).toBeNull()
  })
})
