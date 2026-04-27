---
'@vitus-labs/attrs': minor
'@vitus-labs/connector-emotion': minor
'@vitus-labs/connector-native': minor
'@vitus-labs/connector-styled-components': minor
'@vitus-labs/connector-styler': minor
'@vitus-labs/coolgrid': minor
'@vitus-labs/core': minor
'@vitus-labs/elements': minor
'@vitus-labs/hooks': minor
'@vitus-labs/kinetic': minor
'@vitus-labs/kinetic-presets': minor
'@vitus-labs/rocketstories': minor
'@vitus-labs/rocketstyle': minor
'@vitus-labs/styler': minor
'@vitus-labs/unistyle': minor
---

Performance, quality, and maintenance overhaul. No public API changes — every change is internal: type tightening, perf optimizations, and code quality improvements.

**Performance (PR #166)**
- `unistyle/stripUnit`: regex hoisted to module scope (was compiled per call across 170+ properties × breakpoints)
- `rocketstyle`: shallow-equal ref pattern replaces per-render string serialization for `useMemo` deps; `getTheme()` mutates `finalTheme` directly (copy-on-write protects `baseTheme`)
- `coolgrid`: `useGridContext` result memoized
- `styler`: theme injected via mutate-then-restore (avoids second n-key spread per dynamic render); `prepare()` results cached for SSR `<style precedence>` reuse
- `attrs/hoc`: fast path when no `.attrs()`/`.priorityAttrs()` configured (skips 3 spread allocations)
- `hooks/useFocusTrap`: focusable NodeList cached, refreshed via `MutationObserver`
- `hooks/useBreakpoint`: single rAF-throttled resize listener (was N matchMedia listeners, one per breakpoint)
- `elements/Element.equalize`: switched to `ResizeObserver` (no more synchronous layout in `useLayoutEffect`)
- `kinetic/TransitionGroup`: per-key `onAfterLeave` callbacks cached so one child finishing leaving doesn't churn fresh callback props for siblings

**Refactors (PRs #167, #168, #169, #170)**
- `elements/Iterator`: three render paths unified into a single `ItemSpec` pipeline (240 → 204 lines)
- `elements/Overlay`: `useOverlay` (858 lines) split into `positionMath`, `useEscapeKey`, `useHoverListeners`, `useScrollReposition` modules
- `rocketstyle/init`: `@ts-nocheck` removed and replaced with one localized boundary cast; impl made generic so `D`/`UB` propagate
- `rocketstyle` + `attrs`: 9 internal `any` parameters in chain methods replaced with proper interface types

**Quality (PRs #171, #172)**
- Lint warnings: 126 → 0 (biome overrides for tests + justified `biome-ignore` comments in source citing every invariant)
- Coverage gate added at exact baseline — any drop fails CI (statements 98.42% / branches 94.1% / functions 98.45% / lines 99.1%)
- Bundle size budgets enforced via `size-limit` (CI step + per-package budgets, ~78 KB gzipped total across 15 packages)
- All 8 source-level `@ts-expect-error` comments now have one-line justifications
- `@vitus-labs/tools-*` 1.x → 2.x bumped across the monorepo

**Other**
- Shared `evictMapByPercent` util extracted (`styler/sheet.ts` + `resolve.ts`)
- Kinetic test fixtures extracted (~300 duplicated lines removed)
- CLAUDE.md refreshed with audit/refactor learnings
- All CI action SHAs pinned to latest (harden-runner v2.19.0, setup-node v6.4.0, setup-bun v2.2.0, cache v5.0.5, codeql-action v4.35.2)
- expo-native security vulns fixed (0 high/critical, was many)
