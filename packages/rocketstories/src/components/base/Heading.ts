/**
 * Heading component built on the base element. Renders as an h1 tag
 * and provides two size variants: level1 (20px) and level2 (16px).
 * Used for labeling dimension items and pseudo-state groups in stories.
 */
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
