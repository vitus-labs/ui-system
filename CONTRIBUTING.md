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

## Releases & Changesets

Releases are driven by [Changesets](https://github.com/changesets/changesets). Every PR that changes user-facing behavior of any `@vitus-labs/*` package must include a changeset describing the change.

### Adding a changeset

```bash
bun changeset
```

The interactive prompt asks you to pick:

1. **Packages affected** — choose any one (the [fixed-package group](.changeset/config.json) makes them all bump together anyway).
2. **Bump type**:
   - `patch` — bug fixes, type-only refactors, performance work, dependency bumps.
   - `minor` — new public API surface (new exports, new generic type parameters, new options, new methods).
   - `major` — breaking changes (removed exports, signature changes, behavior changes that consumers must adapt to).
3. **Summary** — one sentence in the present tense, written for a release-notes audience.

The CLI creates `.changeset/<random-name>.md`. Commit it with your PR.

> Because all 15 packages are in a fixed group, every bump moves all of them together. Pick the bump type for the **highest-impact** change in your PR.

### When to skip a changeset

Add the `skip-changeset` label to the PR if it:

- Touches only `.github/`, `.vscode/`, `scripts/`, or root-level config — not `packages/`
- Changes only this `CONTRIBUTING.md`, the root `README.md`, or other repo-level docs (not package READMEs)
- Adds or fixes tests without changing the package surface

CI's `Changeset` check fails any PR that touches `packages/**` without either a changeset or the `skip-changeset` label.

### How a release happens (you don't run any of this)

1. Your PR with a `.changeset/*.md` file merges to `main`.
2. The next push to `main` triggers `release.yml` → `changesets/action` collects all unconsumed changesets and opens a `chore: version packages` PR.
3. That PR shows: bumped versions in every `package.json`, generated `CHANGELOG.md` per package, deleted `.changeset/*.md` files.
4. CI runs on it; once green, mark it auto-merge (or wait for a maintainer).
5. Merging triggers another `release.yml` run that publishes to npm via OIDC trusted publishing (no secrets needed) and creates one GitHub Release per package with the changeset summaries as the body.

### Prerelease channel

Push to a branch matching `release/**` or `feature/**` to publish a snapshot version under the `next` dist-tag. Consumers can install:

```bash
npm install @vitus-labs/styler@next
```

Useful for testing a PR's effect on downstream apps before merging to `main`.

### Manual fallback (rare)

`scripts/promote-latest.mjs` and `bun run promote-latest` exist as a manual escape hatch in case dist-tags ever drift (e.g., a hand-bumped release where the prerelease branch published before the stable job ran). Run locally with `npm login` if needed — not wired into CI to keep the secret surface zero.

## Conventions

- **TypeScript** — all source code is TypeScript
- **Biome** — used for linting and formatting
- **Vitest** — used for testing (resolves `source` condition to TS source for fast workspace-wide tests)
- **`@vitus-labs/styler`** — built-in CSS-in-JS engine; consumers can swap to Emotion or styled-components via the connector packages
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
