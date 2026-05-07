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

Loosen internal `peerDependencies` ranges from exact-version (`"2.1.0"`) to caret (`"^2.1.0"`) so installing one `@vitus-labs/*` package no longer pins every peer to a single point version. Combined with the new `onlyUpdatePeerDependentsWhenOutOfRange` Changesets option, this stops minor bumps in any one package from cascading into major bumps across the suite. All 15 packages still ship at the same version (fixed group), but the looser range better matches the team's release intent and how downstream consumers actually upgrade.
