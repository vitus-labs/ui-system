/**
 * Data-driven list renderer that supports three input modes: React children
 * (including fragments), an array of primitives, or an array of objects.
 * Each item receives positional metadata (first, last, odd, even, position)
 * and optional injected props via `itemProps`. Items can be individually
 * wrapped with `wrapComponent`. Children always take priority over the
 * component+data prop pattern.
 */
import { isEmpty, render } from '@vitus-labs/core'
import {
  Children,
  type FC,
  memo,
  type ReactElement,
  type ReactNode,
} from 'react'
import { isFragment } from 'react-is'
import type {
  ChildrenProps,
  ElementType,
  ExtendedProps,
  LooseProps,
  ObjectProps,
  ObjectValue,
  Props,
  PropsCallback,
  SimpleProps,
  SimpleValue,
  TObj,
} from './types'

const RESERVED_PROPS = [
  'children',
  'component',
  'wrapComponent',
  'data',
  'itemKey',
  'valueName',
  'itemProps',
  'wrapProps',
] as const

const buildExtendedProps = (i: number, length: number): ExtendedProps => {
  const position = i + 1
  return {
    index: i,
    first: position === 1,
    last: position === length,
    odd: position % 2 === 1,
    even: position % 2 === 0,
    position,
  }
}

const resolveCallback = (
  cb: PropsCallback | undefined,
  source: TObj,
  ext: ExtendedProps,
): TObj => {
  if (!cb) return {}
  return typeof cb === 'function' ? cb(source as any, ext) : cb
}

/**
 * Internal render specification — one per item, regardless of input mode.
 * Lets the three input shapes (children / simple array / object array) share
 * a single rendering pass.
 */
type ItemSpec = {
  key: SimpleValue
  /** What to render — either a ReactNode (children mode) or a component (data mode). */
  target: ReactNode | ElementType
  /** Source object passed to itemProps/wrapProps callbacks (caller-defined shape). */
  source: TObj
  /** Base props merged with the itemProps callback result for the rendered item. */
  base: TObj
  /** When true, `target` is a ReactNode and should be rendered via `render(child, props)`. */
  isNode: boolean
  /** When set, overrides `wrapComponent` (object-array items can ship their own `component`). */
  skipWrap: boolean
}

const renderSpec = (
  spec: ItemSpec,
  ext: ExtendedProps,
  itemProps: PropsCallback | undefined,
  wrapProps: PropsCallback | undefined,
  Wrapper: ElementType | undefined,
): ReactNode => {
  const injected = resolveCallback(itemProps, spec.source, ext)
  const finalItemProps = { ...injected, ...spec.base }

  if (Wrapper && !spec.skipWrap) {
    const finalWrapProps = resolveCallback(wrapProps, spec.source, ext)
    return (
      <Wrapper key={spec.key} {...finalWrapProps}>
        {spec.isNode
          ? render(spec.target as ReactNode, finalItemProps)
          : render(spec.target as ElementType, finalItemProps)}
      </Wrapper>
    )
  }

  const propsWithKey = { key: spec.key, ...finalItemProps }
  return spec.isNode
    ? render(spec.target as ReactNode, propsWithKey)
    : render(spec.target as ElementType, propsWithKey)
}

/** Normalize children (single, array, or fragment) into an array of nodes. */
const flattenChildren = (children: ReactNode): ReactNode[] => {
  if (Array.isArray(children)) return children
  if (isFragment(children)) {
    return (children as ReactElement<{ children: ReactNode[] }>).props.children
  }
  return [children]
}

type DataKind = 'simple' | 'complex' | null

const classifyItem = (item: unknown): DataKind => {
  const t = typeof item
  if (t === 'string' || t === 'number') return 'simple'
  if (t === 'object') return 'complex'
  return null
}

/**
 * Single-pass: filter out nullish + empty-object entries and detect whether
 * the surviving items form a uniformly simple (string/number) or complex
 * (object) collection. Mixed shapes → kind `null`. Replaces the prior
 * `filterValidItems` + `detectKind` two-pass which allocated an intermediate
 * filtered array; this fuses both into one scan.
 */
const filterAndDetectKind = (
  data: unknown[],
): { items: unknown[]; kind: DataKind } => {
  const items: unknown[] = []
  let kind: DataKind = null
  for (const item of data) {
    if (item == null) continue
    if (typeof item === 'object' && isEmpty(item as Record<string, unknown>))
      continue
    items.push(item)
    const t = classifyItem(item)
    if (t === null) return { items, kind: null }
    if (kind === null) kind = t
    else if (kind !== t) return { items, kind: null }
  }
  return { items, kind }
}

const objectKey = (
  item: ObjectValue,
  index: number,
  itemKey: Props['itemKey'],
): SimpleValue => {
  if (!itemKey) return item.key ?? item.id ?? item.itemId ?? index
  if (typeof itemKey === 'function') return itemKey(item, index)
  if (typeof itemKey === 'string')
    return (item[itemKey] as SimpleValue) ?? index
  return index
}

const buildChildrenSpecs = (children: ReactNode): ItemSpec[] =>
  flattenChildren(children).map<ItemSpec>((node, i) => ({
    key: i,
    target: node,
    source: {},
    base: {},
    isNode: true,
    skipWrap: false,
  }))

const buildSimpleSpecs = (
  items: SimpleValue[],
  component: ElementType,
  valueName: string | undefined,
  itemKey: Props['itemKey'],
): ItemSpec[] => {
  const keyName = valueName ?? 'children'
  return items.map((value, i) => ({
    key: typeof itemKey === 'function' ? itemKey(value, i) : i,
    target: component,
    source: { [keyName]: value },
    base: { [keyName]: value },
    isNode: false,
    skipWrap: false,
  }))
}

const buildObjectSpecs = (
  items: ObjectValue[],
  component: ElementType,
  itemKey: Props['itemKey'],
): ItemSpec[] =>
  items.map((item, i) => {
    const { component: itemComponent, ...rest } = item
    return {
      key: objectKey(rest, i, itemKey),
      target: itemComponent ?? component,
      source: item as TObj,
      base: rest as TObj,
      isNode: false,
      // Object-array items that ship their own component bypass the wrapper.
      skipWrap: Boolean(itemComponent),
    }
  })

const buildDataSpecs = (
  data: unknown[],
  component: ElementType,
  valueName: string | undefined,
  itemKey: Props['itemKey'],
): ItemSpec[] | null => {
  const { items, kind } = filterAndDetectKind(data)
  if (items.length === 0 || !kind) return null
  return kind === 'simple'
    ? buildSimpleSpecs(items as SimpleValue[], component, valueName, itemKey)
    : buildObjectSpecs(items as ObjectValue[], component, itemKey)
}

const Component: FC<Props> = ({
  itemKey,
  valueName,
  children,
  component,
  data,
  wrapComponent: Wrapper,
  wrapProps,
  itemProps,
}) => {
  // ----------------------------------------------------------------------
  // Build a uniform list of ItemSpecs from whichever input mode is active.
  // Children always take priority over component + data.
  // ----------------------------------------------------------------------
  let specs: ItemSpec[] | null = null

  if (children) {
    // Single-child fast path: skip metadata work entirely if no extension is needed.
    if (
      !Array.isArray(children) &&
      !isFragment(children) &&
      !itemProps &&
      !Wrapper
    ) {
      return children
    }
    specs = buildChildrenSpecs(children)
  } else if (component && Array.isArray(data)) {
    specs = buildDataSpecs(data, component, valueName, itemKey)
  }

  if (!specs || specs.length === 0) return null

  // ----------------------------------------------------------------------
  // Single rendering pass — works for all three input modes.
  // ----------------------------------------------------------------------
  const total = specs.length
  return Children.toArray(
    specs.map((spec, i) =>
      renderSpec(
        spec,
        buildExtendedProps(i, total),
        itemProps,
        wrapProps,
        Wrapper,
      ),
    ),
  )
}

// ---------------------------------------------------------------------------
// Public callable type — overloads expose the generic `<T>` API at the JSX
// boundary while the impl stays loose-typed. TS picks the matching overload
// based on the props object passed:
//
//   <Iterator data={['a','b']} valueName="text" component={Item} />
//   ^ T inferred as string → SimpleProps<string> overload selected
//
//   <Iterator data={users} component={UserCard} />
//   ^ T inferred as User → ObjectProps<User> overload selected
//
//   <Iterator>{...}</Iterator>            → ChildrenProps overload selected
//   <Iterator {...untypedProps} />        → LooseProps fallback overload
// ---------------------------------------------------------------------------
export interface IteratorComponent {
  // T is inferred from the `data` prop at the JSX site — no explicit
  // generic argument needed. Order matters: SimpleProps first (matches
  // `data: SimpleValue[]`), then ObjectProps (object[]), then ChildrenProps,
  // then a LooseProps fallback.
  //
  // The narrow overloads (Simple/Object/Children) drive per-mode T
  // inference and stricter compile-time errors for direct callers. The
  // LooseProps fallback exists for forwarding patterns where
  // `Partial<(typeof Wrapper)['$$types']>` is spread back into the JSX
  // site — without a loose binding home, the wide union from
  // overload-distribution (rocketstyle's ExtractProps) couldn't bind to
  // any narrow overload.
  <T extends SimpleValue>(props: SimpleProps<T>): ReactNode
  <T extends ObjectValue>(props: ObjectProps<T>): ReactNode
  (props: ChildrenProps): ReactNode
  (props: LooseProps): ReactNode
  isIterator: true
  RESERVED_PROPS: typeof RESERVED_PROPS
  displayName?: string
}

const Iterator = Object.assign(memo(Component), {
  isIterator: true as const,
  RESERVED_PROPS,
}) as unknown as IteratorComponent

export default Iterator
