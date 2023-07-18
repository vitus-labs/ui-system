type Func = (...args: any) => Record<string, unknown>
type Obj = Record<string, unknown>

// --------------------------------------------------------
// Chain Options
// --------------------------------------------------------
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
