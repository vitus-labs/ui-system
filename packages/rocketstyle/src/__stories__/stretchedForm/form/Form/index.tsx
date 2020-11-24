import { element } from '../../base'

export default element
  .config({
    name: 'base/form/Form',
  })
  .attrs({
    tag: 'form',
    block: true,
    contentDirection: 'rows',
    noValidate: true,
  })
