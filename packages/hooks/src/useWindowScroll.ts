import { useEffect, useState } from 'react'

export type WindowScroll = { x: number; y: number }

export type UseWindowScroll = () => WindowScroll

/**
 * Tracks the window scroll position as `{ x, y }`. Updates are throttled to
 * one per animation frame and the listener is passive. Returns `{0, 0}` on
 * the server and until mount.
 */
const useWindowScroll: UseWindowScroll = () => {
  const [pos, setPos] = useState<WindowScroll>({ x: 0, y: 0 })

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const x = window.scrollX
      const y = window.scrollY
      setPos((prev) => (prev.x === x && prev.y === y ? prev : { x, y }))
    }
    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      if (raf !== 0) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return pos
}

export default useWindowScroll
