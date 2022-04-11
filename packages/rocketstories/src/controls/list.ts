const group = 'List (Vitus-Labs)'

export default {
  rootElement: {
    type: 'boolean',
    group,
    valueType: 'boolean',
    description:
      'Whether a **root** element should be rendered or the output should be just a type of React **Fragment**.',
  },
  data: {
    type: 'array',
    group,
    valueType: 'string[] | number[] | object[]',
    description: 'An array of item values to be passed to item component.',
  },
  valueName: {
    type: 'text',
    group,
    valueType: `string[] | number[] | object[]`,
    description:
      'Can be used when **data** consists of **strings** or **numbers** to name value being passed as a prop.',
  },
  itemProps: {
    group,
    valueType: `Record<string, any> | (props, meta) => Record<string,any>`,
    description:
      'A customizable hook for dynamically render props for each **item** component.',
  },
  wrapProps: {
    group,
    valueType: `object | callack`,
    description:
      'A customizable hook for dynamically render props for each **wrapComponent** when _wrapComponent_ is passed as well.',
  },
  itemKey: {
    group,
    valueType: `string | (props) => string`,
    description:
      "Prop for defining item key **name** / **value** if default behavior doesn't work out.",
  },
  label: {
    disable: true,
  },
  content: {
    disable: true,
  },
  component: {
    group,
    valueType: `ComponentType`,
    description: 'A component to be rendered per item',
  },
  wrapComponent: {
    group,
    valueType: `string[] | number[] | object[]`,
    description:
      'A component to be used as a wrapper component for each item component.',
  },
} as const
