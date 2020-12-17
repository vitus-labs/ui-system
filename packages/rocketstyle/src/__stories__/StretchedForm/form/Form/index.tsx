import { element } from '../../base'

export default element
  .config({
    name: 'base/form/Form',
  })
  .attrs<{ noValidate?: boolean }>({
    tag: 'form',
    block: true,
    contentDirection: 'rows',
    noValidate: true,
  })
