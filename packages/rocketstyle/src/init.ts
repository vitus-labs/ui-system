import styleComponent from './rocketstyle'

const defaultDimensions = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: ['multiple', { multi: true }]
}

const rocketstyle = ({
  dimensions = defaultDimensions,
  useBooleans = true
} = {}) => ({ name, component }) => {
  // if (!name) {
  //   throw Error('Component name is missing in params')
  // }
  if (!component) {
    throw Error('Rendered component is missing in params')
  }

  return styleComponent({
    name,
    component,
    useBooleans,
    dimensions,
    dimensionKeys: Object.keys(dimensions),
    dimensionValues: Object.values(dimensions).map(item => {
      if (Array.isArray(item)) return item[0]
      return item
    })
  })
}

export default rocketstyle
