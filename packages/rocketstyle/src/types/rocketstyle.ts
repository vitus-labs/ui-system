/* eslint-disable @typescript-eslint/ban-types */
import type { ForwardRefExoticComponent } from 'react'
import type { TObj, ElementType, MergeTypes, ExtractProps } from './utils'
import type {
  Dimensions,
  DimensionValue,
  DimensionCallbackParam,
  ExtractDimensionProps,
  TDKP,
  DimensionProps,
  ExtractDimensions,
  MultiKeys,
} from './dimensions'
import type { StylesCb, Styles } from './styles'
import type { ConfigAttrs } from './config'
import type { AttrsCb } from './attrs'
import type { Theme, ThemeCb, ThemeModeKeys } from './theme'
import type { ComposeParam } from './hoc'
import type { DefaultProps } from './configuration'

export type RocketStyleComponent<
  OA extends TObj = {},
  EA extends TObj = {},
  T extends TObj = {},
  CSS extends TObj = {},
  S extends TObj = {},
  HOC extends TObj = {},
  D extends Dimensions = Dimensions,
  UB extends boolean = boolean,
  DKP extends TDKP = TDKP
> = IRocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP> & {
  [I in keyof D]: <
    K extends DimensionValue = D[I],
    P extends DimensionCallbackParam<
      Theme<T>,
      Styles<CSS>
    > = DimensionCallbackParam<Theme<T>, Styles<CSS>>
  >(
    param: P
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  OA extends TObj = {},
  // extended component props
  // eslint-disable-next-line @typescript-eslint/ban-types
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
  DFP = MergeTypes<[OA, EA, DefaultProps, ExtractDimensionProps<D, DKP, UB>]>
> extends ForwardRefExoticComponent<DFP> {
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
  attrs: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ? Partial<MergeTypes<[DFP, P]>> | AttrsCb<MergeTypes<[DFP, P]>, Theme<T>>
      : Partial<DFP> | AttrsCb<DFP, Theme<T>>
  ) => P extends TObj
    ? RocketStyleComponent<OA, MergeTypes<[EA, P]>, T, CSS, S, HOC, D, UB, DKP>
    : RocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

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
  theme: <P extends TObj | unknown = unknown>(
    param: P extends TObj
      ?
          | Partial<MergeTypes<[Styles<CSS>, P]>>
          | ThemeCb<MergeTypes<[Styles<CSS>, P]>, Theme<T>>
      : Partial<Styles<CSS>> | ThemeCb<Styles<CSS>, Theme<T>>
  ) => P extends TObj
    ? RocketStyleComponent<OA, EA, T, MergeTypes<[CSS, P]>, S, HOC, D, UB, DKP>
    : RocketStyleComponent<OA, EA, T, CSS, S, HOC, D, UB, DKP>

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
    param: StylesCb
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
    param: P
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
  statics: <P extends TObj>(
    param: P
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
   * const staticValue = element.is.isNewStatic
   * ```
   */
  is: S

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
  readonly $$originProps: OA
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
  readonly $$extendedProps: EA
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
  readonly $$allProps: DFP
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
