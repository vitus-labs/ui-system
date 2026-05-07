---
"@vitus-labs/rocketstyle": patch
---

Fix component-swap leak in `.config({ component })`. When `cloneAndEnhance` swaps the underlying component, the prior `attrs`, `priorityAttrs`, `compose`, and `filterAttrs` chain values were silently carried forward — they were tailored to the previous component's prop shape and could leak invalid props onto the rendered output. Now those chain values reset on component change. Style-side state (themes, dimensions, statics, pseudo) is preserved. Same-component swaps remain a no-op for attrs.
