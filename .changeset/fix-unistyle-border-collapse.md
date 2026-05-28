---
'@vitus-labs/unistyle': patch
---

Fix `borderCollapse`: it was declared in the `ITheme` prop type but had no `propertyMap` descriptor, so passing it type-checked yet emitted no CSS. Added the missing `simple` descriptor so `borderCollapse: 'collapse' | 'separate'` now produces `border-collapse: …`. Verified by diffing all 305 typed `ITheme` keys against the property map — this was the only typed-but-unmapped key (the other, `keyframe`, is intentionally consumed by the `animation` special handler).
