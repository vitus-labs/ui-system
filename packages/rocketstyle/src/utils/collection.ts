/* eslint-disable import/prefer-default-export */

// --------------------------------------------------------
// chain options
// --------------------------------------------------------
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

// --------------------------------------------------------
// remove empty values
// --------------------------------------------------------
type RemoveNullableValues = (obj: Record<string, any>) => Record<string, any>
export const removeNullableValues: RemoveNullableValues = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v != null && v !== false)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

// --------------------------------------------------------
// remove empty values recursively
// --------------------------------------------------------
type RemoveAllEmptyValues = (obj: Record<string, any>) => Record<string, any>
export const removeAllEmptyValues: RemoveAllEmptyValues = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: typeof v === 'object' ? removeAllEmptyValues(v) : v,
      }),
      {}
    )
