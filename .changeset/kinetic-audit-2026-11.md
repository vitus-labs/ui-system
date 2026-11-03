---
"@vitus-labs/kinetic": patch
"@vitus-labs/kinetic-presets": patch
---

Kinetic correctness fixes from the 2026-11 audit.

**@vitus-labs/kinetic**

- Settled transitions restore the inline styles a phase overwrote. Final `transform` / `filter` / `clip-path` values no longer linger after `entered` (they broke `position: fixed` descendants and clipped overflow), and the child's own inline `transform` / `transition` survive. The final `enterToStyle` values are no longer left inline; put a resting state in the element's own style or classes.
- Reversing a transition mid-flight no longer flashes the opposite phase's start state. It continues from the current state.
- Turning reduced motion on mid-transition now completes the phase instead of hanging.
- `Collapse`: the content is a BFC (`display: flow-root`), so child margins are measured and the animation doesn't jump at the end. Reversing mid-animation now starts from the current height.
- Phases also complete on `transitioncancel`, or when `getAnimations()` reports nothing running (for example a 0px → 0px collapse or a `display: none` ancestor).
- `appear` with SSR renders the element in its enter start state instead of nothing, and the client's hydration render matches it.
- `Stagger`: `onAfterLeave` still fires when a child is added during leave. `onAfterEnter` fires once, for the last child, the same as `kinetic().stagger()`. `transition-delay` is no longer copied into children's `style`.
- `TransitionGroup`: the leaving-entry merge is O(n), with a fast path when nothing is leaving.

**@vitus-labs/kinetic-presets**

- `clipDiamond`'s end state now uncovers the corners.
- `withEasing` now rewrites every segment of a multi-property transition, not just the last one.
- Documented that `scaleOut`, `zoomOut*` and `puffOut` are entrances. Their names are unchanged.
