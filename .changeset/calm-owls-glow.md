---
'@vitus-labs/connector-emotion': patch
---

Fix Emotion `keyframes` interpolation and `createGlobalStyle` theme access.

- `css` stringified Emotion `keyframes` objects (`_EMO_name_@keyframes…_EMO_`), producing broken CSS for `animation: ${kf} 1s`. Style objects are now preserved and serialized through Emotion's own `css`.
- `createGlobalStyle` did not receive the context theme, so `({ theme }) => …` interpolations threw under `ThemeProvider`. It now injects `useTheme()` (an explicit `theme` prop still wins).
