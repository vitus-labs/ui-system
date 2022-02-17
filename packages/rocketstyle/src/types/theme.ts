import { THEME_MODES } from '~/constants/reservedKeys'
import type { Css } from './styles'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThemeDefault {}

export type ThemeModeKeys = keyof typeof THEME_MODES

export type ThemeMode = <A, B>(light: A, dark: B) => A | B

export type ThemeCb<CT, T> = (
  theme: T,
  mode: ThemeMode,
  css: Css
) => Partial<CT>
