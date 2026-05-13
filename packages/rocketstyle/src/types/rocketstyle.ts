import type { ReactNode } from 'react'
import type { AttrsCb } from './attrs'
import type { ConfigAttrs } from './config'
import type { DefaultProps } from './configuration'
import type {
  DimensionCallbackParam,
  DimensionProps,
  Dimensions,
  DimensionValue,
  ExtractDimensionProps,
  ExtractDimensions,
  MultiKeys,
  TDKP,
} from './dimensions'
import type { ComposeParam } from './hoc'
import type { Styles, StylesCb } from './styles'
import type { Theme, ThemeCb, ThemeModeKeys } from './theme'
import type { ElementType, ExtractProps, MergeTypes, TObj } from './utils'

export type InnerComponentProps = {
  $rocketstyleRef?: any
  ref?: any
  'data-rocketstyle': string
}

export type RocketStyleComponent<
  OA extends TObj = {},
  EA extends TObj = {},
  T extends TObj = {},
  CSS extends TObj = {},
  S extends TObj = {},
  HOC extends TObj = {},
  D extends Dimensions = Dimensions,
  UB extends boolean = boolean,
  DKP extends TDKP = TDKP,
> = IRocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP> & {
  [I in keyof D]: <
    K extends DimensionValue = D[I],
    P extends DimensionCallbackParam<
      Theme<T>,
      Styles<CSS>
    > = DimensionCallbackParam<Theme<T>, Styles<CSS>>,
  >(
    param: P,
  ) => P extends DimensionCallbackParam<Theme<T>, Styles<CSS>>
    ? RocketStyleComponent<
        OA,
        EA,
        T,
        CSS,
        S,
        HOC,
        D,
        UB,
        DimensionProps<K, D, P, DKP>
      >
    : RocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>
}

/**
 * @param OA   Origin component props params.
 * @param EA   Extended prop types
 * @param T    Theme passed via context.
 * @param CSS  Custom theme accepted by styles.
 * @param S    Defined statics
 * @param D    Dimensions to be used for defining component states.
 * @param UB   Use booleans value
 * @param DKP  Dimensions key props.
 * @param DFP  Calculated final component props
 */
export interface IRocketStyleComponent<
  // original component props
  OA extends TObj = {},
  // extended component props
  EA extends TObj = {},
  // theme
  T extends TObj = {},
  // custom style properties
  CSS extends TObj = {},
  // statics
  S extends TObj = {},
  // hocs
  HOC extends TObj = {},
  // dimensions
  D extends Dimensions = Dimensions,
  // use booleans
  UB extends boolean = boolean,
  // dimension key props
  DKP extends TDKP = TDKP,
  // calculated final props
  //
  // `OA extends infer O` distributes over OA's union branches so a wrapper
  // around an overloaded component (`ExtractProps<typeof List>` is a
  // 3-branch union after the new ExtractProps) yields a discriminated DFP
  // union — one branch per overload.
  //
  // OA-overlapping EA keys (e.g. `.attrs({ tag: 'button' })` on a wrapper
  // whose OA has `tag: HTMLTags`) are stripped from OA and re-added as
  // `Partial<Pick<O, …>>` — taking O's WIDER type, not EA's narrow
  // literal. The runtime default is `'button'`; the JSX call site still
  // accepts any `HTMLTags` value (so `<Btn tag="a" />` is valid).
  // `Partial<Omit<EA, keyof O>>` handles net-new EA-only keys (no OA
  // conflict) and marks them optional too — every `.attrs()` value is
  // semantically a default, never required of the consumer.
  //
  // OA is intersected raw, NOT fed through MergeTypes — `?: never`
  // markers from overload branches (PR #222) must survive discrimination.
  DFP = OA extends infer O
    ? Omit<O, keyof EA & keyof O> &
        Partial<Pick<O, keyof EA & keyof O>> &
        MergeTypes<
          [
            Partial<Omit<EA, keyof O>>,
            DefaultProps,
            ExtractDimensionProps<D, DKP, UB>,
          ]
        >
    : never,
> {
  (props: DFP & { ref?: any }): ReactNode
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
   * const base = rocketstyleComponent
   *  .config({
   *    name: 'Component name'
   *  })
   * ```
   *
   * #### Replace component by a new one
   * ```tsx
   * const base = rocketstyleComponent
   *  .config({
   *    component: (props) => <div {...props} />
   *  })
   * ```
   *
   * #### Component as provider
   * ```tsx
   * const parent = rocketstyleComponent
   *  .config({
   *    provider: true
   *  })
   * ```
   *
   * #### Component as consumer
   * ```tsx
   * const base = rocketstyleComponent
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
   * const base = rocketstyleComponent
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
   * const base = rocketstyleComponent
   *  .config({
   *    passProps: ['disabled', 'readOnly']
   *  })
   * ```
   */
  config: <NC extends ElementType | unknown = unknown>({
    name,
    component: NC,
    provider,
    consumer,
    DEBUG,
    inversed,
    passProps,
  }: ConfigAttrs<NC, D, DKP, UB>) => NC extends ElementType
    ? RocketStyleComponent<ExtractProps<NC>, EA, T, CSS, S, HOC, D, UB, DKP>
    : RocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

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
   * const base = rocketstyleComponent
   * const newElement = base.attrs({
   *  propA: 'value',
   *  propB: 'value,
   * })
   * ```
   *
   * ##### Callback as a parameter
   * ```tsx
   * const base = rocketstyleComponent
   * const newElement = base.attrs((props, theme, helpers) => ({
   * propA: props.disabled ? 'valueA' : 'valueB',
   * propB: 'value,
   *  }))
   *  ```
   */
  // Two overloads. TS resolves in declaration order; the callback form
  // is listed first so a function argument matches it before falling
  // through to the object form.
  //
  // Both overloads use `NoInfer<DFP>` to prevent DFP from contributing
  // to P inference. P is only inferred from explicit `<P>` annotation
  // or from the object-form param's own keys. This keeps literals
  // narrow under contextual typing — `tag: 'ul'` stays `'ul'` instead of
  // widening to `string` (the cause of the pre-fix "needs `as const`"
  // friction in callback form).
  //
  // Object-form note: `P & Partial<NoInfer<DFP>>` accepts both new keys
  // (via P) and defaults for any existing DFP slot (via the partial),
  // and OA-overlapping keys make the corresponding OA slot optional at
  // the JSX call site via DFP widening.
  attrs: {
    <P extends TObj = {}>(
      param: AttrsCb<DFP & P, Theme<T>>,
      config?: Partial<{
        priority: boolean
        filter: (keyof MergeTypes<[EA, P]>)[]
      }>,
    ): RocketStyleComponent<OA, MergeTypes<[EA, P]>, T, CSS, S, HOC, D, UB, DKP>

    <P extends TObj = {}>(
      param: P & Partial<NoInfer<DFP>>,
      config?: Partial<{
        priority: boolean
        filter: (keyof MergeTypes<[EA, P]>)[]
      }>,
    ): RocketStyleComponent<OA, MergeTypes<[EA, P]>, T, CSS, S, HOC, D, UB, DKP>
  }

  // THEME chaining method
  // --------------------------------------------------------
  /**
   * A chaining method to define default component theme
   * @param param  Can be either _object_ or a _callback_
   *
   * ### Examples
   *
   * #### Object as a parameter
   * ```tsx
   * const base = rocketstyleComponent
   * const newElement = base.attrs({
   *  backgroundColor: 'black',
   * })
   * ```
   *
   * #### Callback as a parameter
   * ```tsx
   * const base = rocketstyleComponent
   * const newElement = base.theme((theme, css) => ({
   * backgroundColor: t.color.black, // value from context
   *  }))
   *```
   *
   * #### Dark / light theme callback
   * ```tsx
   * const base = rocketstyleComponent
   *
   * const newElement = base.theme((theme, mode, css) => ({
   * backgroundColor: mode(t.color.black, t.color.white), // theme from context
   * }))
   * ```
   */
  theme: <P extends TObj = {}>(
    param: Partial<P> | Partial<Styles<CSS>> | ThemeCb<P, Theme<T>>,
  ) => RocketStyleComponent<OA, EA, T, MergeTypes<[CSS, P]>, S, HOC, D, UB, DKP>

  // STYLES chaining method
  // --------------------------------------------------------
  /**
   * A chaining method to define default rendered styles
   * @param param  Callback of styled-components `css` function
   *
   * #### Examples
   *
   * ```tsx
   * const base = rocketstyleComponent
   *
   * const newElement = base.styles(css => css``)
   * ```
   */
  styles: (
    param: StylesCb<CSS>,
  ) => RocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

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
   * const base = rocketstyleComponent
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
    param: P,
  ) => P extends TObj
    ? RocketStyleComponent<OA, EA, T, CSS, S, MergeTypes<[HOC, P]>, D, UB, DKP>
    : RocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  // STATICS chaining method + its output + other statics
  // --------------------------------------------------------
  /**
   * A chaining method to define statics on the rocketstyle component.
   * All statics are accessible via `is` static key on the component.
   * @param param object of statics
   *
   * ### Examples
   *
   * #### Define new static
   * Using the `{ key: value }` annotation allows to override or remove
   * the defined static(s) later on. See the examples below.
   * ```tsx
   * const base = rocketstyleComponent
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
    param: P,
  ) => P extends TObj
    ? RocketStyleComponent<OA, EA, T, CSS, MergeTypes<[S, P]>, HOC, D, UB, DKP>
    : RocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

  /**
   * An access to all defined statics on the component.
   *
   * ### Examples
   *
   * #### Access a static property
   * ```tsx
   * const element = rocketcomponent.statics({
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

  getStaticDimensions: (theme: TObj) => {
    dimensions: DKP
    useBooleans: UB
    multiKeys: MultiKeys<D>
  }

  getDefaultAttrs: (props: TObj, theme: TObj, mode: ThemeModeKeys) => TObj

  /**
   * Accessible via types only!
   *
   * Provides defined rocketstyle dimensions and their options
   *
   * ### Examples
   * ```tsx
   * const element = rocketcomponent
   *
   * type Props = typeof element['$$rocketstyle']
   *
   * ```
   */
  readonly $$rocketstyle: ExtractDimensions<D, DKP>
  /**
   * Accessible via types only!
   *
   * Provides defined original props types (props of origin
   * component passed to _rocketstyle_)
   *
   * ### Examples
   * ```tsx
   * const element = rocketcomponent
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
   * component passed to _rocketstyle_)
   *
   * ### Examples
   * ```tsx
   * const element = rocketcomponent
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
   * props types, **extended** props types & **rocketstyle**
   * props types all together)
   *
   * ### Examples
   * ```tsx
   * const element = rocketcomponent
   *
   * type Props = typeof element['$$allProps']
   *
   * ```
   */
  readonly $$types: DFP
  /**
   * Static Rocketstyle component identificator
   */
  IS_ROCKETSTYLE: true
  /**
   * Component displayName defined in `.config()` chaining
   * method
   *
   * ```tsx
   * const element = rockestyleComponent
   *  .config({
   *    name: 'ComponentName'
   *  })
   * ```
   */
  displayName: string
}
