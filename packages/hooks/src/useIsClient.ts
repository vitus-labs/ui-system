import { useEffect, useState } from 'react'

export type UseIsClient = () => boolean

/**
 * Returns `false` on the server and during the first client render (so it
 * matches server HTML during hydration), then `true` after mount.
 *
 * @example
 * ```tsx
 * const isClient = useIsClient()
 * return isClient ? <ClientOnlyWidget /> : null
 * ```
 */
const useIsClient: UseIsClient = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  return isClient
}

export default useIsClient
