---
"@vitus-labs/elements": patch
---

Add `LooseList` named export (and internal `LooseIterator` helper) — a loose-typed alias over the same runtime component, designed for use with HOC machinery like rocketstyle that wraps a component and reads `ExtractProps<typeof Component>` to derive the wrapper's prop surface.

**Why:** the strict overloaded `ListComponent` / `IteratorComponent` interfaces introduced in 2.2.0 (PR #199) give direct JSX callers per-mode narrowing (`<List data={users} valueName="x" />` rejected for object arrays, etc.), but `ExtractProps<typeof List>` resolves overloaded interfaces via the LAST overload — which is `ChildrenProps & ListExtras & RefExtra`, requiring `children`. That broke a 2.1.0 pattern where consumers wrapped `List` with rocketstyle and got a loose iterator surface.

**Why a separate export instead of fixing the default:** a single callable can't be both strict-per-T at call sites and loose for `infer P` reflection. Loose fallbacks (overload-last or generic-with-default) bleed into call-site resolution and defeat the narrowing.

**Usage:**

```ts
import List, { LooseList } from '@vitus-labs/elements'

// Direct use — keeps full narrowing
<List data={users} valueName="x" />          // ❌ correctly rejected

// HOC wrapping — uses the loose alias
const StyledList = rocketstyle()({ component: LooseList })
<StyledList data={[...]} />                  // ✅ works
```

Same runtime component under both names — no breaking change to existing imports.
