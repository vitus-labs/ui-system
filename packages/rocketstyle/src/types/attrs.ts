import { renderContent } from '@vitus-labs/core'
import { ThemeModeKeys } from './theme'

export type AttrsCb<A, T> = (
  props: Partial<A>,
  theme: T,
  helpers: {
    mode?: ThemeModeKeys
    isDark?: boolean
    isLight?: boolean
    createElement: typeof renderContent
  }
) => Partial<A>
