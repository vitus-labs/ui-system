/**
 * Basic rocketstyle Button example.
 *
 * Demonstrates: rocketstyle factory, .attrs(), .theme(), .states(),
 * .sizes(), .styles(), boolean dimension props.
 */
import { config } from '@vitus-labs/core'
import { Element } from '@vitus-labs/elements'
import rocketstyle from '~/init'

const { styled } = config

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.15);
  font-size: 12px;
`

// ─── Basic Button ────────────────────────────────────────────
export const Button = rocketstyle()({ name: 'Button', component: Element })
  .attrs({
    tag: 'button',
    label: 'Click me',
    beforeContent: () => <Icon>★</Icon>,
  })
  .theme({
    height: 40,
    paddingX: 16,
    paddingY: 0,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#0d6efd',
    borderRadius: 6,
  })
  .states({
    primary: { backgroundColor: '#0d6efd', color: '#fff' },
    secondary: { backgroundColor: '#6c757d', color: '#fff' },
    success: { backgroundColor: '#198754', color: '#fff' },
    danger: { backgroundColor: '#dc3545', color: '#fff' },
  })
  .sizes({
    small: { height: 32, paddingX: 12, fontSize: 12 },
    medium: { height: 40, paddingX: 16, fontSize: 14 },
    large: { height: 48, paddingX: 24, fontSize: 16 },
  })
  .styles(
    (css) => css`
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      cursor: pointer;
      font-family: inherit;
      transition: background-color 0.15s ease-in-out;

      ${({ $rocketstyle: t }) => css`
        height: ${t.height}px;
        padding: ${t.paddingY}px ${t.paddingX}px;
        font-size: ${t.fontSize}px;
        color: ${t.color};
        background-color: ${t.backgroundColor};
        border-radius: ${t.borderRadius}px;
      `};
    `,
  )

// ─── Usage examples ──────────────────────────────────────────

// Default button
export const DefaultButton = () => <Button />

// With state prop
export const StateButton = () => <Button state="danger" label="Delete" />

// With boolean prop (equivalent to state="success")
export const BooleanButton = () => <Button success label="Confirm" />

// With size
export const SizedButton = () => <Button large primary label="Large Primary" />

export default Button
