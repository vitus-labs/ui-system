---
"@vitus-labs/connector-native": patch
---

`parseCSS` parses leading-dot / `+`-signed numbers (`.5` → `0.5`) and skips balanced nested `{…}` blocks instead of corrupting the surrounding declarations.
