---
'@vitus-labs/elements': patch
---

Three small structural cleanups in `elements`. No public API or behavioural changes.

**Changes**

1. **Iterator: fuse `filterValidItems` + `detectKind` into one scan** (`helpers/Iterator/component.tsx`). The previous code allocated an intermediate filtered array, then iterated it again to detect whether the surviving items were uniformly simple (string/number) or complex (objects). The new `filterAndDetectKind` builds the filtered array and detects kind in a single pass, then early-exits on mixed shape. Saves one full array allocation + traversal per data-driven Iterator render. The 48 existing Iterator tests cover the behaviour; all still pass.

2. **Text: drop the per-render `renderContent` closure** (`Text/component.tsx`). The component was creating a wrapper function inside its render body and immediately calling it. Inlined the JSX directly — same output shape, one fewer function allocation per render.

3. **Overlay: hoist the `closeOn` click-kinds array** (`Overlay/useOverlay.tsx`). The click-listener `useEffect` was allocating a fresh `['click', 'clickOnTrigger', 'clickOutsideContent']` array on every re-run for an `Array.includes` check. Replaced with a module-scoped `ReadonlySet` checked via `Set.has`. Same semantics, one fewer allocation per effect re-run.

**Verification**

- 271 elements tests pass (no new tests added — the existing suite covers all three changes)
- 2694 monorepo tests pass
- `bun run lint`, `bun run typecheck`, `bun run pkgs:build` all green

**Honest framing**

These are structural/allocation cleanups, not headline perf bumps. The package has no microbench in-tree, so I am not claiming a measurable delta — the wins are theoretical (fewer allocations per Iterator render, per Overlay effect re-run, per Text render). They compound at scale (long lists, frequent overlay state changes, large text-heavy trees) but are below the noise floor of any single-component scenario.
