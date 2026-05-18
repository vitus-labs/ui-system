---
'@vitus-labs/styler': patch
---

Cache the pre-built ReactElement for the no-extra-props case of static `styled` components.

Most `<MyStyled />` call sites pass no props beyond `ref` — the destructure, `buildProps` iteration, and `createElement` calls produce the same element shape every render. Pre-build that element once at component creation and short-circuit in the render fn when `rawProps` is empty and `ref` is nullish.

**Impact**: styler's overhead-over-bare-React for static SSR drops from ~0.065 μs/render to ~0.008 μs/render (~88% reduction). Net effect on full SSR throughput is +3–4% because React's `renderToString` itself dominates the remaining cost. Most-benefit consumers: pages that emit many static styled components with no extra props (typical layout/typography building blocks).

ReactElement values are immutable so sharing the cached element across renders is safe; React still treats each render as a fresh tree by identity.
