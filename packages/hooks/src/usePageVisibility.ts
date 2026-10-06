import { useSyncExternalStore } from 'react'

export type UsePageVisibility = () => boolean

const subscribe = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

const getSnapshot = () => document.visibilityState !== 'hidden'
const getServerSnapshot = () => true

/**
 * Returns `true` while the page/tab is visible (`document.visibilityState`),
 * `false` when hidden. Assumes visible on the server.
 */
const usePageVisibility: UsePageVisibility = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export default usePageVisibility
