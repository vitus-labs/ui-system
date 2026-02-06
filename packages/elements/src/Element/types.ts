import type { HTMLTags } from '@vitus-labs/core'
import type {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react'
import type {
  AlignX,
  AlignY,
  Content,
  Direction,
  ExtendCss,
  InnerRef,
  Responsive,
  ResponsiveBoolType,
  VLStatic,
} from '~/types'

export type Props = Partial<{
  /**
   * Valid HTML Tag
   */
  tag: HTMLTags

  /**
   * React `ref`, the prop is alternative to `ref` prop without need to wrap component to `forwardRef`
   */
  innerRef: InnerRef

  /**
   * Valid React `children`
   */
  children: Content

  /**
   * Alternative prop to React `children`
   * It is recommended to pass only one of `children`, `content` or `label` props
   *
   * The prioritization of rendering is following: `children` → `content` → `label`
   */
  content: Content

  /**
   * Alternative prop to React `children`
   * It is recommended to pass only one of `children`, `content` or `label` props
   *
   * The prioritization of rendering is following: `children` → `content` → `label`
   */
  label: Content

  /**
   * Valid React `children` to be rendered inside _beforeContent_ wrapper
   *
   * In a case, where at least one of `beforeContent` or `afterContent` is defined,
   * **Element** component will render additional inner wrapper helpers to
   * attach `beforeContent` **before** any of `children`, `context` or `label`
   * props.
   *
   * Together with prop `direction` can be the **Element** component aligned
   * vertically or horizontally.
   *
   * To attach any react node _after_, use `afterContent`
   */
  beforeContent: Content

  /**
   * Valid React `children` to be rendered inside _afterContent_ wrapper
   *
   * In a case, where at least one of `beforeContent` or `afterContent` is defined,
   * **Element** component will render additional inner wrapper helpers to
   * attach `afterContent` **after** any of `children`, `context` or `label`
   * props.
   *
   * Together with prop `direction` can be the **Element** component aligned
   * vertically or horizontally.
   *
   * To attach any react node _before_, use `beforeContent`
   */
  afterContent: Content

  /**
   * A boolean type to define whether **Element** should behave
   * as an inline or block element (`flex` vs. `inline-flex`)
   */
  block: ResponsiveBoolType

  /**
   * A boolean type to define whether inner wrappers should be equal
   * (have the same width or height)
   */
  equalCols: ResponsiveBoolType

  /**
   * Defines a `gap` spacing between inner wrappers between `beforeContent` and `children`
   * and `children` and `afterContent`
   */
  gap: Responsive

  /**
   * Defines a `gap` spacing between inner wrappers between `beforeContent`,
   * `children` and `afterContent`
   */
  direction: Direction

  /**
   * Defines flow of `children` elements within it's inner wrapper.
   *
   * Can be one of the following **flex** values `inline` | `rows` | `reverseInline` | `reverseRows`
   */
  contentDirection: Direction

  /**
   * Defines flow of `beforeContent` elements within it's inner wrapper.
   *
   * Can be one of the following **flex** values `inline` | `rows` | `reverseInline` | `reverseRows`
   */
  beforeContentDirection: Direction

  /**
   * Defines flow of `afterContent` elements within it's inner wrapper.
   *
   * Can be one of the following **flex** values `inline` | `rows` | `reverseInline` | `reverseRows`
   */
  afterContentDirection: Direction

  /**
   * Define alignment of `beforeContent`, `content`, and `afterContent`
   * with respect to root element **horizontally**.
   *
   * Can be one of the following **flex** values `left` | `center` | `right` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  alignX: AlignX

  /**
   * Defines how `content` children (`children`, `content` or `label` props)
   * are aligned within it's inner wrapper **horizontally**.
   *
   * Can be one of the following **flex** values `left` | `center` | `right` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  contentAlignX: AlignX

  /**
   * Defines how `beforeContent` children are aligned within it's inner wrapper **horizontally**.
   *
   * Can be one of the following **flex** values `left` | `center` | `right` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  beforeContentAlignX: AlignX

  /**
   * Defines how `afterContent` children are aligned within it's inner wrapper **horizontally**.
   *
   * Can be one of the following **flex** values `left` | `center` | `right` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  afterContentAlignX: AlignX

  /**
   * Define alignment of `beforeContent`, `content`, and `afterContent`
   * with respect to root element **vertically**.
   *
   * Can be one of the following **flex** values `top` | `center` | `bottom` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  alignY: AlignY

  /**
   * Defines how `content` children (`children`, `content` or `label` props)
   * are aligned within it's inner wrapper **vertically**.
   *
   * Can be one of the following **flex** values `top` | `center` | `bottom` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  contentAlignY: AlignY

  /**
   * Defines how `beforeContent` children are aligned within it's inner wrapper **vertically**.
   *
   * Can be one of the following **flex** values `top` | `center` | `bottom` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  beforeContentAlignY: AlignY

  /**
   * Defines how `afterContent` children are aligned within it's inner wrapper **vertically**.
   *
   * Can be one of the following **flex** values `top` | `center` | `bottom` | `spaceBetween` |
   * `spaceAround` | `block`
   */
  afterContentAlignY: AlignY

  /**
   * React `dangerouslySetInnerHTML` prop. For more details follow the link:
   *
   * https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
   */
  dangerouslySetInnerHTML: { __html: string }

  /**
   * An additional prop for extending styling of the **root** wrapper element
   *
   * #### [A] Template literals
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [B] String
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css="text-color: red;"
   *  />
   * )
   * ```
   *
   * #### [C] Css Function
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * import { css } from 'styled-components'
   *
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [D] Css Callback
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css => css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   */
  css: ExtendCss

  /**
   * An additional prop for extending styling of the **content** wrapper element
   *
   * #### [A] Template literals
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [B] String
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css="text-color: red;"
   *  />
   * )
   * ```
   *
   * #### [C] Css Function
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * import { css } from 'styled-components'
   *
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [D] Css Callback
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css => css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   */
  contentCss: ExtendCss

  /**
   * An additional prop for extending styling of the **beforeContent** wrapper element
   *
   * #### [A] Template literals
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [B] String
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css="text-color: red;"
   *  />
   * )
   * ```
   *
   * #### [C] Css Function
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * import { css } from 'styled-components'
   *
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [D] Css Callback
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css => css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   */
  beforeContentCss: ExtendCss

  /**
   * An additional prop for extending styling of the **afterContent** wrapper element
   *
   * #### [A] Template literals
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [B] String
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css="text-color: red;"
   *  />
   * )
   * ```
   *
   * #### [C] Css Function
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * import { css } from 'styled-components'
   *
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   *
   * #### [D] Css Callback
   *
   * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
   *
   * ```jsx
   * export default () => (
   *  <Element
   *    label="This is an element"
   *    css={css => css`
   *      text-color: red;
   *    `}
   *  />
   * )
   * ```
   */
  afterContentCss: ExtendCss
}>

export type VLElement<P extends Record<string, unknown> = {}> =
  ForwardRefExoticComponent<PropsWithoutRef<Props & P> & RefAttributes<any>> &
    VLStatic

// export type VLElement<P extends Record<string, unknown> = {}> = {
//   <T extends Record<string, unknown> = {}>(
//     props: Props & P & T & { ref?: ForwardedRef<any> },
//   ): ReactElement | null
// } & VLStatic
