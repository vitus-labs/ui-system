// --------------------------------------------------------
// Remove Nullable values
// --------------------------------------------------------
type RemoveNullableValues = (obj: Record<string, any>) => Record<string, any>
export const removeNullableValues: RemoveNullableValues = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v != null && v !== false)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

// --------------------------------------------------------
// Remove All Empty Values
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
