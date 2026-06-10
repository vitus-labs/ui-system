import { type ComponentType, createElement, type FC } from 'react'
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

const shouldForwardByDefault = (key: string): boolean =>
  key !== 'as' && !key.startsWith('$') && !key.startsWith('data-')

const createStyledComponent = (
  tag: ComponentType<any>,
  options: StyledOptions | undefined,
  strings: TemplateStringsArray,
  values: Interpolation[],
) => {
  const template = cssFactory(strings, ...values)
  // Hoist the prop-forward filter once at component-creation time so we
  // don't re-evaluate the `??` per render.
  const filter = options?.shouldForwardProp ?? shouldForwardByDefault

  // Shared render tail: filter forwarded props, merge styles, create element.
  // Builds the forwarded-props object directly via mutation. The previous
  // `createElement(tag, { ...forwardedProps, ref, style })` re-spread a
  // freshly-allocated object for no reason — mirrors the styler
  // rawProps-mutation trick (no caller holds the reference yet, so the
  // mutation is safe).
  const renderElement = (
    props: Record<string, any>,
    ref: unknown,
    resolvedStyles: CSSResult['statics'],
  ) => {
    const forwardedProps: Record<string, any> = {}
    for (const key in props) {
      if (key === 'children' || key === 'style' || filter(key)) {
        forwardedProps[key] = props[key]
      }
    }

    forwardedProps.style = props.style
      ? mergeStyles(resolvedStyles, props.style)
      : resolvedStyles
    if (ref !== undefined) forwardedProps.ref = ref

    return createElement(tag, forwardedProps)
  }

  // Two function bodies chosen at component-creation time (the same pattern
  // styler uses for IS_SERVER) — hooks rules are per-function-body, so this
  // is legal. A static template (no function interpolations) can't read the
  // window width or theme by construction, so the static variant skips both
  // hooks: static components no longer re-render on every rotation/resize
  // just to produce identical output.
  // Explicit FC annotation: assigning from a ternary (rather than a direct
  // function expression) disables TS's expando-property allowance, so
  // `Styled.displayName = …` below needs the type to carry `displayName`.
  const Styled: FC<Record<string, any>> =
    template.dynamics.length > 0
      ? ({ ref, ...props }: Record<string, any>) => {
          // Subscribe to window dimensions so the component re-renders on
          // rotation / resize. The width itself is read lazily inside
          // createMediaQueries at resolve time — this call only provides the
          // re-render trigger, mirroring how the browser re-evaluates `@media`.
          useWindowDimensions()

          // Inject the context theme so dynamic interpolations (`p.theme.*`)
          // and unistyle's makeItResponsive (which reads `props.theme`) resolve
          // on native, mirroring the web styler. Only injected into the resolve
          // props — never forwarded to the underlying RN component (theme isn't
          // a valid RN prop). A consumer-passed `theme` prop takes precedence
          // and is forwarded as-is, matching the web connector.
          const theme = useTheme()
          const resolveProps =
            props.theme !== undefined ? props : { ...props, theme }

          return renderElement(props, ref, template.resolve(resolveProps))
        }
      : ({ ref, ...props }: Record<string, any>) =>
          // Static variant — styles were parsed once at creation time. A
          // consumer-passed `theme` prop is still forwarded as-is via the
          // filter loop, matching the dynamic variant.
          renderElement(props, ref, template.statics)

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
