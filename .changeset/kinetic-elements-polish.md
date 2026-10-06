---
"@vitus-labs/kinetic": patch
"@vitus-labs/kinetic-presets": patch
"@vitus-labs/elements": patch
---

- kinetic: removing a `Stagger` sibling no longer restarts the remaining items' in-flight enter/leave (the recomputed delay is read via a ref and applied only when a phase starts).
- kinetic-presets: README documents the corrected `reverse()` semantics (visible end state preserved; motion direction reversed).
- elements: a hover overlay no longer closes when its trigger blurs while the pointer is still over it.
- elements: `Iterator` fallback keys for unkeyed children are `.${index}`, so they can't collide with a user key like `"1"`.
