/**
 * Syncs peerDependency ranges for internal @vitus-labs/* packages.
 *
 * Called from each package's "version" npm lifecycle hook during
 * `changeset version`. Reads the new version from the package's own
 * package.json (already updated by changesets) and writes a caret range
 * (e.g. "^2.1.0") into every @vitus-labs/* peerDependency entry.
 *
 * Why caret ranges, not exact versions: with a fixed-package group,
 * exact-version peer deps cause Changesets to escalate any minor bump on
 * one package to a major bump on every dependent — because a peer-dep
 * range change is technically breaking per semver. Caret ranges
 * (^2.x.x covers all 2.y.z) match the team's intent: minor bumps stay
 * minor across the suite. All 15 packages still ship at the same version
 * via the fixed group; consumers in practice always upgrade together,
 * but the looser range removes the artificial escalation.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const pkgPath = resolve(process.cwd(), "package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const version = pkg.version

const internalScope = "@vitus-labs/"
let changed = false

if (pkg.peerDependencies) {
	for (const name of Object.keys(pkg.peerDependencies)) {
		if (name.startsWith(internalScope)) {
			pkg.peerDependencies[name] = `^${version}`
			changed = true
		}
	}
}

if (changed) {
	writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}
