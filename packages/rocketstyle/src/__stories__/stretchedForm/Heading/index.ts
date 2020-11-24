import text from '../Text'

const createSize = (fontSize, fontWeight) => ({
  fontSize,
  fontWeight,
})

export default text
  .config({ name: 'base/Heading' })
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
    h3: createSize(t.fontSize.base, t.fontWeight.semibold),
  }))
