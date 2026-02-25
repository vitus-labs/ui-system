import useMediaQuery from './useMediaQuery'

export type UseReducedMotion = () => boolean

/**
 * Returns `true` when the user prefers reduced motion.
 * Use to disable or simplify animations for accessibility.
 */
const useReducedMotion: UseReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

export default useReducedMotion
