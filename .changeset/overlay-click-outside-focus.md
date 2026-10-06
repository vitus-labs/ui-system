---
"@vitus-labs/elements": patch
---

Overlay: a dropdown/popover dismissed by clicking outside no longer moves focus back to its trigger. Previously this happened in Safari (which doesn't focus clicked buttons), e.g. when opening a different overlay.
