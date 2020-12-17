import text from '../../Text'

const createState = (color) => ({ color })
const createSize = (fontSize) => ({ fontSize })

export default text
  .config({ name: 'base/form/FormText' })
  .attrs({ tag: 'label' })
  .theme((t) => ({
    marginTop: t.spacing.xs,
    marginBottom: t.spacing.reset,
    ...createSize(t.fontSize.base),
    ...createState('#2b2b2b'),
  }))
  .states({
    invalid: createState('red'),
    valid: createState('green'),
  })
