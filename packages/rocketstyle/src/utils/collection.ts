// --------------------------------------------------------
// Remove Nullable values
// --------------------------------------------------------
/** Filters out entries with `null`, `undefined`, or `false` values from an object. */
type RemoveNullableValues = (obj: Record<string, any>) => Record<string, any>
// O(n) single-pass. The prior `.filter().reduce(spread)` was O(n²) (spread
// allocates a fresh accumulator per step) and allocated two intermediate
// arrays. Matches the sibling implementation in
// `packages/attrs/src/utils/collection.ts`.
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
