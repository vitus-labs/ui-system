/**
 * Component composition and extension examples.
 *
 * Demonstrates: .config({ component }), .compose(), extending
 * via chaining, and HOC wrapping.
 */
import { Element } from '@vitus-labs/elements'
import { forwardRef, type ReactNode } from 'react'

import rocketstyle from '~/init'

// ─── Base component ──────────────────────────────────────────
const Base = rocketstyle()({ name: 'Base', component: Element })
  .attrs({ tag: 'div' })
  .theme({
    padding: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  })
  .styles(
    (css) => css`
      ${({ $rocketstyle: t }) => css`
        padding: ${t.padding}px;
        color: ${t.color};
        background-color: ${t.backgroundColor};
        border-radius: ${t.borderRadius}px;
      `};
    `,
  )

// ─── Extend via chaining ────────────────────────────────────
// Additional .theme() / .states() / .styles() calls extend the base
export const Card = Base.theme({
  padding: 24,
  backgroundColor: '#fff',
}).styles(
  (css) => css`
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
)

// ─── Replace the underlying component ───────────────────────
const CustomInner = forwardRef<HTMLAnchorElement, any>(
  ({ children, $rocketstyle, $rocketstate, ...rest }, ref) => (
    <a ref={ref} {...rest}>
      {children}
    </a>
  ),
)
CustomInner.displayName = 'CustomInner'

export const LinkCard = Card.config({ component: CustomInner }).attrs({
  href: '#',
})

// ─── HOC composition ────────────────────────────────────────
const withTooltip =
  (Wrapped: any) =>
  ({ tooltip, ...props }: { tooltip?: string; children?: ReactNode }) => (
    <div title={tooltip}>
      <Wrapped {...props} />
    </div>
  )

export const CardWithTooltip = Card.compose({ tooltip: withTooltip })

// ─── Usage examples ──────────────────────────────────────────
export const Examples = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Base label="Base component" />
    <Card label="Card (extended base)" />
    <LinkCard label="Link card (replaced component)" />
    <CardWithTooltip
      {...({ tooltip: 'Hello!' } as any)}
      label="Card with tooltip HOC"
    />
  </div>
)

export default Examples
