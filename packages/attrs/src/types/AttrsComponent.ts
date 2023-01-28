/* eslint-disable @typescript-eslint/ban-types */
import type { ReactElement, ForwardedRef } from 'react'
import type { MergeTypes, ExtractProps } from '@vitus-labs/tools-types'
import type { TObj, ElementType } from './utils'
import type { ConfigAttrs } from './config'
import type { AttrsCb } from './attrs'
import type { ComposeParam } from './hoc'

export type InitAttrsComponent<C extends ElementType = ElementType> = (params: {
  name: string
  component: C
}) => AttrsComponent<
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  {},
  {},
  {}
>

export interface ExoticComponent<P = {}> {
  (props: P & { $attrsRef?: ForwardedRef<unknown> }): ReactElement<
    P & { $attrsRef?: ForwardedRef<unknown>; 'data-attrs': string }
  > | null
  readonly $$typeof: symbol
}

/**
 * @param OA   Origin component props params.
 * @param EA   Extended prop types
 * @param S    Defined statics
 * @param HOC  High-order components
 * @param DFP  Calculated final component props
 */
export interface AttrsComponent<
  // original component props
  // eslint-disable-next-line @typescript-eslint/ban-types
  OA extends TObj = {},
  // extended component props
  // eslint-disable-next-line @typescript-eslint/ban-types
  EA extends TObj = {},
  // statics
  S extends TObj = {},
  // hocs
  HOC extends TObj = {},
  // calculated final props
  DFP = MergeTypes<[OA, EA]>
> extends ExoticComponent<DFP> {
  // CONFIG chaining method
  // --------------------------------------------------------
  /**
   * A chaining method to define default component theme
   * @param param  _object_
   *
   * ### Examples
   *
   * #### Component name / displayName
   * ```tsx
   * const base = attrsComponent
   *  .config({
   *    name: 'Component name'
   *  })
   * ```
   *
   * #### Replace component by a new one
   * ```tsx
   * const base = attrsComponent
   *  .config({
   *    component: (props) => <div {...props} />
   *  })
   * ```
   *
   * #### Component as provider
   * ```tsx
   * const parent = attrsComponent
   *  .config({
   *    provider: true
   *  })
   * ```
   *
   * #### Component as consumer
   * ```tsx
   * const base = attrsComponent
   *  .config({
   *    consumer: ctx => ctx<typeof parent>(({ pseudo, state, ...rest }) => ({
   *      pseudo,
   *      state
   *    }))
   *  })
   * ```
   *
   * #### Inversed theme
   * A possibility to set individualy for each component to have `inversed` styles
   * when using dark / light theme modes
   * ```tsx
   * const base = attrsComponent
   *  .config({
   *    inversed: true
   *  })
   * ```
   *
   * #### Pass props to original component
   * A possibility to set individualy for each component props names to be passed
   * to `origin` component
   *
   * ```tsx
   * const base = attrsComponent
   *  .config({
   *    passProps: ['disabled', 'readOnly']
   *  })
   * ```
   */
  config: <NC extends ElementType | unknown = unknown>({
    name,
    component: NC,
    DEBUG,
  }: ConfigAttrs<NC>) => NC extends ElementType
    ? AttrsComponent<ExtractProps<NC>, EA, S, HOC>
    : AttrsComponent<OA, EA, S, HOC>

  // ATTRS chaining method
  // --------------------------------------------------------
  /**
   * A chaining method to define default component props
   * @param param  Can be either _object_ or a _callback_
   *
   * #### Examples
   *
   * ##### Object as a parameter
   * ```tsx
   * const base = attrsComponent
   * const newElement = base.attrs({
   *  propA: 'value',
   *  propB: 'value,
   * })
   * ```
   *
   * ##### Callback as a parameter
   * ```tsx
   * const base = attrsComponent
   * const newElement = base.attrs((props, theme, helpers) => ({
   * propA: props.disabled ? 'valueA' : 'valueB',
   * propB: 'value,
   *  }))
   *  ```
   */
  attrs: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ? Partial<MergeTypes<[DFP, P]>> | AttrsCb<MergeTypes<[DFP, P]>>
      : Partial<DFP> | AttrsCb<DFP>,
    config?: Partial<{ priority: boolean }>
  ) => P extends TObj
    ? AttrsComponent<OA, MergeTypes<[EA, P]>, S, HOC>
    : AttrsComponent<OA, EA, S, HOC>

  // COMPOSE chaining method
  // --------------------------------------------------------
  /**
   * A chaining method to define high-order components to wrap
   * the defined component
   * @param param object of key hoc function
   *
   * ### Examples
   *
   * #### Define new hoc component
   * Using the `{ key: hoc }` annotation allows to override or remove
   * the defined hoc(s) later on. See the examples below.
   * ```tsx
   * const hoc = (WrappedComponent) => (props) => <WrappedComponent {...props} />
   * const base = attrsComponent
   *
   * const newElement = base.compose({ hocName: hoc })
   * ```
   *
   * #### Remove previously defined hoc component
   * (1) Set value to be `false`
   * ```tsx
   * const newElement = base.compose({ hocName: false })
   * ```
   * (2) Set value to be `null`
   * ```tsx
   * const newElement = base.compose({ hocName: null })
   * ```
   * (3) Set value to be `undefined`
   * ```tsx
   * const newElement = base.compose({ hocName: undefined })
   * ```
   */
  compose: <P extends ComposeParam>(
    param: P
  ) => P extends TObj
    ? AttrsComponent<OA, EA, S, MergeTypes<[HOC, P]>>
    : AttrsComponent<OA, EA, S, HOC>

  // STATICS chaining method + its output + other statics
  // --------------------------------------------------------
  /**
   * A chaining method to define statics on the attrs component.
   * All statics are accessible via `is` static key on the component.
   * @param param object of statics
   *
   * ### Examples
   *
   * #### Define new static
   * Using the `{ key: value }` annotation allows to override or remove
   * the defined static(s) later on. See the examples below.
   * ```tsx
   * const base = attrsComponent
   *
   * const newElement = base.statics({
   * isNewStatic: true,
   * arrayStatic: ['a', 'b'],
   * functionStatic: (param) => { ...do something }
   * })
   * ```
   *
   * #### Override previously defined hoc component
   * (1) Set value to be `false`
   * ```tsx
   * const newElement = base.statics({ isNewStatic: false })
   * ```
   * (2) Set value to be `null`
   * ```tsx
   * const newElement = base.statics({ isNewStatic: null })
   * ```
   * (3) Set value to be `undefined`
   * ```tsx
   * const newElement = base.statics({ isNewStatic: undefined })
   * ```
   */
  statics: <P extends TObj | unknown = unknown>(
    param: P
  ) => P extends TObj
    ? AttrsComponent<OA, EA, MergeTypes<[S, P]>, HOC>
    : AttrsComponent<OA, EA, S, HOC>

  /**
   * An access to all defined statics on the component.
   *
   * ### Examples
   *
   * #### Access a static property
   * ```tsx
   * const element = attrsComponent.statics({
   * isNewStatic: true,
   * arrayStatic: ['a', 'b'],
   * functionStatic: (param) => { ...do something }
   * })
   *
   * // staticValue = true
   * const staticValue = element.meta.isNewStatic
   * ```
   */
  meta: S

  getDefaultAttrs: (props: TObj) => TObj

  /**
   * Accessible via types only!
   *
   * Provides defined original props types (props of origin
   * component passed to _attrs_)
   *
   * ### Examples
   * ```tsx
   * const element = attrsComponent
   *
   * type Props = typeof element['$$originProps']
   *
   * ```
   */
  readonly $$originTypes: OA
  /**
   * Accessible via types only!
   *
   * Provides defined extended props types (props types defined
   * on `.attrs()` chaining method
   * component passed to _attrs_)
   *
   * ### Examples
   * ```tsx
   * const element = attrsComponent
   *  .attrs<{ propName: string }>({})
   *
   * type Props = typeof element['$$extendedProps']
   *
   * ```
   */
  readonly $$extendedTypes: EA
  /**
   * Accessible via types only!
   *
   * Provides all defined props types (including **origin**
   * props types & **extended** props types all together)
   *
   * ### Examples
   * ```tsx
   * const element = attrsComponent
   *
   * type Props = typeof element['$$allProps']
   *
   * ```
   */
  readonly $$types: DFP
  /**
   * Static Attrs component identificator
   */
  IS_ATTRS: true
  /**
   * Component displayName defined in `.config()` chaining
   * method
   *
   * ```tsx
   * const element = attrsComponent
   *  .config({
   *    name: 'ComponentName'
   *  })
   * ```
   */
  displayName: string
}
