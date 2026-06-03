import { useEffect } from 'react'

type Cancellable<T extends (...args: any[]) => any> = T & { cancel: () => void }
type ThrottledNoArg = Cancellable<() => void>
type ThrottledEvt = Cancellable<(e: Event) => void>

type Config = {
  active: boolean
  parentContainer: HTMLElement | null | undefined
  closeOn: string
  handleContentPosition: ThrottledNoArg
  handleVisibility: ThrottledEvt
}

// Body-overflow lock is owned by `useScrollLock` (wired in useOverlay).
// Mixing it back in here previously activated synchronously and let
// useScrollLock capture 'hidden' as its "original" value — leaving the
// page silently scroll-locked on async-mount modals.
const useWindowReposition = (
  active: boolean,
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

// Locks the parent's overflow while the overlay is active, except when
// hover-driven (the parent must keep scrolling so the overlay can close).
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
  parentContainer,
  closeOn,
  handleContentPosition,
  handleVisibility,
}: Config) => {
  useWindowReposition(active, handleContentPosition, handleVisibility)
  useParentContainerReposition(
    active,
    parentContainer,
    closeOn,
    handleContentPosition,
    handleVisibility,
  )
}

export default useScrollReposition
