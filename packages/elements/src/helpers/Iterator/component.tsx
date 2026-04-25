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
  ElementType,
  ExtendedProps,
  ObjectValue,
  Props,
  PropsCallback,
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

/** Drop nullish entries and empty objects (matches legacy behavior). */
const filterValidItems = (data: unknown[]): unknown[] =>
  data.filter(
    (item) =>
      item != null &&
      !(typeof item === 'object' && isEmpty(item as Record<string, unknown>)),
  )

type DataKind = 'simple' | 'complex' | null

/** Determine if the array is uniformly simple (string/number) or complex (object). Mixed → null. */
const detectKind = (items: unknown[]): DataKind => {
  let kind: DataKind = null
  for (const item of items) {
    const t =
      typeof item === 'string' || typeof item === 'number'
        ? 'simple'
        : typeof item === 'object'
          ? 'complex'
          : null
    if (t === null) return null
    if (kind === null) kind = t
    else if (kind !== t) return null
  }
  return kind
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
  const items = filterValidItems(data)
  if (items.length === 0) return null
  const kind = detectKind(items)
  if (!kind) return null
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

export default Object.assign(memo(Component), {
  isIterator: true as const,
  RESERVED_PROPS,
})
