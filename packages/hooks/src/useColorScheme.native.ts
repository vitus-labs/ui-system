import { useEffect, useState } from 'react'
import { Appearance } from 'react-native'

export type UseColorScheme = () => 'light' | 'dark'

const toScheme = (value: string | null | undefined): 'light' | 'dark' =>
  value === 'dark' ? 'dark' : 'light'

/**
 * Returns the user's preferred color scheme (`"light"` or `"dark"`).
 * Uses React Native's `Appearance` API and subscribes to changes.
 */
const useColorScheme: UseColorScheme = () => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(() =>
    toScheme(Appearance.getColorScheme()),
  )

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(toScheme(colorScheme))
    })

    return () => sub.remove()
  }, [])

  return scheme
}

export default useColorScheme
