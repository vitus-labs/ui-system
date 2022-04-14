const group = 'List (@vitus-labs)'

const itemPropsType = `Record<string, any> | (props, meta) => Record<string,any>`

export default {
  rootElement: {
    group,
    type: 'boolean',
    valueType: 'boolean',
    description:
      'Whether a **root** element should be rendered or the output should be just a type of React **Fragment**.',
  },
  data: {
    group,
    type: 'array',
    valueType: 'string[] | number[] | object[]',
    description:
      'An array of item values to be passed to item component. Data are being passed to _component_ prop element.',
  },
  valueName: {
    group,
    type: 'text',
    valueType: `string`,
    description:
      'Is required when **data** consists of **strings** or **numbers** to name value being passed as a prop.',
  },
  itemProps: {
    group,
    valueType: itemPropsType,
    description:
      'A customizable hook for dynamically render props for each **item** component.',
  },
  wrapProps: {
    group,
    valueType: itemPropsType,
    description:
      'A customizable hook for dynamically render props for each **wrapComponent** when _wrapComponent_ is passed, otherwise ignored.',
  },
  itemKey: {
    group,
    valueType: 'string | `(item, i) => number | string`',
    description:
      "Prop for defining item key in list. **name** / **value** if default behavior doesn't work out.",
  },
  component: {
    group,
    type: 'component',
    valueType: 'ComponentType',
    description:
      'A component to be rendered within the List per item. Receives props from _data_ array props.',
  },
  wrapComponent: {
    group,
    type: 'component',
    valueType: `ComponentType`,
    description:
      'A component to be used as a wrapper component for each item component.',
  },
  label: {
    disable: true,
  },
  content: {
    disable: true,
  },
} as const
