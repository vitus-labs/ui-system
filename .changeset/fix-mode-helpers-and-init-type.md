---
"@vitus-labs/rocketstyle": patch
"@vitus-labs/rocketstories": patch
---

Two correctness fixes uncovered by the docs audit. Fix `isDark`/`isLight` swap in `getDefaultAttrs` mode helpers (`rocketstyle.tsx:532-533`) — runtime renders were correct via `useTheme`, but the static introspection path used by rocketstories fed `.attrs()` callbacks inverted helpers, so any story whose attrs branched on `helpers.isDark`/`helpers.isLight` showed wrong-mode-sensitive defaults. Tighten `IRocketStories.init` interface from a method (`() => {...}`) to a property literal — the runtime is an object literal, so `stories.init()` typechecked but threw `init is not a function` at runtime; now the type matches runtime. Includes regression tests for both.
