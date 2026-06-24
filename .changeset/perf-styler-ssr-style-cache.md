---
'@vitus-labs/styler': patch
---

Faster SSR: cache the `<style precedence>` element per resolved CSS. The dynamic render path no longer re-allocates an identical `<style>` ReactElement on every render of the same component — it reuses the immutable element via a WeakMap keyed on the `sheet.prepare()` result. ~9% faster on `ssr-dynamic` and ~5% on `ssr-themed`; static and client paths unchanged.
