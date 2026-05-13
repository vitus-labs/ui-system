---
"@vitus-labs/attrs": patch
"@vitus-labs/connector-emotion": patch
"@vitus-labs/connector-native": patch
"@vitus-labs/connector-styled-components": patch
"@vitus-labs/connector-styler": patch
"@vitus-labs/coolgrid": patch
"@vitus-labs/core": patch
"@vitus-labs/elements": patch
"@vitus-labs/hooks": patch
"@vitus-labs/kinetic": patch
"@vitus-labs/kinetic-presets": patch
"@vitus-labs/rocketstories": patch
"@vitus-labs/rocketstyle": patch
"@vitus-labs/styler": patch
"@vitus-labs/unistyle": patch
---

Fix publishing of internal `peerDependencies` — 2.2.0 shipped with the literal string `"workspace:^"` in published `peerDependencies`, which Bun (correctly) refuses to install. `npm publish` rewrites the workspace protocol in `dependencies` but **not** in `peerDependencies`, and `changeset publish` invokes `npm publish` under the hood. We now rewrite `workspace:^` (and `workspace:~`, `workspace:*`) to concrete caret ranges in a pre-publish step. The published artifact for `@vitus-labs/core` peer dep, for example, is now `"^2.2.1"` instead of `"workspace:^"`. Source declarations stay symbolic (`workspace:^`) so day-to-day workspace resolution is unchanged.
