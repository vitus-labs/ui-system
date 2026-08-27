---
'@vitus-labs/hooks': patch
'@vitus-labs/kinetic': patch
---

Adapt to React Native 0.87 types and refresh the toolchain.

`react-native@0.87` regressed `Dimensions.addEventListener`'s generated
types to a bare `Function`, so `useBreakpoint` / `useWindowResize` (native)
now annotate the handler with `DimensionsPayload` and guard the optional
`window` field. `kinetic`'s native `CollapseRenderer` gained an explicit
`ReactElement` return type so its declaration no longer has to name RN's
internal `ReactNativeElement`.

No public API changes — dev/build tooling (`@vitus-labs/tools-*` 2.6.3,
vitest 4.1.11, jsdom 30, biome 2.5.10, vite 8.2.2) moved to latest.
