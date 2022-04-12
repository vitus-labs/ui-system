import element from './element'

export default element.attrs({ tag: 'h1', block: true }).sizes({
  level1: {
    fontSize: 20,
  },
  level2: {
    marginTop: 0,
    fontSize: 16,
  },
})
