import text from '../../Text'

const createState = color => ({ color })
const createSize = fontSize => ({ fontSize })

export default text
  .config({ name: 'base/form/FormText' })
  .attrs({ tag: 'label' })
  .theme(t => ({
    marginTop: t.spacing.xs,
    marginBottom: t.spacing.reset
  }))
  .sizes(t => ({
    default: createSize(t.fontSize.base)
  }))
  // TODO: add state colors
  .states({
    default: createState('#2b2b2b'),
    invalid: createState('red'),
    valid: createState('green')
  })
