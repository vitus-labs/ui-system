/**
 * Evict the oldest `percent`% of a Map's entries (by insertion order). Used by
 * the bounded caches in `sheet.ts` and `resolve.ts` so we degrade gracefully
 * past the threshold instead of dropping a fixed amount and immediately re-
 * filling. Map iteration order is insertion order in V8/JSC/SpiderMonkey, so
 * iterating + deleting from the front evicts the oldest entries.
 */
export const evictMapByPercent = <K, V>(map: Map<K, V>, percent = 0.1) => {
  const toDelete = Math.floor(map.size * percent)
  if (toDelete <= 0) return
  let count = 0
  for (const key of map.keys()) {
    if (count >= toDelete) break
    map.delete(key)
    count++
  }
}
