import { config } from '@vitus-labs/core'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StylesDefault {}

export type Css = typeof config.css
export type Style = ReturnType<Css>
export type OptionStyles = Array<(css: Css) => ReturnType<Css>>

export type StylesCb = (css: Css) => ReturnType<Css>
export type StylesCbArray = Array<StylesCb>

export type Styles = <T>({
  theme,
  rootSize,
  css,
}: {
  theme: T
  rootSize: number
  css: Css
}) => typeof css
