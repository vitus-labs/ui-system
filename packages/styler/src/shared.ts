/**
 * Shared utilities used across multiple modules. `isDynamic` lives in
 * `resolve.ts` (resolveValue classifies CSSResults lazily with it) and is
 * re-exported here for existing importers.
 */
export { isDynamic } from './resolve'
