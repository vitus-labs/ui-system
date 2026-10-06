---
'@vitus-labs/kinetic': patch
'@vitus-labs/kinetic-presets': patch
---

Fix several kinetic transition correctness bugs.

kinetic:
- `Stagger` and the `delay` prop are no longer defeated by the `transition` shorthand; the delay is re-applied and cleared once entered.
- `TransitionGroup` / `kinetic().group()`: a leaving item keeps its position instead of jumping to the end (which cancelled its exit), and a re-added key that was in the initial render now animates in. Children without a `key` warn in development.
- `kinetic().stagger()` / `.group()` forward `onEnter`, `onAfterEnter` (stagger: last child) and `onLeave`.
- Interrupted enter/leave transitions no longer leave stale classes behind.
- Animation end detection: completes via the fallback timeout when the child does not attach the ref (with a dev warning), restarts the timer when switching entering to leaving, waits for the longest running transition, and completes on the next frames when durations are explicitly zero.

kinetic-presets:
- `reverse()` keeps the visible end state (the element is no longer hidden after entering).
- `withDuration()` / `withDelay()` handle comma-separated transitions, `cubic-bezier(...)` and decimal times like `.3s`, and replace an existing delay instead of adding a third time value.
