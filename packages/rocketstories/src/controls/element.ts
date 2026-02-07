/**
 * Default Storybook control definitions for Element-based components.
 * Covers layout props (direction, alignX, alignY), content slots
 * (beforeContent, afterContent), CSS extension props, and HTML tag selection.
 */
import { HTML_TAGS } from '@vitus-labs/core'

const group = 'Element (Vitus-Labs)'

const directionType = 'inline | rows | reverseRows | reverseInline'
const alignXType = 'left | center | right | block | spaceBetween | spaceAround'
const alignYType = 'top | center | block | spaceBetween | spaceAround'
const CssType = 'string | (css) => css`` | css``'

const DIRECTION = {
  group,
  type: 'select',
  options: ['-----', ...directionType.split(' | ')],
  value: 'rows',
  valueType: `${directionType} | Record<string, ${directionType}> | Array<${directionType}`,
}

const ALIGN_X = {
  group,
  type: 'select',
  options: alignXType.split(' | '),
  value: 'left',
  valueType: `${alignXType} | Record<string, ${alignXType}> | Array<${alignXType}`,
}

const ALIGN_Y = {
  group,
  type: 'select',
  options: alignYType.split(' | '),
  value: 'center',
  valueType: `${alignYType} | Record<string, ${alignYType}> | Array<${alignYType}`,
}

const CSS = {
  group,
  type: 'text',
  valueType: `${CssType} | Record<string,${CssType}> | Array<${CssType}>`,
}

export default {
  tag: {
    group,
    type: 'select',
    options: HTML_TAGS,
    valueType: 'HTMLTag',
    description: 'A prop which will change **HTML tag** of the element.',
  },
  children: {
    group,
    type: '',
    valueType: 'ReactNode',
    description:
      'React children. Priorities when rendering are **children** → **content** → **label**, therefore _children_ has the highest priority.',
  },
  content: {
    group,
    type: 'text',
    valueType: 'ReactNode',
    description:
      'A prop which can be used instead of _children_. Priorities when rendering are **children** → **content** → **label**, therefore _content_ has the middle priority.',
  },
  label: {
    group,
    type: 'text',
    valueType: 'ReactNode',
    description:
      'A prop which can be used instead of _children_. Priorities when rendering are **children** → **content** → **label**, therefore _label_ has the lowest priority.',
  },
  block: {
    group,
    type: 'boolean',
    valueType: 'boolean | Record<string, boolean> | Array<boolean>',
    description:
      'Defines whether should behave as **inline** or **block** element.',
  },
  direction: {
    ...DIRECTION,
    value: undefined,
    description:
      'Define whether element should render **horizontally** or **vertically**.',
  },
  alignX: {
    ...ALIGN_X,
    description:
      'Define alignment of **beforeContent**, **content**, and **afterContent** with respect to root element on **axis X**.',
  },
  alignY: {
    ...ALIGN_Y,
    description:
      'Define alignment of **beforeContent**, **content**, and **afterContent** with respect to the root element on **axis Y**.',
  },
  contentDirection: {
    ...DIRECTION,
    description:
      'Define whether the children in **content** wrapper should be rendered in _line_ or in _rows_.',
  },
  contentAlignX: {
    ...ALIGN_X,
    description:
      'Define how the children in **content** wrapper should be aligned on **axis X**.',
  },
  contentAlignY: {
    ...ALIGN_Y,
    description:
      'Define how the children in **content** wrapper should be aligned on **axis Y**.',
  },
  beforeContentDirection: {
    ...DIRECTION,
    description:
      'Define whether children in **beforeContent** wrapper should be rendered in _line_ or in _rows_.',
  },
  beforeContentAlignX: {
    ...ALIGN_X,
    description:
      'Define how children in **beforeContent** wrapper should be aligned on **axis X**.',
  },
  beforeContentAlignY: {
    ...ALIGN_Y,
    description:
      'Define how children in **beforeContent** wrapper should be aligned on **axis Y**.',
  },
  afterContentDirection: {
    ...DIRECTION,
    description:
      'Define whether children in **afterContent** wrapper should be rendered in _line_ or in _rows_.',
  },
  afterContentAlignX: {
    ...ALIGN_X,
    description:
      'Define how children in **afterContent** wrapper should be aligned on **axis X**.',
  },
  afterContentAlignY: {
    ...ALIGN_Y,
    description:
      'Define how children in **afterContent** wrapper should be aligned on **axis Y**.',
  },
  equalCols: {
    type: 'boolean',
    group,
    valueType: 'boolean | Record<string,boolean> | Array<boolean>',
    description:
      'Whether should all inner elements have the same `width` / `height`.',
  },
  gap: {
    type: 'number',
    group,
    valueType: 'number | Record<string,number> | Array<number>',
    description:
      'Defines space gap **between** _beforeContent_, _content_ and _afterContent_ if one of _beforeContent_ or _afterContent_ contain _children_ to be rendered.',
  },
  // vertical: {
  //   type: 'boolean',
  //   group,
  //   valueType: 'boolean | Record<string,boolean> | Array<boolean>',
  //   description:
  //     'Define whether element should render horizontally or vertically.',
  // },
  beforeContent: {
    group,
    type: '',
    valueType: 'ReactNode',
    description: 'A children to be rendered inside `beforeContent` wrapper.',
  },
  afterContent: {
    group,
    type: '',
    valueType: 'ReactNode',
    description: 'A children to be rendered inside `afterContent` wrapper.',
  },
  css: {
    ...CSS,
    description:
      'An additional styling prop to enhance the **root** element CSS styles.',
  },
  contentCss: {
    ...CSS,
    description:
      'An additional styling prop to enhance the **content** element CSS styles.',
  },
  beforeContentCss: {
    ...CSS,
    description:
      'An additional styling prop to enhance the **beforeContent** element CSS styles.',
  },
  afterContentCss: {
    ...CSS,
    description:
      'An additional styling prop to enhance the **afterContent** element CSS styles.',
  },
  ref: {
    group,
    description: 'A React ref',
    valueType: 'ForwardedRef<any>',
  },
  innerRef: {
    group,
    description: 'A React ref',
    valueType: 'ForwardedRef<any>',
  },
  dangerouslySetInnerHTML: {
    group,
    type: 'text',
    disable: true,
    valueType: 'any',
  },
}
