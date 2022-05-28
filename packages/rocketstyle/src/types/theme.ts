import { THEME_MODES } from '~/constants'
import type { Css } from './styles'
import type { MergeTypes } from './utils'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThemeDefault {}

export type Theme<T> = T extends unknown
  ? ThemeDefault
  : MergeTypes<[ThemeDefault, T]>

export type ThemeModeKeys = keyof typeof THEME_MODES

export interface ThemeModeCallback {
  <A = any, B = any>(light: A, dark: B): (mode: 'light' | 'dark') => A | B
  isMode: true
}

export type ThemeMode = <A = any, B = any>(light: A, dark: B) => A | B

export type ThemeCb<CSS, T> = (
  theme: T,
  mode: ThemeModeCallback,
  css: Css
) => Partial<CSS>
