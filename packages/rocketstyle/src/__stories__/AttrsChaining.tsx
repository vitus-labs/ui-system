/**
 * Attrs chaining and priority example.
 *
 * Demonstrates: .attrs() with objects and callbacks, priority attrs,
 * filter option, and .statics().
 */
import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/init'

// ─── Attrs with object ───────────────────────────────────────
const Base = rocketstyle()({ name: 'AttrsExample', component: Element })
  .attrs({ tag: 'button' })
  .theme({
    height: 40,
    color: '#fff',
    backgroundColor: '#0d6efd',
  })
  .styles(
    (css) => css`
      border: none;
      cursor: pointer;
      border-radius: 6px;

      ${({ $rocketstyle: t }) => css`
        height: ${t.height}px;
        padding: 0 16px;
        color: ${t.color};
        background-color: ${t.backgroundColor};
      `};
    `,
  )

// ─── Callback attrs (computed from props) ────────────────────
export const SmartLabel = Base.attrs((props: any) => ({
  label: props.disabled ? 'Disabled' : (props.label ?? 'Click me'),
}))

// ─── Priority attrs (evaluated first, overridable by props) ─
export const WithDefaults = Base.attrs(
  { label: 'Default label', disabled: false },
  { priority: true },
).attrs({ label: 'Override label' })

// ─── Filter attrs (omit internal props from DOM) ─────────────
export const Filtered = (Base as any).attrs(
  { internalFlag: true, label: 'Filtered' },
  { filter: ['internalFlag'] },
)

// ─── Statics ─────────────────────────────────────────────────
export const WithStatics = Base.statics({
  variant: 'primary',
  sizes: ['sm', 'md', 'lg'],
})

// Access via WithStatics.meta.variant, WithStatics.meta.sizes

// ─── Multiple attrs chains ───────────────────────────────────
// Each .attrs() call adds to the merge chain
export const MultiChain = Base.attrs({ label: 'First' })
  .attrs({ 'aria-label': 'Multi-chained button' } as any)
  .attrs({ label: 'Final label' }) // last wins for 'label'

// ─── Usage ───────────────────────────────────────────────────
export const Examples = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <SmartLabel />
    <SmartLabel disabled />
    <WithDefaults />
    <Filtered />
    <MultiChain />
  </div>
)

export default Examples
