import { useEffect } from 'react'

type Cancellable<T extends (...args: any[]) => any> = T & { cancel: () => void }
type ThrottledNoArg = Cancellable<() => void>
type ThrottledEvt = Cancellable<(e: Event) => void>

type Config = {
  active: boolean
  type: string
  parentContainer: HTMLElement | null | undefined
  closeOn: string
  /** Reposition is called on every scroll/resize tick. */
  handleContentPosition: ThrottledNoArg
  /** Visibility is also re-evaluated on scroll. */
  handleVisibility: ThrottledEvt
}

/**
 * Window-level scroll/resize listeners that reposition active overlays and
 * re-evaluate close-on-scroll behavior. Body overflow lock for modal
 * overlays is intentionally NOT managed here — that's `useScrollLock`'s
 * job (wired into useOverlay.tsx). A prior duplicate counter here ran a
 * separate refcount that activated synchronously (before
 * `isContentLoaded`), letting useScrollLock capture 'hidden' as its
 * "original" value and silently leaving the page permanently locked on
 * async-mount modals.
 */
const useWindowReposition = (
  active: boolean,
  _type: string,
  handleContentPosition: ThrottledNoArg,
  handleVisibility: ThrottledEvt,
) => {
  useEffect(() => {
    if (!active) return undefined

    const onScroll = (e: Event) => {
      handleContentPosition()
      handleVisibility(e)
    }

    window.addEventListener('resize', handleContentPosition)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      handleContentPosition.cancel()
      handleVisibility.cancel()
      window.removeEventListener('resize', handleContentPosition)
      window.removeEventListener('scroll', onScroll)
    }
  }, [active, handleContentPosition, handleVisibility])
}

/**
 * Same as `useWindowReposition` but for a custom scrollable ancestor.
 * Locks the parent's overflow while the overlay is active (unless hover-driven,
 * which expects the parent to keep scrolling).
 */
const useParentContainerReposition = (
  active: boolean,
  parentContainer: HTMLElement | null | undefined,
  closeOn: string,
  handleContentPosition: ThrottledNoArg,
  handleVisibility: ThrottledEvt,
) => {
  useEffect(() => {
    if (!active || !parentContainer) return undefined

    if (closeOn !== 'hover') parentContainer.style.overflow = 'hidden'

    const onScroll = (e: Event) => {
      handleContentPosition()
      handleVisibility(e)
    }

    parentContainer.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      parentContainer.style.overflow = ''
      parentContainer.removeEventListener('scroll', onScroll)
    }
  }, [
    active,
    parentContainer,
    closeOn,
    handleContentPosition,
    handleVisibility,
  ])
}

const useScrollReposition = ({
  active,
  type,
  parentContainer,
  closeOn,
  handleContentPosition,
  handleVisibility,
}: Config) => {
  useWindowReposition(active, type, handleContentPosition, handleVisibility)
  useParentContainerReposition(
    active,
    parentContainer,
    closeOn,
    handleContentPosition,
    handleVisibility,
  )
}

export default useScrollReposition
