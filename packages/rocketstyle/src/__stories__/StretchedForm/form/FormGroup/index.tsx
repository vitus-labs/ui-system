import { element } from '../../base'

export default element
  .config({ name: 'base/form/FormGroup' })
  .attrs({
    tag: 'div',
    contentDirection: 'rows',
    contentAlignX: 'block',
  })
  .theme((t) => ({
    marginBottom: t.spacing.lg,
  }))
