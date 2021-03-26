import { text } from '../base'

const createSize = (fontSize, lineHeight) => ({
  fontSize,
  lineHeight,
})

const createState = (color) => ({ color })

const createVariantAlign = (textAlign) => ({ textAlign })

const createVariantWeight = (fontWeight) => ({ fontWeight })

const createVariantTransform = (textTransform) => ({ textTransform })

const createVariantDecoration = (textDecoration) => ({ textDecoration })

export default text
  .config({ name: 'base/Text' })
  .theme((t) => ({
    color: t.color.gray900,
    marginBottom: t.spacing.lg,
    fontWeight: t.fontWeight.base,
    fontSize: [t.fontSize.sm, t.fontSize.base, t.fontSize.sm, t.fontSize.base],
    lineHeight: [
      t.lineHeight.sm,
      t.lineHeight.base,
      t.lineHeight.sm,
      t.lineHeight.base,
    ],
  }))
  .sizes((t) => ({
    sm: createSize(t.fontSize.xs, t.lineHeight.sm),
    md: createSize(t.fontSize.sm, t.lineHeight.xl),
  }))
  .states((t) => ({
    light: createState(t.color.white),
    error: createState(t.color.danger),
  }))
  .multiple((t) => ({
    inline: {
      fontSize: 'inherit',
      marginBottom: t.spacing.reset,
      color: 'inherit',
      lineHeight: 'inherit',
    },

    left: createVariantAlign('left'),
    centered: createVariantAlign('center'),
    right: createVariantAlign('right'),
    justified: createVariantAlign('justify'),

    bold: createVariantWeight(t.fontWeight.bold),
    strong: createVariantWeight(t.fontWeight.bolder),
    normal: createVariantWeight(t.fontWeight.base),
    light: createVariantWeight(t.fontWeight.light),

    lowercase: createVariantTransform('lowercase'),
    uppercase: createVariantTransform('uppercase'),
    capitalize: createVariantTransform('capitalize'),

    deleted: createVariantDecoration('line-through'),
    replaced: createVariantDecoration('line-through'),
    inserted: createVariantDecoration('underline'),
    underlined: createVariantDecoration('underline'),

    italic: { fontStyle: 'italic' },
  }))
