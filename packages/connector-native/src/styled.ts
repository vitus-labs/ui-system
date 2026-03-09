import { type ComponentType, createElement, forwardRef } from 'react'

import { type CSSResult, css as cssFactory } from '~/css'
import { mergeStyles } from '~/parse'

type StyledOptions = {
  shouldForwardProp?: (prop: string) => boolean
}

type Interpolation =
  | string
  | number
  | boolean
  | null
  | undefined
  | ((props: any) => any)

const isCSSResult = (v: unknown): v is CSSResult =>
  typeof v === 'object' && v !== null && (v as any).__brand === 'vl.native.css'

const shouldForwardByDefault = (key: string): boolean =>
  key !== 'as' && !key.startsWith('$') && !key.startsWith('data-')

const createStyledComponent = (
  tag: ComponentType<any>,
  options: StyledOptions | undefined,
  strings: TemplateStringsArray,
  values: Interpolation[],
) => {
  const template = cssFactory(strings, ...values)

  const Styled = forwardRef<unknown, Record<string, any>>((props, ref) => {
    const resolvedStyles = isCSSResult(template)
      ? template.resolve(props)
      : template

    const filter = options?.shouldForwardProp ?? shouldForwardByDefault
    const forwardedProps: Record<string, any> = {}
    for (const key of Object.keys(props)) {
      if (key === 'children' || key === 'style' || filter(key)) {
        forwardedProps[key] = props[key]
      }
    }

    const mergedStyle = props.style
      ? mergeStyles(resolvedStyles, props.style)
      : resolvedStyles

    return createElement(tag, {
      ...forwardedProps,
      ref,
      style: mergedStyle,
    })
  })

  const name =
    typeof tag === 'string'
      ? tag
      : (tag as any).displayName || (tag as any).name || 'Component'
  Styled.displayName = `styled(${name})`

  return Styled
}

/**
 * React Native styled component factory. Creates a component that resolves
 * CSS template literals into style objects applied via the `style` prop.
 *
 * By default, props prefixed with `$` or `data-`, and the `as` prop, are
 * not forwarded to the underlying component. Use `shouldForwardProp` to
 * customize this behavior.
 *
 * @param tag - The base React Native component to wrap
 * @param options - Optional config with `shouldForwardProp` filter
 * @returns A tagged template function that produces a styled component
 *
 * @example
 * ```tsx
 * const StyledView = styled(View)`
 *   width: ${(p) => p.$size}px;
 *   background-color: blue;
 * `
 * <StyledView $size={100} />
 * ```
 */
export const styled = (tag: ComponentType<any>, options?: StyledOptions) => {
  return (strings: TemplateStringsArray, ...values: Interpolation[]) =>
    createStyledComponent(tag, options, strings, values)
}
