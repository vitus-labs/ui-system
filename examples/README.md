# Examples

Example apps demonstrating `@vitus-labs` packages with different CSS-in-JS engines and frameworks.

## Prerequisites

Install dependencies from the monorepo root:

```bash
bun install
```

## Running an example

From the monorepo root, run any example with:

```bash
# Vite examples
bun run --cwd examples/vite-styler dev
bun run --cwd examples/vite-styled-components dev
bun run --cwd examples/vite-emotion dev

# Next.js examples
bun run --cwd examples/nextjs-styler dev
bun run --cwd examples/nextjs-styled-components dev
bun run --cwd examples/nextjs-emotion dev
```

Or navigate into the example directory directly:

```bash
cd examples/vite-styler
bun run dev
```

## What's inside

Each example demonstrates:

- **config.styled** — engine-agnostic styled components via `@vitus-labs/core`
- **coolgrid** — responsive grid with `Row` and `Col`
- **Element** — layout primitive with `beforeContent`, `afterContent`, `direction`, `gap`
- **Rocketstyle** — stateful component with `.theme()`, `.states()`, and boolean prop shortcuts
- **Rocketstyle + Unistyle** — data-driven styling using `makeItResponsive` and `styles` from `@vitus-labs/unistyle`

## Available examples

| Example | Framework | CSS-in-JS Engine |
| --- | --- | --- |
| `vite-styler` | Vite | `@vitus-labs/styler` |
| `vite-styled-components` | Vite | `styled-components` |
| `vite-emotion` | Vite | `Emotion` |
| `nextjs-styler` | Next.js | `@vitus-labs/styler` |
| `nextjs-styled-components` | Next.js | `styled-components` |
| `nextjs-emotion` | Next.js | `Emotion` |
