---
"@vitus-labs/styler": patch
---

Fix prop forwarding: `styled.svg` now keeps SVG attributes (`viewBox`, `xmlns`, `d`, `fill`, `stroke*`, ...), every `on[A-Z]*` event handler is forwarded (capture, media, toggle, pointer, ...), `inert`/`popover*`/`suppressHydrationWarning` are allowed, and a custom `shouldForwardProp` is now honoured for component targets.
