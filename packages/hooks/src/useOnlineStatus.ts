import { useSyncExternalStore } from 'react'

export type UseOnlineStatus = () => boolean

const subscribe = (onChange: () => void) => {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

const getSnapshot = () => navigator.onLine
const getServerSnapshot = () => true

/**
 * Tracks `navigator.onLine` and the `online` / `offline` events.
 * Assumes online on the server.
 */
const useOnlineStatus: UseOnlineStatus = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export default useOnlineStatus
