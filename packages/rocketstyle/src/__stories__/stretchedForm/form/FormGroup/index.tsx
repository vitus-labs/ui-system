import { element } from '../../base'

export default element
  .config({ name: 'base/form/FormGroup' })
  .attrs({
    tag: 'div',
    contentDirection: 'rows',
    contentAlignX: 'stretch',
  })
  .theme((t) => ({
    marginBottom: t.spacing.lg,
  }))
