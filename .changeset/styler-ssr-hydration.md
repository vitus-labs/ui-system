---
"@vitus-labs/styler": patch
---

Fix SSR/hydration gaps: hydrate every token of a merged `data-href="vl-a vl-b"` precedence tag (previously all SSR rules were duplicated on hydration), ship referenced `@keyframes` inside the component/global `<style precedence>` (they were missing from SSR HTML), and stop `useCSS` from growing the shared server buffer forever (it emits no CSS on the server; documented).
