import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Row from '../Row/component.native'

// Replace the styled primitive with a DOM element that exposes the received
// `onLayout` handler through a click, so the composed handler can be driven.
vi.mock('../Row/styled', () => ({
  default: ({ onLayout, children }: any) => (
    <button
      type="button"
      data-testid="row"
      onClick={() => onLayout({ nativeEvent: { layout: { width: 320 } } })}
    >
      {children}
    </button>
  ),
}))

describe('native Row onLayout', () => {
  it('calls the user onLayout in addition to its own measurement', () => {
    const onLayout = vi.fn()
    render(
      <Row columns={12} {...({ onLayout } as any)}>
        <span>child</span>
      </Row>,
    )
    fireEvent.click(screen.getByTestId('row'))
    expect(onLayout).toHaveBeenCalledTimes(1)
    expect(onLayout.mock.calls[0]?.[0]).toEqual({
      nativeEvent: { layout: { width: 320 } },
    })
  })

  it('works without a user onLayout', () => {
    render(
      <Row columns={12}>
        <span>child</span>
      </Row>,
    )
    expect(() => fireEvent.click(screen.getByTestId('row'))).not.toThrow()
  })
})
