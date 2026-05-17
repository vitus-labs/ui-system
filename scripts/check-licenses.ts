/**
 * Walk `node_modules`, read each package.json's `license` field, and fail
 * if any production dependency carries a license from the blocklist.
 *
 * Blocklist covers strong copyleft (GPL family) and source-disclosure
 * licenses (AGPL, SSPL, EUPL). These contaminate distribution downstream:
 * once any code in our bundle is GPL, the whole bundle inherits the
 * obligation. We ship MIT — any GPL/AGPL/SSPL dep in production would
 * break that.
 *
 * Excludes devDependencies: build/test/lint tooling can be GPL because
 * it never lands in shipped bundles.
 *
 * Run: bun scripts/check-licenses.ts
 * CI:  fails (exit 1) on any blocklist hit.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BLOCKED_LICENSES = new Set([
  'GPL-1.0',
  'GPL-1.0+',
  'GPL-1.0-only',
  'GPL-1.0-or-later',
  'GPL-2.0',
  'GPL-2.0+',
  'GPL-2.0-only',
  'GPL-2.0-or-later',
  'GPL-2.0-with-classpath-exception',
  'GPL-3.0',
  'GPL-3.0+',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'AGPL-1.0',
  'AGPL-1.0-only',
  'AGPL-1.0-or-later',
  'AGPL-3.0',
  'AGPL-3.0-only',
  'AGPL-3.0-or-later',
  'SSPL-1.0',
  'EUPL-1.0',
  'EUPL-1.1',
  'EUPL-1.2',
  'CDDL-1.0',
  'CDDL-1.1',
])

// Packages explicitly allowed despite a blocked license string (rare,
// require justification — e.g. dual-licensed packages where one option
// is MIT-compatible). Empty for now.
const ALLOWLIST = new Set<string>()

type Finding = {
  name: string
  version: string
  license: string
  path: string
}

const isBlocked = (license: unknown): string | null => {
  if (typeof license !== 'string') {
    // license can be an object { type, url } in old packages — handle that
    if (license && typeof license === 'object' && 'type' in license) {
      return isBlocked((license as { type: unknown }).type)
    }
    return null
  }
  // SPDX expression: split into individual identifiers using SPDX
  // operators (OR, AND, WITH) + parens as boundaries. Then check each
  // token against the blocklist by EXACT match. This avoids false
  // positives like "LGPL-3.0" matching "GPL-3.0" via substring.
  const tokens = license
    .replace(/[()]/g, ' ')
    .split(/\s+(?:OR|AND|WITH)\s+/i)
    .flatMap((t) => {
      const trimmed = t.trim()
      return trimmed ? [trimmed] : []
    })

  // If ANY token is OR'd with a permissive license, allow.
  const hasPermissiveAlt = license
    .split(/\s+OR\s+/i)
    .some((part) =>
      /\b(MIT|Apache-2\.0|ISC|BSD-[23]-Clause|BSD-3-Clause-Clear|CC0-1\.0|Unlicense|0BSD|WTFPL|Zlib)\b/i.test(
        part.replace(/[()]/g, ''),
      ),
    )
  if (hasPermissiveAlt) return null

  for (const tok of tokens) {
    if (BLOCKED_LICENSES.has(tok)) return license
  }
  return null
}

const walkPkgDirs = function* (root: string): Generator<string> {
  let entries: string[]
  try {
    entries = readdirSync(root)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry === '.bin' || entry === '.cache') continue
    const full = join(root, entry)
    let st: ReturnType<typeof statSync>
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (!st.isDirectory()) continue
    if (entry.startsWith('@')) {
      // scope dir — recurse one level only
      yield* walkPkgDirs(full)
      continue
    }
    yield full
    // Walk nested node_modules (hoisting fallback)
    const nested = join(full, 'node_modules')
    try {
      if (statSync(nested).isDirectory()) yield* walkPkgDirs(nested)
    } catch {
      /* no nested node_modules */
    }
  }
}

const findings: Finding[] = []
const seen = new Set<string>()

for (const pkgDir of walkPkgDirs(join(process.cwd(), 'node_modules'))) {
  const pkgJsonPath = join(pkgDir, 'package.json')
  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
  } catch {
    continue
  }
  const name = String(pkg.name ?? '')
  const version = String(pkg.version ?? '')
  const key = `${name}@${version}`
  if (seen.has(key)) continue
  seen.add(key)

  if (ALLOWLIST.has(name)) continue

  const license = pkg.license ?? pkg.licenses
  const blocked = isBlocked(license)
  if (blocked) {
    findings.push({ name, version, license: blocked, path: pkgJsonPath })
  }
}

if (findings.length === 0) {
  // biome-ignore lint/suspicious/noConsole: CLI script output
  console.log(`✓ License check passed — ${seen.size} package(s) scanned, 0 blocked.`)
  process.exit(0)
}

// biome-ignore lint/suspicious/noConsole: CLI script output
console.error(`✗ License check FAILED — ${findings.length} blocked package(s):\n`)
for (const f of findings) {
  // biome-ignore lint/suspicious/noConsole: CLI script output
  console.error(`  ${f.name}@${f.version}  ${f.license}`)
}
// biome-ignore lint/suspicious/noConsole: CLI script output
console.error(
  `\nBlocked licenses: ${[...BLOCKED_LICENSES].slice(0, 6).join(', ')}, ...`,
)
// biome-ignore lint/suspicious/noConsole: CLI script output
console.error(
  `If a finding is a false positive (e.g. dual-licensed), add the package name to ALLOWLIST in this script with a comment explaining why.`,
)
process.exit(1)
