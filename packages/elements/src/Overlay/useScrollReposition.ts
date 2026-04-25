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

// Reference counter for nested modals sharing document.body overflow lock.
// Only the first modal sets overflow:hidden; only the last restores it.
let modalOverflowCount = 0

/**
 * Window-level scroll/resize listeners that reposition active overlays and
 * re-evaluate close-on-scroll behavior. Also manages the body overflow lock
 * for modal overlays (refcounted across nested modals).
 */
const useWindowReposition = (
  active: boolean,
  type: string,
  handleContentPosition: ThrottledNoArg,
  handleVisibility: ThrottledEvt,
) => {
  useEffect(() => {
    if (!active) return undefined

    const shouldSetOverflow = type === 'modal'

    const onScroll = (e: Event) => {
      handleContentPosition()
      handleVisibility(e)
    }

    if (shouldSetOverflow) {
      modalOverflowCount++
      if (modalOverflowCount === 1) document.body.style.overflow = 'hidden'
    }
    window.addEventListener('resize', handleContentPosition)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      handleContentPosition.cancel()
      handleVisibility.cancel()
      if (shouldSetOverflow) {
        modalOverflowCount--
        if (modalOverflowCount === 0) document.body.style.overflow = ''
      }
      window.removeEventListener('resize', handleContentPosition)
      window.removeEventListener('scroll', onScroll)
    }
  }, [active, type, handleContentPosition, handleVisibility])
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
