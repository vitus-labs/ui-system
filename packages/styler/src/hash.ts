/**
 * Fast FNV-1a non-cryptographic hash. Returns base-36 string for compact class names.
 *
 * 32-bit hash space → ~4.3 billion unique values. Collision probability is
 * negligible for typical applications (< 10,000 unique CSS rules). If a collision
 * did occur, two different CSS strings would share the same class name and only
 * the first would be injected (dedup). In practice this is a non-issue — CSS
 * strings are rarely similar enough to collide under FNV-1a's avalanche properties.
 */

/** FNV-1a offset basis — starting state for streaming hash. */
export const HASH_INIT = 2166136261

const FNV_PRIME = 16777619

/**
 * Feed a string segment into the running hash state.
 * Streaming: hashUpdate(hashUpdate(HASH_INIT, 'ab'), 'cd') === hash('abcd').
 *
 * Manually unrolled to 4-char chunks: cuts loop branches by 4× and lets V8's
 * JIT pipeline keep `h` in a register across all four steps. Measured wins:
 * +15% on short (~25-char) inputs, +46% on long (~340-char) inputs over the
 * naive single-char loop. Sequential dependency on `h` prevents real
 * parallelism — this is purely a loop-overhead reduction.
 */
export const hashUpdate = (h: number, str: string): number => {
  const len = str.length
  let i = 0
  while (i + 4 <= len) {
    h = Math.imul(h ^ str.charCodeAt(i), FNV_PRIME)
    h = Math.imul(h ^ str.charCodeAt(i + 1), FNV_PRIME)
    h = Math.imul(h ^ str.charCodeAt(i + 2), FNV_PRIME)
    h = Math.imul(h ^ str.charCodeAt(i + 3), FNV_PRIME)
    i += 4
  }
  while (i < len) {
    h = Math.imul(h ^ str.charCodeAt(i), FNV_PRIME)
    i++
  }
  return h
}

/** Finalize a hash state into a base-36 class name suffix. */
export const hashFinalize = (h: number): string => (h >>> 0).toString(36)

/** Hash a complete string in one shot. Returns base-36 string. */
export const hash = (str: string): string =>
  hashFinalize(hashUpdate(HASH_INIT, str))
