# @vitus-labs/rocketstories

## 2.7.0

## 2.6.2

### Patch Changes

- [#248](https://github.com/vitus-labs/ui-system/pull/248) [`faa0e47`](https://github.com/vitus-labs/ui-system/commit/faa0e471a2b0a003046fc4ba963dc517ecf4d8fb) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Five O(n²) → O(n) cleanups in the story-generation code paths. No public API or behavioural changes.

  **Changes**

  1. **`createControls`** (`utils/controls.ts`) — `Object.entries.reduce` with `return { ...acc, [key]: value }` per iteration was O(n²) (every assignment cloned the whole accumulator). Replaced with for-in + direct mutation.
  2. **`convertDimensionsToControls`** (`utils/controls.ts`) — same pattern. O(n²) → O(n).
  3. **`disableDimensionControls`** (`utils/controls.ts`) — nested `acc = { ...acc, ...disableControl(item) }` reduce was O(n²) over the _total_ number of dimension values. Replaced with two-level for-in walk. Removed the now-unused internal `disableControl` helper, and tightened the `dimensions` parameter type from `Record<string, boolean>` to `Record<string, Record<string, unknown>>` (the real runtime shape — the prior type lied about the input).
  4. **`extractDefaultBooleanProps`** (`utils/dimensions.ts`) — same pattern. O(n²) → O(n).
  5. **`parseProps`** (`utils/code.ts`) — same pattern, with three `return { ...acc, [key]: value }` branches consolidated into a single mutation path.

  These functions all run at story-creation time (once per story load in Storybook). For dimension-heavy components — typical design-system buttons run 4-8 dimensions with 5-10 values each — the O(n²) builds add up to thousands of unnecessary object clones.

  **Verification**

  - 136 rocketstories tests pass (no new tests — existing suite covers all five functions: `createControls`, `convertDimensionsToControls`, `disableDimensionControls`, `extractDefaultBooleanProps`, `parseProps` via the code-generation paths)
  - 2688 monorepo tests pass
  - `bun run lint`, `bun run typecheck` clean

  Measured deltas are reported in the PR description (added to `perf-audit-bench.tsx`).

- Updated dependencies [[`804dd0e`](https://github.com/vitus-labs/ui-system/commit/804dd0e2bd9709c61766abeb3b9f4519a0d949f1)]:
  - @vitus-labs/elements@2.6.2

## 2.6.1

### Patch Changes

- Updated dependencies []:
  - @vitus-labs/elements@2.6.1

## 2.6.0

### Patch Changes

- Updated dependencies [[`e2117c6`](https://github.com/vitus-labs/ui-system/commit/e2117c6fece6e0c70e1095c9b2c0897c0070343f)]:
  - @vitus-labs/elements@2.6.0

## 2.5.0

### Patch Changes

- Updated dependencies [[`4114383`](https://github.com/vitus-labs/ui-system/commit/4114383abde75ce242fe38e2f08a67f17e567733)]:
  - @vitus-labs/elements@2.5.0

## 2.4.0

### Patch Changes

- Updated dependencies []:
  - @vitus-labs/elements@2.4.0

## 2.3.0

### Patch Changes

- Updated dependencies []:
  - @vitus-labs/elements@2.3.0

## 2.2.1

### Patch Changes

- [#217](https://github.com/vitus-labs/ui-system/pull/217) [`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.

- Updated dependencies [[`29aaed2`](https://github.com/vitus-labs/ui-system/commit/29aaed20c73c6cd466e0ac2ffb1512d4c519883a)]:
  - @vitus-labs/elements@2.2.1

## 2.2.0

### Patch Changes

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Two correctness fixes uncovered by the docs audit. Fix `isDark`/`isLight` swap in `getDefaultAttrs` mode helpers (`rocketstyle.tsx:532-533`) — runtime renders were correct via `useTheme`, but the static introspection path used by rocketstories fed `.attrs()` callbacks inverted helpers, so any story whose attrs branched on `helpers.isDark`/`helpers.isLight` showed wrong-mode-sensitive defaults. Tighten `IRocketStories.init` interface from a method (`() => {...}`) to a property literal — the runtime is an object literal, so `stories.init()` typechecked but threw `init is not a function` at runtime; now the type matches runtime. Includes regression tests for both.

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Bundle of 5 fixes for rocketstories: `.replaceComponent()` and `.config({ component })` now drop attrs on a real component swap (mirrors the rocketstyle fix); typo rename `cloneAndEhnance` → `cloneAndEnhance`; proper types for `RocketType.getStaticDimensions` and `getDefaultAttrs` (no more `any`); three `as any` casts in render paths replaced with honest typed casts; `@storybook/react` peer dep loosened from exact `10.3.6` to `^10.3.6`.

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Snapshot the theme into per-`storyOf` Configuration at construction time so each builder is isolated from later `setTheme` mutations or competing `init({ theme })` calls in the same process. `RocketStoryHoc` and `renderDimension` now read theme from Configuration instead of the module-level singleton — fixes a latent bug where two `storyOf` instances with different themes would have the second one's theme corrupt the first's static introspection. Existing default `Theme` decorator path (singleton-based) keeps working for back-compat.

- Updated dependencies [[`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15), [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19)]:
  - @vitus-labs/elements@2.2.0
