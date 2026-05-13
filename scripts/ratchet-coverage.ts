/**
 * Ratchet coverage thresholds in `vitest.config.ts` to lock in any
 * improvement since the last run.
 *
 * Reads `coverage/coverage-summary.json` (produced by vitest with
 * coverage). Compares each `total.<metric>.pct` against the current
 * threshold in vitest.config.ts. If current pct > threshold + MARGIN,
 * update threshold to floor(pct * 100) / 100 (truncate to two
 * decimals — preserves precision matching coverage-summary's format).
 *
 * Exits:
 *   0  — file updated (one or more thresholds raised)
 *   2  — no update needed (coverage stable or regressed)
 *   1  — unexpected error
 *
 * CI uses exit code 0 vs 2 to decide whether to open a ratchet PR.
 */

import { readFileSync, writeFileSync } from 'node:fs'

type Metric = 'lines' | 'statements' | 'functions' | 'branches'
const METRICS: readonly Metric[] = ['lines', 'statements', 'functions', 'branches']

// Don't ratchet on tiny improvements (single-test noise). Only update
// when the gain is at least this many points above the current floor.
const MARGIN = 0.05

const summaryPath = 'coverage/coverage-summary.json'
const configPath = 'vitest.config.ts'

const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as {
  total: Record<Metric, { pct: number }>
}
let config = readFileSync(configPath, 'utf8')

const truncate2 = (n: number): number => Math.floor(n * 100) / 100

const updates: Array<{ metric: Metric; from: number; to: number }> = []

for (const metric of METRICS) {
  const current = summary.total[metric]?.pct
  if (current == null || Number.isNaN(current)) {
    process.stderr.write(`ratchet-coverage: missing pct for ${metric}\n`)
    process.exit(1)
  }

  // Match `<metric>: <number>,` in the thresholds block. Allow trailing
  // comma + whitespace + comment. Captures the existing threshold value.
  const pattern = new RegExp(`(${metric}:\\s*)(\\d+(?:\\.\\d+)?)`, 'm')
  const match = config.match(pattern)
  if (!match) {
    process.stderr.write(
      `ratchet-coverage: could not locate threshold for ${metric} in ${configPath}\n`,
    )
    process.exit(1)
  }
  const old = Number(match[2])
  const next = truncate2(current)

  if (next > old + MARGIN) {
    config = config.replace(pattern, `$1${next}`)
    updates.push({ metric, from: old, to: next })
  }
}

if (updates.length === 0) {
  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log('ratchet-coverage: no update — thresholds already at or above current coverage.')
  process.exit(2)
}

writeFileSync(configPath, config)
// biome-ignore lint/suspicious/noConsole: CLI output
console.log('ratchet-coverage: updated thresholds:')
for (const u of updates) {
  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log(`  ${u.metric}: ${u.from} → ${u.to}`)
}
process.exit(0)
