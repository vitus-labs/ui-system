/**
 * Promotes each workspace package's current package.json version to the
 * `latest` npm dist-tag.
 *
 * Why this exists: the prerelease job on `release/**` branches publishes
 * versions to npm under the `next` tag. When the release PR merges to
 * `main`, the stable job runs `changeset publish` — which is a no-op when
 * there are no `.changeset/*` files (we use hand-bumped versions, not
 * changesets). Without an explicit promotion step, `latest` stays pinned
 * at whatever it was before the release, and `npm install` resolves to
 * stale code.
 *
 * Behaviour:
 *  - Walks every directory under `packages/`
 *  - Reads each `package.json`
 *  - Skips private / non-`@vitus-labs/*` packages
 *  - For each public package whose local version differs from the live
 *    `latest` dist-tag, runs `npm dist-tag add @scope/name@version latest`
 *  - Idempotent — already-promoted versions are skipped silently
 *
 * Auth: requires `NODE_AUTH_TOKEN` (set by `actions/setup-node` from a
 * granular automation token). Falls back to whatever `~/.npmrc` provides
 * locally (e.g. `npm login` interactive auth) when run by hand.
 */

import { execSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const PACKAGES_DIR = resolve(process.cwd(), "packages")
const SCOPE = "@vitus-labs/"

const dirs = readdirSync(PACKAGES_DIR, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name)

let promoted = 0
let alreadyCurrent = 0
let skipped = 0
const failures = []

for (const dir of dirs) {
	const pkgPath = resolve(PACKAGES_DIR, dir, "package.json")
	let pkg
	try {
		pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
	} catch {
		skipped++
		continue
	}

	if (pkg.private) {
		console.log(`skip ${pkg.name} (private)`)
		skipped++
		continue
	}

	if (!pkg.name?.startsWith(SCOPE)) {
		console.log(`skip ${pkg.name} (not ${SCOPE}*)`)
		skipped++
		continue
	}

	const { name, version } = pkg
	let currentLatest = ""
	try {
		currentLatest = execSync(`npm view ${name} dist-tags.latest`, {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim()
	} catch {
		// Package may not yet exist on npm — treat as no current latest
	}

	if (version === currentLatest) {
		console.log(`✓ ${name}@${version} is already latest`)
		alreadyCurrent++
		continue
	}

	console.log(
		`→ promoting ${name}@${version} to latest (was ${currentLatest || "<unset>"})`,
	)
	try {
		execSync(`npm dist-tag add ${name}@${version} latest`, {
			stdio: "inherit",
		})
		promoted++
	} catch (err) {
		failures.push({ name, version, error: err.message })
	}
}

console.log(
	`\nDone: ${promoted} promoted, ${alreadyCurrent} already current, ${skipped} skipped`,
)

if (failures.length > 0) {
	console.error(`\n${failures.length} failure(s):`)
	for (const f of failures) {
		console.error(`  ${f.name}@${f.version} — ${f.error}`)
	}
	process.exit(1)
}
