import { htmlTags } from '@vitus-labs/core'

const DIRECTION = {
  type: 'select',
  options: ['-----', 'rows', 'inline', 'reverseInline', 'reverseRows'],
  value: 'inline',
  group: 'Element',
  valueType: 'inline | rows | reverseRows | reverseInline | object | array',
}

const ALIGN_X = {
  type: 'select',
  options: [
    '-----',
    'left',
    'center',
    'right',
    'block',
    'spaceBetween',
    'spaceAround',
  ],
  group: 'Element',
  value: 'left',
  valueType: 'left | center | right | block | spaceBetween | spaceAround',
}

const ALIGN_Y = {
  type: 'select',
  options: ['top', 'center', 'block', 'spaceBetween', 'spaceAround'],
  value: 'center',
  group: 'Element',
  valueType: 'top | center | block | spaceBetween | spaceAround',
}

const CSS = {
  type: 'text',
  group: 'Element',
  valueType: 'string | callback | css | object | array',
}

export default {
  tag: {
    type: 'select',
    options: htmlTags,
    group: 'Element',
    valueType: 'HTMLTag',
    description: 'A prop which will change HTML tag of the element',
  },
  children: {
    description: 'React children',
    group: 'Element',
    valueType: 'ReactNode',
  },
  content: {
    type: 'text',
    valueType: 'ReactNode',
    group: 'Element',
    description: 'A prop which can be used instead of `children`',
  },
  label: {
    type: 'text',
    group: 'Element',
    valueType: 'ReactNode',
    description: 'A prop which can be used instead of `children`',
  },
  block: {
    type: 'boolean',
    group: 'Element',
    valueType: 'boolean | object | array',
    description: 'Whether should behave as `inline` or `block` element',
  },
  direction: {
    ...DIRECTION,
    value: '',
    description:
      'Define whether element should render horizontally or vertically. Does the same job as `vertical` prop and takes a precedence over that prop',
  },
  alignX: {
    ...ALIGN_X,
    description:
      'Define alignment of `beforeContent`, `content`, and `afterContent` with respect to root element',
  },
  alignY: {
    ...ALIGN_Y,
    description:
      'Define alignment of `beforeContent`, `content`, and `afterContent` with respect to the root element',
  },
  contentDirection: {
    ...DIRECTION,
    description:
      'Define whether children in content wrapper should be rendered in line or in rows',
  },
  contentAlignX: {
    ...ALIGN_X,
    description: 'Define how children in content wrapper should be aligned',
  },
  contentAlignY: {
    ...ALIGN_Y,
    description: 'Define how children in content wrapper should be aligned',
  },
  beforeContentDirection: {
    ...DIRECTION,
    description:
      'Define whether children in beforeContent wrapper should be rendered in line or in rows',
  },
  beforeContentAlignX: {
    ...ALIGN_X,
    description:
      'Define how children in beforeContent wrapper should be aligned',
  },
  beforeContentAlignY: {
    ...ALIGN_Y,
    description:
      'Define how children in beforeContent wrapper should be aligned',
  },
  afterContentDirection: {
    ...DIRECTION,
    description:
      'Define whether children in afterContent wrapper should be rendered in line or in rows',
  },
  afterContentAlignX: {
    ...ALIGN_X,
    description:
      'Define how children in afterContent wrapper should be aligned',
  },
  afterContentAlignY: {
    ...ALIGN_Y,
    description:
      'Define how children in afterContent wrapper should be aligned',
  },
  equalCols: {
    type: 'boolean',
    group: 'Element',
    valueType: 'boolean | object | array',
    description:
      'Whether should all inner elements have the same `width` / `height`',
  },
  gap: {
    type: 'number',
    group: 'Element',
    valueType: 'number | object | array',
    description:
      'Defines space between `beforeContent`, `content` and `afterContent`',
  },
  vertical: {
    type: 'boolean',
    group: 'Element',
    valueType: 'boolean | object | array',
    description:
      'Define whether element should render horizontally or vertically',
  },
  beforeContent: {
    group: 'Element',
    valueType: 'ReactNode',
    description: 'A children to be rendered inside `beforeContent` wrapper.',
  },
  afterContent: {
    group: 'Element',
    valueType: 'ReactNode',
    description: 'A children to be rendered inside `afterContent` wrapper.',
  },
  css: {
    ...CSS,
    description:
      'If you need to add an additional styling to the `root` element, you can do so by injecting styles using this property',
  },
  contentCss: {
    ...CSS,
    description:
      'If you need to add an additional styling to the `content` element, you can do so by injecting styles using this property.',
  },
  beforeContentCss: {
    ...CSS,
    description:
      'If you need to add an additional styling to the `beforeContent` element, you can do so by injecting styles using this property',
  },
  afterContentCss: {
    ...CSS,
    description:
      'If you need to add an additional styling to the `afterContent` element, you can do so by injecting styles using this property.',
  },
} as const
