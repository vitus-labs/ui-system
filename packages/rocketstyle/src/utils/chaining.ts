type ChanOptions = (
  opts: Record<string, unknown> | ((...args: any) => Record<string, unknown>),
  defaultOpts: any[]
) => any[]

export const chainOptions: ChanOptions = (opts, defaultOpts = []) => {
  const result = [...defaultOpts]

  if (typeof opts === 'function') result.push(opts)
  else if (typeof opts === 'object') result.push(() => opts)

  return result
}

type OrOptions = (
  keys: Readonly<Array<string>>,
  opts: Record<string, unknown>,
  defaultOpts: Record<string, unknown>
) => Record<string, unknown>

export const orOptions: OrOptions = (keys, opts, defaultOpts) =>
  keys.reduce(
    (acc, item) => ({ ...acc, [item]: opts[item] || defaultOpts[item] }),
    {}
  )

export const chainReservedOptions = (keys, opts, defaultOpts) =>
  keys.reduce(
    (acc, item) => ({
      ...acc,
      [item]: chainOptions(opts[item], defaultOpts[item]),
    }),
    {}
  )
