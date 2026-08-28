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
5. Merging triggers another `release.yml` run that publishes to npm via OIDC trusted publishing (no secrets needed) and creates a single umbrella `vX.Y.Z` GitHub Release for the suite. Per-package detail lives in each `packages/*/CHANGELOG.md`.

### Setup: make Version PRs self-trigger CI

**Why this matters.** `changesets/action` pushes the Version PR commit using `GITHUB_TOKEN`. GitHub silently suppresses workflow runs for events triggered by `GITHUB_TOKEN` (recursion-prevention), so the Version PR lands with **empty CI checks**. Without a non-`GITHUB_TOKEN` identity, every release requires a manual close+reopen on the Version PR to fire CI.

Both workflows are built around a single secret, **`RELEASE_TOKEN`**, matching how `vitus-labs/tools` is configured.

> **Current state (2026-08-28):** `ratchet.yml` uses `RELEASE_TOKEN`. `release.yml` is **temporarily pinned to `GITHUB_TOKEN`** because the `RELEASE_TOKEN` secret cannot push yet — a dispatched ratchet run failed with `Permission to vitus-labs/ui-system.git denied to vitbokisch ... 403`. The identity in that error is the token owner rather than `github-actions[bot]`, so the secret is set and being read; it just lacks **Contents: write**. `vitus-labs` is an Organization, so a fine-grained PAT additionally needs approval under *Org Settings → Personal access tokens*.
>
> Releasing on an under-scoped token would be worse than not using it: `changeset publish` reaches npm over OIDC and would succeed, then the tag push and GitHub Release would 403 — packages published with no tag and no Release. Grant the permissions, approve the token, verify with `gh workflow run ratchet.yml --ref main` (same push path, no npm involved), then restore the one-line `env:` in `release.yml`. Instructions are in the file.

#### Setup — fine-grained PAT

1. **Create the PAT**: github.com/settings/personal-access-tokens → *Generate new token (Fine-grained)*
   - Resource owner: `vitus-labs`
   - Repository access: only `vitus-labs/ui-system`
   - Permissions: Repository → Contents = read+write, Pull requests = read+write, Workflows = read+write
   - Expiration: long-lived or rotation-based per your security policy
2. **Add as secret**: repo → Settings → Secrets and variables → Actions → *New repository secret*
   - Name: `RELEASE_TOKEN`
   - Value: (paste the token)

If it is unset, both workflows fall back to `GITHUB_TOKEN`. Releases still work — you just close+reopen the Version PR once to kick CI, which is exactly what `RELEASE_TOKEN` exists to avoid.

#### Why `ratchet.yml` needs it too

The same suppression applies to the weekly coverage-ratchet job. A branch it pushes with `GITHUB_TOKEN` gets **no status checks at all**, and branch protection then blocks the PR permanently. Nine identical ratchet PRs accumulated between 2026-06-29 and 2026-08-24 for exactly this reason before it was fixed — none of them could ever go green.

### Prerelease channel

Push to a branch matching `release/**` or `feature/**` to publish a snapshot version under the `next` dist-tag. Consumers can install:

```bash
npm install @vitus-labs/styler@next
```

Useful for testing a PR's effect on downstream apps before merging to `main`.

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
