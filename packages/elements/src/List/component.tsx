/**
 * List component that combines Iterator (data-driven rendering) with an
 * optional Element root wrapper. When `rootElement` is false (default),
 * it renders a bare Iterator as a fragment. When true, the Iterator output
 * is wrapped in an Element that receives all non-iterator props (e.g.,
 * layout, alignment, css), allowing the list to be styled as a single block.
 */
import { omit, pick } from '@vitus-labs/core'
import type { ReactNode, Ref } from 'react'
import { PKG_NAME } from '~/constants'
import type { Props as ElementProps, VLElement } from '~/Element'
import Element from '~/Element'
import type {
  ChildrenProps as IteratorChildrenProps,
  LooseProps as IteratorLooseProps,
  ObjectProps as IteratorObjectProps,
  Props as IteratorProps,
  SimpleProps as IteratorSimpleProps,
  ObjectValue,
  SimpleValue,
} from '~/helpers/Iterator'
import Iterator from '~/helpers/Iterator'
import type { MergeTypes } from '~/types'

type ListOnly = {
  /**
   * A boolean value. When set to `false`, component returns `React.Fragment`
   * When set to `true`, component returns as the **root** element `Element`
   * component.
   */
  rootElement?: boolean
  /**
   * Label prop from `Element` component is being ignored.
   */
  label?: never
  /**
   * Content prop from `Element` component is being ignored.
   */
  content?: never
}

/**
 * Props that List accepts on top of the Iterator branch — the Element prop
 * surface (so `tag`, `direction`, `alignX`, etc. forward when
 * `rootElement` is true) plus the List-only toggle.
 */
type ListExtras = ElementProps & ListOnly

/**
 * Public Props — generic over the data element type so callers get the same
 * inference Iterator does, plus the List-specific `rootElement` toggle and
 * Element prop forwarding.
 *
 *   Props<string>          → SimpleProps & ListExtras  (valueName REQUIRED)
 *   Props<{ id; name }>    → ObjectProps & ListExtras  (valueName FORBIDDEN)
 *   Props<unknown> / Props → LooseProps & ListExtras   (today's behavior)
 */
export type Props<T = unknown> = MergeTypes<[IteratorProps<T>, ListExtras]>

const Component: VLElement<IteratorLooseProps & ListExtras> = ({
  rootElement = false,
  ref,
  ...props
}: any) => {
  // Internal spread — runtime is correct, but the picked subset can't satisfy
  // any specific Iterator overload statically (which is good — the public
  // overloads enforce constraints). Cast Iterator to a loose callable for
  // the internal forwarding only; public consumers still see the strict
  // overloaded interface.
  const LooseIterator = Iterator as unknown as (
    props: IteratorLooseProps,
  ) => ReactNode
  const renderedList = (
    <LooseIterator {...pick(props, Iterator.RESERVED_PROPS)} />
  )

  if (!rootElement) return renderedList

  return (
    <Element ref={ref} {...omit(props, Iterator.RESERVED_PROPS)}>
      {renderedList}
    </Element>
  )
}

const name = `${PKG_NAME}/List` as const

Component.displayName = name
Component.pkgName = PKG_NAME
Component.VITUS_LABS__COMPONENT = name

// ---------------------------------------------------------------------------
// Public callable type — same overload pattern as Iterator so JSX-site
// inference flows through without callers having to spell out `<T>`.
// ---------------------------------------------------------------------------
/**
 * Ref slot — forwarded to the inner `<Element>` when `rootElement` is true,
 * a no-op otherwise. Typed loosely (`Ref<any>`) because the underlying
 * element type depends on the `tag` prop, which would require deeper
 * conditional typing to resolve precisely.
 */
type RefExtra = { ref?: Ref<any> }

export interface ListComponent {
  // T inferred from `data` — strict per-mode constraints, no loose fallback.
  // See Iterator's IteratorComponent for the same rationale.
  <T extends SimpleValue>(
    props: IteratorSimpleProps<T> & ListExtras & RefExtra,
  ): ReactNode
  <T extends ObjectValue>(
    props: IteratorObjectProps<T> & ListExtras & RefExtra,
  ): ReactNode
  (props: IteratorChildrenProps & ListExtras & RefExtra): ReactNode
  displayName?: string
  pkgName?: string
  VITUS_LABS__COMPONENT?: string
}

export default Component as unknown as ListComponent
