import text from '../../Text'

export default text
  .config({
    name: 'Card.Subtitle',
  })
  .theme((t) => ({
    color: t.color.gray600,
    fontWeight: t.fontWeight.base,
    fontSize: t.fontSize.base,
    marginBottom: t.spacing.sm,
    marginTop: t.spacing.xsm * -1,
  }))
