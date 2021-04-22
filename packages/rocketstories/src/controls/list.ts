export default {
  rootElement: {
    type: 'boolean',
    group: 'List',
    valueType: 'boolean | object | array',
    description:
      'Whether a `root` element should be rendered or the output should be just a type of React `Fragment`',
  },
  data: {
    type: 'array',
    group: 'List',
    valueType: 'string[] | number[] | object[]',
    description: 'An array of item values to be passed to item component',
  },
  valueName: {
    type: 'text',
    group: 'List',
    valueType: `string[] | number[] | object[]`,
    description:
      'Can be used when `data` consists of `strings` or `numbers` to name value being passed as a prop',
  },
  itemProps: {
    group: 'List',
    valueType: `object | callack`,
    description:
      'A customizable hook for dynamically render props for each `item` component',
  },
  wrapProps: {
    group: 'List',
    valueType: `object | callack`,
    description:
      'A customizable hook for dynamically render props for each `wrapComponent`',
  },
  itemKey: {
    group: 'List',
    valueType: `string | callack`,
    description:
      "Prop for defining item key `name` / `value` if default behavior doesn't work out",
  },
  label: {
    disable: true,
  },
  content: {
    disable: true,
  },
  component: {
    group: 'List',
    valueType: `ComponentType`,
    description: 'A component to be rendered per item',
  },
  wrapComponent: {
    group: 'List',
    valueType: `string[] | number[] | object[]`,
    description:
      'A component to be used as a wrapper component for item component',
  },
} as const
