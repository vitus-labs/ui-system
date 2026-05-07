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

Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
