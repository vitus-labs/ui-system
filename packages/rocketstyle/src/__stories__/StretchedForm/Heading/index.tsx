import text from '../Text'

export default text
  .config({ name: 'StretchedForm/Heading' })
  .attrs({ tag: 'h1' })
  .theme((t) => ({
    marginBottom: t.spacing.sm,
    fontWeight: t.fontWeight.base,
    fontSize: t.fontSize.xxxl,
    lineHeight: t.lineHeight.sm,
  }))
  .sizes((t) => ({
    h1: {
      fontSize: {
        xs: t.fontSize.xl,
        md: t.fontSize.xxxl,
      },
    },
    h2: {
      fontSize: {
        xs: t.fontSize.lg,
        md: t.fontSize.xl,
      },
    },
    h3: {
      fontSize: t.fontSize.base,
      fontWeight: t.fontWeight.semibold,
    },
  }))
