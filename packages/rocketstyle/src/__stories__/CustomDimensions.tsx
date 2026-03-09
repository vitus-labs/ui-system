/**
 * Custom dimensions example.
 *
 * Demonstrates: rocketstyle({ dimensions }) to define custom
 * dimension keys instead of the defaults (states/sizes/variants/multiple).
 */
import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/init'

// ─── Custom dimensions: "colors" and "shapes" ───────────────
const factory = rocketstyle({
  dimensions: {
    colors: 'color',
    shapes: 'shape',
  },
})

export const Badge = factory({ name: 'Badge', component: Element })
  .attrs({ tag: 'span' })
  .theme({
    padding: 4,
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#6c757d',
    borderRadius: 4,
  })
  .colors({
    info: { backgroundColor: '#0dcaf0', color: '#000' },
    success: { backgroundColor: '#198754' },
    warning: { backgroundColor: '#ffc107', color: '#000' },
    danger: { backgroundColor: '#dc3545' },
  })
  .shapes({
    pill: { borderRadius: 50 },
    square: { borderRadius: 0 },
  })
  .styles(
    (css) => css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;

      ${({ $rocketstyle: t }) => css`
        padding: ${t.padding}px 8px;
        font-size: ${t.fontSize}px;
        color: ${t.color};
        background-color: ${t.backgroundColor};
        border-radius: ${t.borderRadius}px;
      `};
    `,
  )

// ─── Usage ───────────────────────────────────────────────────
// Props are "color" and "shape" (the propName values from dimensions)
export const Examples = () => {
  // Cast needed: custom dimensions cause `label` to be typed as dimension key union
  const B = Badge as any

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <B label="Default" />
      <B color="info" label="Info" />
      <B color="success" shape="pill" label="Success Pill" />
      <B warning label="Warning (boolean)" />
      <B danger square label="Danger Square" />
    </div>
  )
}

export default Badge
