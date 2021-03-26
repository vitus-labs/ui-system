import text from '../Text'

export const createSize = fontSize => ({
  fontSize
})

export const createDisplaySize = (fontSize, fontWeight) => ({
  fontSize,
  fontWeight
})

export default text
  .config({
    name: 'bootstrap-4/Heading'
  })
  .attrs({ tag: 'h1' })
  .theme(t => ({
    marginBottom: t.spacing.sm,
    lineHeight: 1.2,
    color: 'inherit',
    fontSize: t.fontSize.base * 2.5,
    fontWeight: t.fontWeight.medium
  }))
  .sizes(t => ({
    h1: createSize(t.fontSize.base * 2.5),
    h2: createSize(t.fontSize.base * 2),
    h3: createSize(t.fontSize.base * 1.75),
    h4: createSize(t.fontSize.base * 1.5),
    h5: createSize(t.fontSize.base * 1.25),
    h6: createSize(t.fontSize.base),
    display1: createDisplaySize(t.fontSize.base * 6, t.fontWeight.light),
    display2: createDisplaySize(t.fontSize.base * 5.5, t.fontWeight.light),
    display3: createDisplaySize(t.fontSize.base * 4.5, t.fontWeight.light),
    display4: createDisplaySize(t.fontSize.base * 3.5, t.fontWeight.light)
  }))
