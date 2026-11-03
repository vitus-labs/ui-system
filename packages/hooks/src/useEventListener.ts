import { type RefObject, useEffect, useRef } from 'react'
import useRefElement from './useRefElement'

type EventTargetLike = EventTarget | { current: EventTarget | null } | null

export type UseEventListener = <K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  target?: EventTargetLike,
  options?: AddEventListenerOptions | boolean,
) => void

/**
 * Subscribe to a DOM event with the right typing and cleanup. The
 * handler is captured via a ref so the registered listener stays stable
 * even when consumers pass a fresh closure each render — no re-attach
 * thrash.
 *
 * `target` defaults to `window` and may also be a ref (the ref is read
 * lazily inside the effect so it can change between renders).
 *
 * @example
 * ```ts
 * useEventListener('keydown', (e) => { if (e.key === 'Escape') onClose() })
 * useEventListener('click', onClickOutside, popoverRef)
 * ```
 */
const useEventListener: UseEventListener = (
  event,
  handler,
  target,
  options,
) => {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  // Ref targets are tracked as state so late-mounting elements get a listener.
  const isRef =
    target !== undefined && target !== null && 'current' in (target as object)
  const refNode = useRefElement(
    isRef ? (target as { current: EventTarget | null }) : null,
  )
  const resolved = isRef ? refNode : target

  // Depend on the option primitives, not the options object — an inline
  // `{ passive: true }` is a fresh object every render and would otherwise
  // detach/re-attach the listener on each render.
  const isBool = typeof options === 'boolean'
  const capture = isBool ? options : options?.capture
  const passive = isBool ? undefined : options?.passive
  const once = isBool ? undefined : options?.once
  const signal = isBool ? undefined : options?.signal

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const node = resolveTarget(resolved as EventTargetLike)
    if (!node || typeof node.addEventListener !== 'function') return undefined

    const listener: EventListener = (e) =>
      (handlerRef.current as (ev: Event) => void)(e)
    const opts: AddEventListenerOptions = { capture, passive, once, signal }
    node.addEventListener(event as string, listener, opts)
    return () =>
      node.removeEventListener(event as string, listener, { capture })
  }, [event, resolved, capture, passive, once, signal])
}

const resolveTarget = (
  target: EventTargetLike | undefined,
): EventTarget | null => {
  if (target === undefined) return typeof window === 'undefined' ? null : window
  if (target === null) return null
  if ('current' in (target as RefObject<EventTarget>)) {
    return (target as RefObject<EventTarget>).current
  }
  return target as EventTarget
}

export default useEventListener
