---
"@vitus-labs/rocketstories": patch
---

Bundle of 5 fixes for rocketstories: `.replaceComponent()` and `.config({ component })` now drop attrs on a real component swap (mirrors the rocketstyle fix); typo rename `cloneAndEhnance` → `cloneAndEnhance`; proper types for `RocketType.getStaticDimensions` and `getDefaultAttrs` (no more `any`); three `as any` casts in render paths replaced with honest typed casts; `@storybook/react` peer dep loosened from exact `10.3.6` to `^10.3.6`.
