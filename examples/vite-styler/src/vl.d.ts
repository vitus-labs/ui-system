import type { styles } from '@vitus-labs/unistyle'

type Theme = Parameters<typeof styles>[0]['theme']
type ThemeWithPseudo = Theme & { hover?: Theme; focus?: Theme; active?: Theme }

declare module '@vitus-labs/rocketstyle' {
  interface StylesDefault extends ThemeWithPseudo {}
}
