import { padding } from 'polished'
import { utility } from '../../base'

const bgColor = (bgColor) => ({ bgColor })
const color = (color) => ({ color })
const position = (position) => ({ position })
const display = (display) => ({ display })
const flexDirection = (flexDirection) => ({ flexDirection })
const justifyContent = (justifyContent) => ({ justifyContent })
const visibility = (visibility) => ({ visibility })
const overflow = (overflow, axis) => {
  if (!axis) return { overflow }
  else if (axis === 'x') return { overflowX: overflow }
  else if (axis === 'y') return { overflowY: overflow }
}
const float = (float) => ({ float })
const verticalAlign = (verticalAlign) => ({ verticalAlign })
const width = (width) => ({ width: `${width}%` })
const height = (height) => ({ height: `${height}%` })

const spacingGenerator = (attrs, sides, constants, spacer) => {
  const result = {}
  attrs.map((attr) => {
    sides.map((side) => {
      constants.map((constant, i) => {
        let name
        if (side === null) name = `${attr}`
        else name = `${attr}${side}`

        result[`${name}${i}`] = {
          [name]: constant === 'auto' ? 'auto' : `${spacer * constant}rem`,
        }
      })
    })
  })

  return result
}

const border = (value, top, right, bottom, left) => {
  const result = {}
  if (top) result.borderTop = value
  if (right) result.borderRight = value
  if (bottom) result.borderBottom = value
  if (left) result.borderLeft = value

  return result
}

const borderColor = (borderColor) => ({
  borderColor,
})

const borderRadius = (
  value = 0.25,
  topLeft,
  topRight,
  bottomRight,
  bottomLeft
) => {
  const result = {}
  if (topLeft) result.borderRadiusTL = value
  if (topRight) result.borderRadiusTR = value
  if (bottomRight) result.borderRadiusBR = value
  if (bottomLeft) result.borderRadiusBL = value

  return result
}

export default utility
  .config({ name: 'Utility.Box' })
  .theme({
    borderStyle: 'solid',
  })
  .multiple((t, css) => ({
    // position
    absolute: position('absolute'),
    relative: position('relative'),
    static: position('static'),
    fixed: position('fixed'),
    sticky: position('sticky'),
    fixedTop: {
      positionExtendCss: css`
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 1030;
      `,
    },
    fixedBottom: {
      positionExtendCss: css`
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1030;
      `,
    },
    stickyTop: {
      positionExtendCss: css`
        @supports (position: sticky) {
          position: sticky;
          top: 0;
          z-index: $zindex-sticky;
        }
      `,
    },

    // display
    hidden: display('none'),
    inline: display('inline'),
    inlineBlock: display('inline-block'),
    block: display('block'),
    table: display('table'),
    tableCell: display('table-cell'),
    tableRow: display('table-row'),
    flex: display('flex'),
    inlineFlex: display('inline-flex'),

    // visibility
    visible: visibility('visible'),
    invisible: visibility('hidden'),

    //overflow
    overflow: overflow('visible'),
    noOverflow: overflow('hidden'),
    scroll: overflow('scroll'),

    overflowX: overflow('visible', 'x'),
    noOverflowX: overflow('hidden', 'x'),
    scrollX: overflow('scroll', 'x'),

    overflowY: overflow('visible', 'y'),
    noOverflowY: overflow('hidden', 'y'),
    scrollY: overflow('scroll', 'y'),

    // float
    noFloat: float('none'),
    left: float('left'),
    right: float('right'),

    // flex
    flexRow: flexDirection('row'),
    flexRowReverse: flexDirection('row-reverse'),
    flexColumn: flexDirection('column'),
    flexColumnReverse: flexDirection('column-reverse'),

    // justify content
    justifyContentStart: justifyContent('flex-start'),
    justifyContentEnd: justifyContent('flex-end'),
    justifyContentCenter: justifyContent('center'),
    justifyContentBetween: justifyContent('space-between'),
    justifyContentAround: justifyContent('space-around'),

    // vertical align
    baseline: verticalAlign('baseline'),
    top: verticalAlign('top'),
    middle: verticalAlign('middle'),
    bottom: verticalAlign('bottom'),
    textTop: verticalAlign('text-top'),
    textBottom: verticalAlign('text-bottom'),

    // width
    w25: width(25),
    w50: width(50),
    w75: width(75),
    w100: width(100),
    mw100: { maxWidth: 100 },
    vw100: { width: '100vw' },
    minVw100: { minWidth: '100vw' },

    // height
    h25: height(25),
    h50: height(50),
    h75: height(75),
    h100: height(100),
    mh100: { maxHeight: 100 },
    vh100: { height: '100vh' },
    minVh100: { minHeight: '100vh' },

    // margin & padding
    ...spacingGenerator(
      ['m', 'p'],
      [null, 't', 'b', 'l', 'r', 'x', 'y'],
      [0, 0.25, 0.5, 1, 1.5, 3],
      1
    ),

    //background
    bgPrimary: bgColor(t.color.primary),
    bgSecondary: bgColor(t.color.secondary),
    bgSuccess: bgColor(t.color.success),
    bgDanger: bgColor(t.color.danger),
    bgWarning: bgColor(t.color.warning),
    bgInfo: bgColor(t.color.info),
    bgLight: bgColor(t.color.light),
    bgDark: bgColor(t.color.dark),
    bgWhite: bgColor(t.color.white),
    bgTransparent: bgColor(t.color.transparent),

    textPrimary: color(t.color.primary),
    textSecondary: color(t.color.secondary),
    textSuccess: color(t.color.success),
    textDanger: color(t.color.danger),
    textWarning: color(t.color.warning),
    textInfo: color(t.color.info),
    textLight: color(t.color.light),
    textDark: color(t.color.dark),
    textWhite: color(t.color.white),

    // border
    border: border('1px', true, true, true, true),
    borderTop: border('1px', true, false, false, false),
    borderRight: border('1px', false, true, false, false),
    borderBottom: border('1px', false, false, true, false),
    borderLeft: border('1px', false, false, false, true),
    noBorder: border(null, false, false, false, false),
    noBorderTop: border(null, true, false, false, false),
    noBorderRight: border(null, false, true, false, false),
    noBorderBottom: border(null, false, false, true, false),
    noBorderLeft: border(null, false, false, false, true),

    borderPrimary: borderColor(t.color.primary),
    borderSecondary: borderColor(t.color.secondary),
    borderSuccess: borderColor(t.color.success),
    borderDanger: borderColor(t.color.danger),
    borderWarning: borderColor(t.color.warning),
    borderInfo: borderColor(t.color.info),
    borderLight: borderColor(t.color.light),
    borderDark: borderColor(t.color.dark),
    borderWhite: borderColor(t.color.white),
    borderTransparent: borderColor(t.color.transparent),

    rounded: borderRadius('0.25rem', true, true, true, true),
    roundedTop: borderRadius('0.25rem', true, true, false, false),
    roundedRight: borderRadius('0.25rem', false, true, true, false),
    roundedBottom: borderRadius('0.25rem', false, false, true, true),
    roundedLeft: borderRadius('0.25rem', true, false, false, true),
    roundedCircle: borderRadius('50%', true, true, true, true),
    noRounded: borderRadius(null, false, false, false, false),

    // clearfix
    clearfix: {
      extendCss: css`
        &::after {
          display: block;
          content: '';
          clear: both;
        }
      `,
    },

    //text hide
    textHide: {
      extendCss: css`
        font: 0/0 a;
        color: transparent;
        text-shadow: none;
        background-color: transparent;
        border: 0;
      `,
    },
  }))
  .styles(
    (css) => css`
      ${({ rocketstyle: t }) => {
        return css`
          && {
            position: ${t.position};
            display: ${t.display};
            flex-direction: ${t.flexDirection};
            justify-content: ${t.justifyContent};
            float: ${t.float};
            width: ${t.width};
            height: ${t.height};
            max-width: ${t.maxWidth};
            max-height: ${t.maxHeight};
            min-width: ${t.minWidth};
            min-height: ${t.minHeight};
            margin-top: ${t.mt || t.my || t.m};
            margin-bottom: ${t.mb || t.my || t.m};
            margin-left: ${t.ml || t.mx || t.m};
            margin-right: ${t.mr || t.mx || t.m};
            padding-top: ${t.pt || t.py || t.p};
            padding-bottom: ${t.pb || t.py || t.p};
            padding-left: ${t.pl || t.px || t.p};
            padding-right: ${t.pr || t.px || t.p};
            visibility: ${t.visibility};
            vertical-align: ${t.verticalAlign};
            overflow: ${t.overflow};
            overflow-x: ${t.overflowX};
            overflow-y: ${t.overflowY};
            background-color: ${t.bgColor};
            color: ${t.color};
            border-color: ${t.borderColor};

            & * {
              color: ${t.color} !important;
            }

            ${(t.borderTop ||
              t.borderRight ||
              t.borderBottom ||
              t.borderLeft) &&
            css`
              border-style: ${t.borderStyle};
              border-color: ${t.borderColor};
              border-top-width: ${t.borderTop};
              border-right-width: ${t.borderRight};
              border-bottom-width: ${t.borderBottom};
              border-left-width: ${t.borderLeft};
            `}

            border-top-left-radius: ${t.borderRadiusTL};
            border-top-right-radius: ${t.borderRadiusTR};
            border-bottom-left-radius: ${t.borderRadiusBL};
            border-bottom-right-radius: ${t.borderRadiusBR};

            ${t.positionExtendCss};
            ${t.extendCss};
          }
        `
      }}
    `
  )
