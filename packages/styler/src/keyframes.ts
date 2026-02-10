/**
 * keyframes() tagged template function. Creates a CSS @keyframes rule,
 * injects it into the stylesheet, and returns the generated animation name.
 *
 * Usage:
 *   const fadeIn = keyframes`
 *     from { opacity: 0; }
 *     to { opacity: 1; }
 *   `
 *   // fadeIn === "vl-kf-abc123" (deterministic, hash-based)
 *
 * Supports interpolation values (strings, numbers) but NOT function
 * interpolations — keyframes are static by nature.
 */
import { hash } from './hash'
import { type Interpolation, CSSResult, resolve } from './resolve'
import { sheet } from './sheet'

class KeyframesResult {
  readonly name: string

  constructor(
    strings: TemplateStringsArray,
    values: Interpolation[],
  ) {
    const body = resolve(strings, values, {})
    const h = hash(body)
    this.name = `vl-kf-${h}`

    sheet.insertKeyframes(this.name, body)
  }

  /** Returns the animation name when used in string context. */
  toString(): string {
    return this.name
  }
}

export const keyframes = (
  strings: TemplateStringsArray,
  ...values: Interpolation[]
): KeyframesResult => new KeyframesResult(strings, values)
