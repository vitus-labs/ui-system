import { rgba } from 'polished'
import { text } from '../base'

const styles = (css) => css`
  &:last-child {
    margin-bottom: 0;
  }
`

const createState = (color) => ({ color })

const textAlign = (textAlign) => ({
  textAlign,
})

const fontWeight = (fontWeight) => ({
  fontWeight,
})

const textTransform = (textTransform) => ({
  textTransform,
})

const textDecoration = (textDecoration) => ({
  textDecoration,
})

export default text
  .config({
    name: 'bootstrap-4/Text',
  })
  .styles(styles)
  .theme((t) => ({
    marginBottom: t.spacing.lg,
    marginTop: t.spacing.reset,
    color: 'inherit',
  }))
  .states((t) => ({
    primary: createState(t.color.primary),
    secondary: createState(t.color.secondary),
    success: createState(t.color.success),
    danger: createState(t.color.danger),
    warning: createState(t.color.warning),
    info: createState(t.color.info),
    light: createState(t.color.light),
    dark: createState(t.color.dark),
    muted: createState(t.color.gray600),
    white: createState(t.color.white),
    black50: createState(rgba(t.color.black, 0.5)),
    white50: createState(rgba(t.color.white, 0.5)),
    reset: createState('inherit'),
  }))
  .variants((t, css) => ({
    lead: {
      fontSize: t.fontSize.lg,
      fontWeight: t.fontWeight.light,
    },
    highlight: {
      paddingX: '0.2em',
      paddingY: '0.2em',
      bgColor: '#fcf8e3',
    },
    small: {
      fontSize: '80%',
      fontWeight: t.fontWeight.base,
    },
    abbr: {
      textDecoration: 'underline dotted',
      extendCss: css`
        cursor: help;
        border-bottom: 0;
      `,
    },
  }))
  .multiple((t, css) => ({
    inline: null,

    left: textAlign('left'),
    centered: textAlign('center'),
    right: textAlign('right'),
    justified: textAlign('justify'),

    bold: fontWeight(t.fontWeight.bold),
    strong: fontWeight(t.fontWeight.bolder),
    normal: fontWeight(t.fontWeight.base),
    thin: fontWeight(t.fontWeight.light),
    thinner: fontWeight(t.fontWeight.thin),

    lowercase: textTransform('lowercase'),
    uppercase: textTransform('uppercase'),
    capitalize: textTransform('capitalize'),

    deleted: textDecoration('line-through'),
    replaced: textDecoration('line-through'),
    inserted: textDecoration('underline'),
    underlined: textDecoration('underline'),

    wrap: { whiteSpace: 'normal' },
    noWrap: { whiteSpace: 'nowrap' },
    break: {
      extendCss: css`
        word-break: break-word !important;
        overflow-wrap: break-word !important;
      `,
    },

    truncate: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      extendCss: css`
        text-overflow: ellipsis;
      `,
    },

    italic: {
      fontStyle: 'italic',
    },

    monospace: {
      fontFamily: t.fontFamily.monospace,
    },
  }))
