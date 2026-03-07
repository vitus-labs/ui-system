import { useEffect, useState } from 'react'
import { Appearance } from 'react-native'

export type UseColorScheme = () => 'light' | 'dark'

/**
 * Returns the user's preferred color scheme (`"light"` or `"dark"`).
 * Uses React Native's `Appearance` API and subscribes to changes.
 */
const useColorScheme: UseColorScheme = () => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(
    () => Appearance.getColorScheme() ?? 'light',
  )

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme ?? 'light')
    })

    return () => sub.remove()
  }, [])

  return scheme
}

export default useColorScheme
