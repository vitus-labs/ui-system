/* eslint-disable import/prefer-default-export */

// --------------------------------------------------------
// chain options
// --------------------------------------------------------
export const chainOptions = (opts, defaultOpts = []) => {
  const result = [...defaultOpts]

  if (typeof opts === 'function') result.push(opts)
  else if (typeof opts === 'object') result.push(() => opts)

  return result
}

// --------------------------------------------------------
// remove empty values
// --------------------------------------------------------
export const removeNullableValues = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v != null && v !== false)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

// --------------------------------------------------------
// remove empty values recursively
// --------------------------------------------------------
export const removeAllEmptyValues = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: typeof v === 'object' ? removeAllEmptyValues(v) : v,
      }),
      {}
    )
