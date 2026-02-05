/* eslint-disable import/prefer-default-export */

// --------------------------------------------------------
// Remove Nullable values
// --------------------------------------------------------
type RemoveNullableValues = (obj: Record<string, any>) => Record<string, any>
export const removeNullableValues: RemoveNullableValues = (obj) => {
  const result: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v != null && v !== false) {
      result[k] = v
    }
  }
  return result
}

// --------------------------------------------------------
// Remove All Empty Values
// --------------------------------------------------------
// type RemoveAllEmptyValues = (obj: Record<string, any>) => Record<string, any>
// export const removeAllEmptyValues: RemoveAllEmptyValues = (obj) =>
//   Object.entries(obj)
//     .filter(([, v]) => v != null)
//     .reduce(
//       (acc, [k, v]) => ({
//         ...acc,
//         [k]: typeof v === 'object' ? removeAllEmptyValues(v) : v,
//       }),
//       {}
//     )
