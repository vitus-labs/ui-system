---
'@vitus-labs/rocketstories': patch
---

Five O(n²) → O(n) cleanups in the story-generation code paths. No public API or behavioural changes.

**Changes**

1. **`createControls`** (`utils/controls.ts`) — `Object.entries.reduce` with `return { ...acc, [key]: value }` per iteration was O(n²) (every assignment cloned the whole accumulator). Replaced with for-in + direct mutation.
2. **`convertDimensionsToControls`** (`utils/controls.ts`) — same pattern. O(n²) → O(n).
3. **`disableDimensionControls`** (`utils/controls.ts`) — nested `acc = { ...acc, ...disableControl(item) }` reduce was O(n²) over the *total* number of dimension values. Replaced with two-level for-in walk. Removed the now-unused internal `disableControl` helper, and tightened the `dimensions` parameter type from `Record<string, boolean>` to `Record<string, Record<string, unknown>>` (the real runtime shape — the prior type lied about the input).
4. **`extractDefaultBooleanProps`** (`utils/dimensions.ts`) — same pattern. O(n²) → O(n).
5. **`parseProps`** (`utils/code.ts`) — same pattern, with three `return { ...acc, [key]: value }` branches consolidated into a single mutation path.

These functions all run at story-creation time (once per story load in Storybook). For dimension-heavy components — typical design-system buttons run 4-8 dimensions with 5-10 values each — the O(n²) builds add up to thousands of unnecessary object clones.

**Verification**

- 136 rocketstories tests pass (no new tests — existing suite covers all five functions: `createControls`, `convertDimensionsToControls`, `disableDimensionControls`, `extractDefaultBooleanProps`, `parseProps` via the code-generation paths)
- 2688 monorepo tests pass
- `bun run lint`, `bun run typecheck` clean

Measured deltas are reported in the PR description (added to `perf-audit-bench.tsx`).
