/**
 * Theme mode (light/dark) example.
 *
 * Demonstrates: .theme() callback with mode() helper,
 * .config({ inversed }) for flipping light/dark.
 */
import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/init'

// ─── Component with light/dark mode support ──────────────────
export const Surface = rocketstyle()({ name: 'Surface', component: Element })
  .attrs({ tag: 'div' })
  .theme(
    // mode() returns a resolver fn; rocketstyle resolves it at runtime
    // before passing to $rocketstyle, but TS sees the raw return type
    (_, mode): any => ({
      padding: 24,
      color: mode('#1a1a2e', '#e0e0e0'),
      backgroundColor: mode('#ffffff', '#1a1a2e'),
      borderColor: mode('#dee2e6', '#333'),
    }),
  )
  .styles(
    (css) => css`
      ${({ $rocketstyle }: any) => {
        const t = $rocketstyle
        return css`
          padding: ${t.padding}px;
          color: ${t.color};
          background-color: ${t.backgroundColor};
          border: 1px solid ${t.borderColor};
          border-radius: 8px;
        `
      }};
    `,
  )

// ─── Inversed variant ────────────────────────────────────────
// .config({ inversed: true }) flips light↔dark for this component
export const InversedSurface = Surface.config({ inversed: true })

// ─── Usage ───────────────────────────────────────────────────
export const Examples = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Surface label="Normal surface (follows app mode)" />
    <InversedSurface label="Inversed surface (opposite mode)" />
  </div>
)

export default Surface
