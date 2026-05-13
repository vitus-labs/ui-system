/**
 * Rewrites `workspace:` peerDependency ranges to concrete semver ranges
 * across every package.json under `packages/`. Run immediately before
 * `npm publish` (via `changeset publish`) so the published artifact
 * carries valid semver instead of the workspace protocol literal.
 *
 * Why this exists: `npm publish` automatically rewrites the
 * `workspace:` protocol in `dependencies` but NOT in
 * `peerDependencies`. Bun/pnpm/yarn handle it for both. Since
 * `changeset publish` invokes `npm publish` under the hood, peer deps
 * carry `workspace:^` straight into the published package.json —
 * which Bun then refuses to install ("invalid semver range").
 *
 * @vitus-labs/* peers shipped broken in 2.2.0; this script + the
 * release.yml wiring around it close that hole for 2.2.1 onward.
 *
 * Behaviour:
 *   workspace:^   → ^X.Y.Z
 *   workspace:~   → ~X.Y.Z
 *   workspace:*   → X.Y.Z (exact)
 *   workspace:^X  → ^X.Y.Z (explicit ranges have their workspace:
 *                  prefix stripped — npm doesn't understand the prefix)
 *
 * Non-workspace ranges (e.g. literal `^2.1.0`, `>=19`) pass through.
 *
 * The dep's local version is the rewrite target — under the fixed-
 * package group, every internal `@vitus-labs/*` is at the same
 * version after `changeset version` runs, so this is always the
 * right number.
 *
 * IDEMPOTENT — running twice in a row is safe. Re-running on a tree
 * that's already concrete is a no-op.
 *
 * NOT for source: this MUTATES packages/*\/package.json in the
 * working tree. Designed to run in CI just before publish; don't run
 * it on a branch you intend to commit, or use `git restore packages/`
 * afterwards.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const PACKAGES_DIR = resolve(process.cwd(), "packages")
const SCOPE = "@vitus-labs/"

// First pass: collect the local version of every @vitus-labs/* package.
const versions = {}
const dirs = readdirSync(PACKAGES_DIR, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name)

for (const dir of dirs) {
	try {
		const pkg = JSON.parse(
			readFileSync(resolve(PACKAGES_DIR, dir, "package.json"), "utf8"),
		)
		if (pkg.name?.startsWith(SCOPE)) {
			versions[pkg.name] = pkg.version
		}
	} catch {
		// Ignore packages without a package.json.
	}
}

// Second pass: rewrite workspace: peerDeps.
let rewriteCount = 0
const failures = []

for (const dir of dirs) {
	const pkgPath = resolve(PACKAGES_DIR, dir, "package.json")
	let pkg
	try {
		pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
	} catch {
		continue
	}
	if (!pkg.peerDependencies) continue

	let changed = false
	for (const [name, range] of Object.entries(pkg.peerDependencies)) {
		if (!range.startsWith("workspace:")) continue
		const localVersion = versions[name]
		if (!localVersion) {
			failures.push(
				`${pkg.name}: peerDep ${name} uses workspace: but has no local version`,
			)
			continue
		}

		const tail = range.slice("workspace:".length)
		// `workspace:^` / `workspace:~` → preserve the prefix.
		// `workspace:*` → exact version (no prefix).
		// `workspace:<explicit-range>` → strip workspace:, keep the range.
		let rewritten
		if (tail === "^" || tail === "~") {
			rewritten = `${tail}${localVersion}`
		} else if (tail === "*") {
			rewritten = localVersion
		} else {
			rewritten = tail
		}

		pkg.peerDependencies[name] = rewritten
		changed = true
		rewriteCount++
		console.log(`  ${pkg.name}: ${name}  ${range} → ${rewritten}`)
	}

	if (changed) {
		writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
	}
}

console.log(`\n${rewriteCount} workspace: peerDep range(s) rewritten`)

if (failures.length > 0) {
	console.error(`\n${failures.length} unresolved failure(s):`)
	for (const f of failures) console.error(`  ${f}`)
	process.exit(1)
}
