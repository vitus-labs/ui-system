type Func = (...args: any) => Record<string, unknown>
type Obj = Record<string, unknown>

// --------------------------------------------------------
// Chain Options
// --------------------------------------------------------
/**
 * Appends a new option (function or plain object) to an existing chain
 * of option callbacks. Objects are wrapped in a thunk for uniform handling.
 */
type ChainOptions = (
  opts: Obj | Func | undefined,
  defaultOpts: Func[],
) => Func[]

export const chainOptions: ChainOptions = (opts, defaultOpts = []) => {
  const result = [...defaultOpts]

  if (typeof opts === 'function') result.push(opts)
  else if (typeof opts === 'object') result.push(() => opts)

  return result
}

// --------------------------------------------------------
// Chain Or Options
// --------------------------------------------------------
/**
 * For each key, picks the new value if truthy, otherwise falls back
 * to the default. Used for config keys that replace rather than merge.
 */
type ChainOrOptions = (
  keys: readonly string[],
  opts: Obj,
  defaultOpts: Obj,
) => Record<string, unknown>

export const chainOrOptions: ChainOrOptions = (keys, opts, defaultOpts) => {
  // Single-pass mutation; the prior reduce-with-spread was O(K²).
  const result: Record<string, unknown> = {}
  for (let i = 0; i < keys.length; i++) {
    const item = keys[i] as string
    result[item] = opts[item] || defaultOpts[item]
  }
  return result
}

// --------------------------------------------------------
// Chain Reserved Options
// --------------------------------------------------------
/**
 * Chains option callbacks for reserved dimension and styling keys,
 * delegating to `chainOptions` for each key individually.
 */
type ChainReservedKeyOptions = (
  keys: readonly string[],
  opts: Record<string, Obj | Func>,
  defaultOpts: Record<string, Func[]>,
) => Record<string, ReturnType<typeof chainOptions>>

export const chainReservedKeyOptions: ChainReservedKeyOptions = (
  keys,
  opts,
  defaultOpts,
) => {
  // Single-pass; the prior reduce-with-spread was O(K²).
  const result: Record<string, ReturnType<typeof chainOptions>> = {}
  for (let i = 0; i < keys.length; i++) {
    const item = keys[i] as string
    // biome-ignore lint/style/noNonNullAssertion: defaultOpts is initialized with empty arrays for all reserved keys at factory time, so defaultOpts[item] is always defined here
    result[item] = chainOptions(opts[item], defaultOpts[item]!)
  }
  return result
}
