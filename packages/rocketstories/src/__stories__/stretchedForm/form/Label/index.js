import text from '../../Text'

export default text
  .config({ name: 'base/form/Label' })
  .attrs({ tag: 'label' })
  .theme(t => ({
    fontSize: t.fontSize.xs,
    color: t.color.gray800,
    marginBottom: t.spacing.xs
  }))
