import type { BorderRadius } from '~/styles/shorthands/borderRadius'
import type { Edge } from '~/styles/shorthands/edge'
import type { Css } from '~/types'
import type { Values } from '~/units/values'
import type { PropertyDescriptor } from './propertyMap'
import type { InnerTheme } from './types'

type Calc = (...params: any[]) => ReturnType<Values>

const processDescriptor = (
  d: PropertyDescriptor,
  t: InnerTheme,
  css: Css,
  calc: Calc,
  shorthand: ReturnType<Edge>,
  borderRadiusFn: ReturnType<BorderRadius>,
): string | ReturnType<typeof css> => {
  switch (d.kind) {
    case 'simple': {
      const v = t[d.key]
      if (v == null) return ''
      return `${d.css}: ${v};`
    }

    case 'convert': {
      const v = calc(t[d.key])
      if (v == null) return ''
      return `${d.css}: ${v};`
    }

    case 'convert_fallback': {
      const v = calc(...d.keys.map((k) => t[k]))
      if (v == null) return ''
      return `${d.css}: ${v};`
    }

    case 'edge':
      return (
        shorthand(d.property, {
          full: t[d.keys.full],
          x: t[d.keys.x],
          y: t[d.keys.y],
          top: t[d.keys.top],
          left: t[d.keys.left],
          bottom: t[d.keys.bottom],
          right: t[d.keys.right],
        }) ?? ''
      )

    case 'border_radius':
      return (
        borderRadiusFn({
          full: t[d.keys.full],
          top: t[d.keys.top],
          bottom: t[d.keys.bottom],
          left: t[d.keys.left],
          right: t[d.keys.right],
          topLeft: t[d.keys.topLeft],
          topRight: t[d.keys.topRight],
          bottomLeft: t[d.keys.bottomLeft],
          bottomRight: t[d.keys.bottomRight],
        }) ?? ''
      )

    case 'special':
      switch (d.id) {
        case 'fullScreen':
          if (!t.fullScreen) return ''
          return css`
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          `

        case 'backgroundImage':
          if (!t.backgroundImage) return ''
          return css`
            background-image: url(${t.backgroundImage});
          `

        case 'animation': {
          if (t.keyframe == null && t.animation == null) return ''
          const parts = [t.keyframe, t.animation].filter(Boolean).join(' ')
          if (!parts) return ''
          return `animation: ${parts};`
        }

        case 'hideEmpty':
          if (!(__WEB__ && t.hideEmpty)) return ''
          return css`
            &:empty {
              display: none;
            }
          `

        case 'clearFix':
          if (!(__WEB__ && t.clearFix)) return ''
          return css`
            &::after {
              clear: both;
              content: '';
              display: table;
            }
          `

        case 'extendCss':
          return t.extendCss ?? ''

        default:
          return ''
      }
  }
}

export default processDescriptor
