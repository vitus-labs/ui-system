---
'@vitus-labs/elements': patch
'@vitus-labs/rocketstyle': patch
'@vitus-labs/attrs': patch
---

Fix Overlay, Iterator, Content and rocketstyle bugs found in the 2026-11 elements audit, and make two hot paths cheaper.

- **rocketstyle:** `mode(light, dark)` values returned by transform-dimension callbacks (e.g. a `modifiers` "outlined" callback) are now resolved for the active mode. Before, the raw function was merged into `$rocketstyle` and emitted as CSS (`border-color: (mode) => …`).
- **Overlay:** with nested modals only the topmost focus trap handles Tab. Before, the outer modal's trap pulled focus back to its own first control.
- **Overlay:** the modal focus trap skips `input[type="hidden"]` and elements inside `[hidden]` / `[inert]` subtrees, so autofocus and Tab wrapping land on real controls.
- **Overlay:** `alignX="center"` / `alignY="center"` now fall back to the side that pulls the content back on-screen. Overflowing on the right right-aligns the content to the trigger (and the same for bottom, left and top). Before, it picked the opposite side and moved the content further off-screen.
- **Overlay:** a hover overlay no longer stays stuck open after a nested overlay closes if the pointer left while the nested one was open. Presence tracking keeps running while blocked; only closing is held back until it unblocks.
- **Overlay:** a closed click-to-open overlay now listens for clicks on its trigger only. It adds a `document` listener only while it is open. 500 closed overlays used to add about 280µs to every page click.
- **Iterator:** in children mode, `false` / `null` children no longer count toward `first` / `last` / `position`, and the items of a nested `.map()` array each get `itemProps` and their own positional metadata. Keyed items still keep their state across reorders.
- **Element / Content:** `gap` puts its margins on the correct side for `reverseInline` / `reverseRows`.
- **rocketstyle:** the dimensions map, reserved-key list and omit `Set` are now cached per dimension-themes object and shared across instances. Before, every instance rebuilt them on mount.
- **attrs / rocketstyle:** `getDefaultAttrs()` now includes `.attrs(..., { priority: true })` values in the same order as the HOC (priority attrs, then attrs).
