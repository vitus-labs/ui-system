---
"@vitus-labs/core": minor
---

Add augmentable `CSSEngineResult` interface — `css()`'s return type now follows whichever engine `init()`'d via TypeScript module declaration merging, replacing the previous engine-agnostic `any`. Connector packages declare their concrete result shape; consumer code automatically gets the right type without core depending on any specific engine package.
