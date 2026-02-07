# Contributing to UI System

Thank you for your interest in contributing. This guide covers the development setup, workflow, and conventions.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Bun](https://bun.sh/) >= 1.0

## Setup

```bash
git clone https://github.com/vitus-labs/ui-system.git
cd ui-system
bun install
```

## Development

### Build all packages

```bash
bun run pkgs:build
```

### Run tests

```bash
# All packages
bun run test

# Single package
bun run test --filter=@vitus-labs/core

# With coverage
cd packages/core && bun run test:coverage
```

### Lint

```bash
bun run lint
```

### Type check

```bash
bun run typecheck
```

## Project Structure

```text
packages/
  attrs/          # Chainable default-props factory
  coolgrid/       # Responsive grid system
  core/           # Shared utilities and styling bridge
  elements/       # Layout primitives (Element, List, Overlay, etc.)
  hooks/          # React hooks (useHover, useWindowResize)
  rocketstories/  # Auto-generated Storybook stories
  rocketstyle/    # Multi-dimensional styling system
  unistyle/       # Responsive CSS engine
```

## Workflow

1. Fork the repository
2. Create a feature branch from `main`: `git checkout -b feature/my-feature`
3. Make your changes
4. Ensure tests pass: `bun run test`
5. Ensure types check: `bun run typecheck`
6. Ensure lint passes: `bun run lint`
7. Commit with a clear message describing the change
8. Open a pull request against `main`

## Conventions

- **TypeScript** — all source code is TypeScript
- **Biome** — used for linting and formatting
- **Jest** — used for testing with `@swc/jest` transformer
- **styled-components** — CSS-in-JS styling engine
- **Workspace dependencies** — use `workspace:*` protocol for inter-package deps

## Commit Messages

Use clear, descriptive commit messages:

- `fix: resolve alignment issue in Element component`
- `feat: add useWindowResize onChange callback`
- `refactor: simplify optimizeTheme with shallowEqual`
- `test: add coverage for rocketstyle chaining`
- `docs: update elements README`

## Reporting Issues

- Use [GitHub Issues](https://github.com/vitus-labs/ui-system/issues)
- Include a minimal reproduction when reporting bugs
- Check existing issues before creating a new one

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).
