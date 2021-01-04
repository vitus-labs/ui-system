import { element } from '../../base'

export default element
  .attrs<{ htmlFor?: string; name?: string }>({
    tag: 'label',
  })
  .theme({
    width: 20,
    height: 20,
  })
