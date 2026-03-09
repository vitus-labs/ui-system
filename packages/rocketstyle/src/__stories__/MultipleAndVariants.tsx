/**
 * Multiple dimension and variants example.
 *
 * Demonstrates: .variants() for single-select dimensions,
 * .multiple() for multi-select dimensions, and combining them.
 */
import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/init'

export const Tag = rocketstyle()({ name: 'Tag', component: Element })
  .attrs({ tag: 'span' })
  .theme({
    height: 28,
    paddingX: 10,
    fontSize: 12,
    color: '#333',
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    fontWeight: 400,
    textTransform: 'none',
  })
  // Single-select: only one variant active at a time
  .variants({
    outlined: {
      backgroundColor: 'transparent',
      color: '#0d6efd',
    },
    filled: {
      backgroundColor: '#0d6efd',
      color: '#fff',
    },
  })
  // Multi-select: multiple can be active simultaneously
  .multiple({
    rounded: { borderRadius: 50 },
    bold: { fontWeight: 700 },
    uppercase: { textTransform: 'uppercase' },
  })
  .styles(
    (css) => css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid currentColor;
      line-height: 1;

      ${({ $rocketstyle: t }) => css`
        height: ${t.height}px;
        padding: 0 ${t.paddingX}px;
        font-size: ${t.fontSize}px;
        color: ${t.color};
        background-color: ${t.backgroundColor};
        border-radius: ${t.borderRadius}px;
        font-weight: ${t.fontWeight};
        text-transform: ${t.textTransform};
      `};
    `,
  )

// ─── Usage ───────────────────────────────────────────────────
export const Examples = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {/* Default */}
    <Tag label="Default" />

    {/* Single variant via prop name */}
    <Tag variant="outlined" label="Outlined" />
    <Tag variant="filled" label="Filled" />

    {/* Boolean shorthand for variant */}
    <Tag filled label="Filled (boolean)" />

    {/* Multiple via array */}
    <Tag multiple={['rounded', 'bold']} label="Rounded + Bold" />

    {/* Multiple via boolean shorthand */}
    <Tag rounded uppercase label="Rounded + Uppercase" />

    {/* Combining variant + multiple */}
    <Tag filled rounded bold uppercase label="All combined" />
  </div>
)

export default Tag
