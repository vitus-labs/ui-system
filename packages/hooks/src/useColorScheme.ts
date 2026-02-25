import useMediaQuery from './useMediaQuery'

export type UseColorScheme = () => 'light' | 'dark'

/**
 * Returns the user's preferred color scheme (`"light"` or `"dark"`).
 * Reacts to OS-level preference changes in real time.
 * Pairs with rocketstyle's `mode` system.
 */
const useColorScheme: UseColorScheme = () => {
  const dark = useMediaQuery('(prefers-color-scheme: dark)')
  return dark ? 'dark' : 'light'
}

export default useColorScheme
