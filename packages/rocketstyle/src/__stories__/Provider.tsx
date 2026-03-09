/**
 * Provider/Consumer pattern example.
 *
 * Demonstrates: .config({ provider: true }) to broadcast dimension state
 * to child rocketstyle components, and .config({ consumer }) to consume it.
 */
import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/init'

// ─── Parent: provides state to children ──────────────────────
export const ButtonGroup = rocketstyle()({
  name: 'ButtonGroup',
  component: Element,
})
  .attrs({ tag: 'div' })
  .config({ provider: true })
  .theme({
    gap: 8,
    backgroundColor: 'transparent',
  })
  .states({
    primary: { backgroundColor: '#e7f1ff' },
    danger: { backgroundColor: '#f8d7da' },
  })
  .styles(
    (css) => css`
      display: inline-flex;

      ${({ $rocketstyle: t }) => css`
        gap: ${t.gap}px;
        background-color: ${t.backgroundColor};
        padding: 8px;
        border-radius: 8px;
      `};
    `,
  )

// ─── Child: consumes parent's state ──────────────────────────
export const GroupButton = rocketstyle()({
  name: 'GroupButton',
  component: Element,
})
  .attrs({ tag: 'button' })
  .config({
    consumer: ((_ctx: any) => (attrs: any) => ({
      // Inherit state from parent ButtonGroup
      state: attrs.state,
    })) as any,
  })
  .theme({
    height: 36,
    paddingX: 16,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#e9ecef',
    borderRadius: 4,
  })
  .states({
    primary: { backgroundColor: '#0d6efd', color: '#fff' },
    danger: { backgroundColor: '#dc3545', color: '#fff' },
  })
  .styles(
    (css) => css`
      border: none;
      cursor: pointer;

      ${({ $rocketstyle: t }) => css`
        height: ${t.height}px;
        padding: 0 ${t.paddingX}px;
        font-size: ${t.fontSize}px;
        color: ${t.color};
        background-color: ${t.backgroundColor};
        border-radius: ${t.borderRadius}px;
      `};
    `,
  )

// ─── Usage ───────────────────────────────────────────────────
// Setting state="primary" on ButtonGroup propagates to all GroupButtons
export const Examples = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <ButtonGroup primary>
      <GroupButton label="Save" />
      <GroupButton label="Save & Close" />
    </ButtonGroup>

    <ButtonGroup danger>
      <GroupButton label="Delete" />
      <GroupButton label="Delete All" />
    </ButtonGroup>
  </div>
)

export default Examples
