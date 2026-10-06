---
"@vitus-labs/elements": patch
---

Overlay/Iterator/Element correctness fixes: `onClose` fires once per close and nested overlays no longer close their parents; only the topmost overlay closes on Escape; focus returns to the trigger for dropdowns/popovers; hover overlays react to focus/blur; tooltip/popover ARIA roles; modal focus trap keeps Tab inside when nothing is focusable; parent container overflow is restored; Portal cleanup is safe and mounts before paint; Iterator preserves user keys and supports single-child fragments; `equalBeforeAfter` can shrink; Element re-attaches swapped refs; Overlay no longer injects component props into DOM element children; Text memoizes its `$text` prop.
