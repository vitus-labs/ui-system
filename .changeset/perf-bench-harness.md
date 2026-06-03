---
---

Adds runnable `bun run bench` to `@vitus-labs/elements`, `@vitus-labs/rocketstyle`, and `@vitus-labs/attrs`. Each package gets a `benchmarks/` directory with a render-perf harness (tinybench + render-count diagnostics) and a captured `results.md` baseline. Dev-only — no consumer-visible changes.
