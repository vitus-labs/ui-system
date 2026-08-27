---
'@vitus-labs/attrs': patch
'@vitus-labs/connector-emotion': patch
'@vitus-labs/connector-native': patch
'@vitus-labs/connector-styled-components': patch
'@vitus-labs/connector-styler': patch
'@vitus-labs/coolgrid': patch
'@vitus-labs/core': patch
'@vitus-labs/elements': patch
'@vitus-labs/hooks': patch
'@vitus-labs/kinetic': patch
'@vitus-labs/kinetic-presets': patch
'@vitus-labs/rocketstories': patch
'@vitus-labs/rocketstyle': patch
'@vitus-labs/styler': patch
'@vitus-labs/unistyle': patch
---

Rebuild on `@vitus-labs/tools-*` 2.7.0.

The build toolchain moves to rolldown 1.2.6 and rolldown-plugin-dts
0.28.2, so the published bundles are regenerated. No source or public
API changes — bundle sizes shift by tens of bytes and all size budgets
still pass.

2.7.0 also drops `rollup-plugin-filesize` from `tools-rolldown`, which
removes the `pacote` -> `cacache`/`sigstore`/`node-gyp` subtree from the
install graph: 157 fewer packages and 5 fewer security advisories.
