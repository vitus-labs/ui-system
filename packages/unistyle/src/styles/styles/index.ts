import { borderRadius, edge } from '~/styles/shorthands'
import type { Css } from '~/types'
import { values } from '~/units'
import processDescriptor from './processDescriptor'
import propertyMap from './propertyMap'
import type { InnerTheme, Theme } from './types'

export type { Theme as StylesTheme }

export type Styles = ({
  theme,
  css,
  rootSize,
}: {
  theme: InnerTheme
  css: Css
  rootSize?: number
}) => ReturnType<typeof css>

const styles: Styles = ({ theme: t, css, rootSize }) => {
  const calc = (...params: any[]) => values(params, rootSize)
  const shorthand = edge(rootSize)
  const borderRadiusFn = borderRadius(rootSize)

  const fragments = propertyMap.map((d) =>
    processDescriptor(d, t, css, calc, shorthand, borderRadiusFn),
  )

  return css`
    ${fragments}
  `
}

export default styles
