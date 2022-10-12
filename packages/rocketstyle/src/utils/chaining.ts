type Func = (...args: any) => Record<string, unknown>
type Obj = Record<string, unknown>

// --------------------------------------------------------
// Chain Options
// --------------------------------------------------------
type ChainOptions = (
  opts: Obj | Func | undefined,
  defaultOpts: Func[]
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
type ChainOrOptions = (
  keys: ReadonlyArray<string>,
  opts: Obj,
  defaultOpts: Obj
) => Record<string, unknown>

export const chainOrOptions: ChainOrOptions = (keys, opts, defaultOpts) =>
  keys.reduce(
    (acc, item) => ({ ...acc, [item]: opts[item] || defaultOpts[item] }),
    {}
  )

// --------------------------------------------------------
// Chain Reserved Options
// --------------------------------------------------------
type ChainReservedKeyOptions = (
  keys: ReadonlyArray<string>,
  opts: Record<string, Obj | Func>,
  defaultOpts: Record<string, Func[]>
) => Record<string, ReturnType<typeof chainOptions>>

export const chainReservedKeyOptions: ChainReservedKeyOptions = (
  keys,
  opts,
  defaultOpts
) =>
  keys.reduce(
    (acc, item) => ({
      ...acc,
      [item]: chainOptions(opts[item], defaultOpts[item]),
    }),
    {}
  )
