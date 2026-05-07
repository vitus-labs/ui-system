---
"@vitus-labs/rocketstories": patch
---

Snapshot the theme into per-`storyOf` Configuration at construction time so each builder is isolated from later `setTheme` mutations or competing `init({ theme })` calls in the same process. `RocketStoryHoc` and `renderDimension` now read theme from Configuration instead of the module-level singleton — fixes a latent bug where two `storyOf` instances with different themes would have the second one's theme corrupt the first's static introspection. Existing default `Theme` decorator path (singleton-based) keeps working for back-compat.
