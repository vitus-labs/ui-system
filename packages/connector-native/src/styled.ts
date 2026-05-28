import { type ComponentType, createElement } from 'react'
import { useWindowDimensions } from 'react-native'

import { type CSSResult, css as cssFactory } from '~/css'
import { mergeStyles } from '~/parse'
import { useTheme } from '~/provider'

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

  const Styled = ({ ref, ...props }: Record<string, any>) => {
    // Subscribe to window dimensions so the component re-renders on
    // rotation / resize. The width itself is read lazily inside
    // createMediaQueries at resolve time — this call only provides the
    // re-render trigger, mirroring how the browser re-evaluates `@media`.
    useWindowDimensions()

    // Inject the context theme so dynamic interpolations (`p.theme.*`) and
    // unistyle's makeItResponsive (which reads `props.theme`) resolve on
    // native, mirroring the web styler. Only injected into the resolve props
    // — never forwarded to the underlying RN component (theme isn't a valid
    // RN prop). A consumer-passed `theme` prop takes precedence and is
    // forwarded as-is, matching the web connector.
    const theme = useTheme()
    const resolveProps = props.theme !== undefined ? props : { ...props, theme }
    const resolvedStyles = isCSSResult(template)
      ? template.resolve(resolveProps)
      : template

    const filter = options?.shouldForwardProp ?? shouldForwardByDefault
    const forwardedProps: Record<string, any> = {}
    // for-in avoids the `Object.keys` array allocation per render. Runs on
    // every native styled component render.
    for (const key in props) {
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
  }

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
