import { dirname, resolve } from 'node:path'
import type { Plugin } from 'vite'

/**
 * Vite plugin that resolves `~/...` imports relative to the nearest `src/`
 * directory of the importing file. This allows cross-package source resolution
 * (via the `"source"` export condition) without `~` aliases conflicting.
 *
 * Example: `import config from '~/config'` in `packages/core/src/index.ts`
 * resolves to `packages/core/src/config.ts`, regardless of which package's
 * vitest config is active.
 */
export default function tildeResolve(): Plugin {
  return {
    name: 'vite-plugin-tilde-resolve',
    async resolveId(source, importer, options) {
      if (!source.startsWith('~/') || !importer) return null

      // Find the nearest src/ directory in the importer's path
      const dir = dirname(importer)
      const parts = dir.split('/')
      const srcIdx = parts.lastIndexOf('src')
      if (srcIdx === -1) return null

      const srcDir = parts.slice(0, srcIdx + 1).join('/')
      const target = resolve(srcDir, source.slice(2))

      // Delegate to Vite's resolver for extension/index resolution
      const resolved = await this.resolve(target, importer, {
        ...options,
        skipSelf: true,
      })
      return resolved
    },
  }
}
