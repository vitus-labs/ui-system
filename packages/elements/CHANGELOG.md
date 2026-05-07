# @vitus-labs/elements

## 2.2.0

### Minor Changes

- [#210](https://github.com/vitus-labs/ui-system/pull/210) [`04aaac3`](https://github.com/vitus-labs/ui-system/commit/04aaac3cdb95dab6a4040013e0937a6120a01e15) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Generic `Props<T>` on `Iterator` and `List` with discriminated branches — `T` is inferred at the JSX call site from the `data` array. Primitive arrays get `SimpleProps<T>` (`valueName` required), object arrays get `ObjectProps<T>` (`valueName` forbidden, `itemKey` typed against `keyof T`), no-data calls get `ChildrenProps`, and unparameterized callers fall back to the previous loose shape (`LooseProps`) for back-compat. Existing code keeps type-checking; new code gains stricter inference automatically.

### Patch Changes

- [#208](https://github.com/vitus-labs/ui-system/pull/208) [`bb75613`](https://github.com/vitus-labs/ui-system/commit/bb75613ba75041ba405dbae1eb2f01ae66c7aa19) Thanks [@vitbokisch](https://github.com/vitbokisch)! - Migrate internal `peerDependencies` to the `workspace:^` protocol. At publish time the protocol is rewritten to a real caret range (`^X.Y.Z`) — same end result for downstream consumers — but in-source declarations stay symbolic, so they don't need updating on every version bump. Deletes `scripts/sync-peer-deps.mjs` and the `version` lifecycle hooks that invoked it across 10 packages. Combined with the new `bumpVersionsWithWorkspaceProtocolOnly` and `onlyUpdatePeerDependentsWhenOutOfRange` Changesets options, minor bumps in any one package now correctly propagate as minor across the whole fixed group instead of cascading into a major bump.
