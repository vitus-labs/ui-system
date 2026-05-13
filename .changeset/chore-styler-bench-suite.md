---
'@vitus-labs/styler': patch
---

Add a tracked CSS-in-JS perf benchmark at `packages/styler/benchmarks/`. Run with `bun run bench` from the styler package. Compares `@vitus-labs/styler` against `styled-components` 6 and `@emotion/styled` 11 on six scenarios: SSR (static / dynamic / themed) + CSR (mount / update / many distinct components).

Documents the runtime perf landscape and serves as a regression check — a >10% drop on any styler row vs `results.md` should be investigated before merging.

No runtime change; this only adds bench infra + devDependencies (`jsdom`, `tinybench`) to styler.
