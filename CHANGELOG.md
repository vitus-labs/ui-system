# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Minimum React version bumped to >= 19 across all packages
- Minimum styled-components version bumped to >= 6 in documentation
- Migrated from Yarn 3 to Bun workspaces
- Migrated from ESLint/Prettier to Biome for linting and formatting
- Replaced lodash-es with custom utility implementations in `@vitus-labs/core`
- Removed moize dependency (unused memoization)

### Fixed

- `@vitus-labs/unistyle`: Replaced `JSON.stringify` comparison with `shallowEqual` in `optimizeTheme`
- `@vitus-labs/unistyle`: Fixed O(n^2) spread pattern in `optimizeTheme` and `createMediaQueries`
- `@vitus-labs/elements`: Fixed `withEqualSizeBeforeAfter` HOC — uses DOM queries instead of hardcoded children indices
- `@vitus-labs/elements`: Fixed ref forwarding in `withEqualSizeBeforeAfter` using `useImperativeHandle`
- `@vitus-labs/rocketstories`: Removed deprecated `renderAllDimensions` (dead code)

### Added

- Comprehensive test coverage across all packages (90%+)
- Consolidated Jest configuration with shared base config
- Prototype pollution guards in `set()` and `merge()` utilities
- Comprehensive README documentation for all packages
- CONTRIBUTING.md, SECURITY.md, and CHANGELOG.md
