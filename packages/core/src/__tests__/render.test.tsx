import React from 'react'
import { render as rtlRender, screen } from '@testing-library/react'
import renderFn from '~/render'

const TestComponent = (props: { label?: string }) => (
  <span data-testid="test">{props.label ?? 'default'}</span>
)

describe('render', () => {
  it('should return null for falsy content', () => {
    expect(renderFn(null)).toBeNull()
    expect(renderFn(undefined)).toBeNull()
    expect(renderFn(false as any)).toBeNull()
    expect(renderFn('' as any)).toBeNull()
  })

  it('should render a component with props', () => {
    const result = renderFn(TestComponent, { label: 'hello' })
    rtlRender(<>{result}</>)
    expect(screen.getByTestId('test')).toHaveTextContent('hello')
  })

  it('should render a component without props', () => {
    const result = renderFn(TestComponent)
    rtlRender(<>{result}</>)
    expect(screen.getByTestId('test')).toHaveTextContent('default')
  })

  it('should return string content as-is (treated as text)', () => {
    // Note: plain strings hit the primitives branch and are returned as-is,
    // even if they're valid HTML tag names like 'div'
    expect(renderFn('div' as any)).toBe('div')
    expect(renderFn('hello' as any)).toBe('hello')
  })

  it('should return primitive values as-is', () => {
    expect(renderFn(42 as any)).toBe(42)
    expect(renderFn(true as any)).toBe(true)
    expect(renderFn('text' as any)).toBe('text')
  })

  it('should return arrays as-is', () => {
    const arr = [<span key="1">a</span>, <span key="2">b</span>]
    expect(renderFn(arr as any)).toBe(arr)
  })

  it('should clone a valid React element with props', () => {
    const el = <TestComponent label="original" />
    const result = renderFn(el as any, { label: 'cloned' })
    rtlRender(<>{result}</>)
    expect(screen.getByTestId('test')).toHaveTextContent('cloned')
  })

  it('should return a valid React element without modification when no props', () => {
    const el = <TestComponent label="original" />
    const result = renderFn(el as any)
    rtlRender(<>{result}</>)
    expect(screen.getByTestId('test')).toHaveTextContent('original')
  })

  it('should return fragment as-is', () => {
    const frag = (
      <>
        <span>a</span>
        <span>b</span>
      </>
    )
    expect(renderFn(frag as any)).toBe(frag)
  })
})
