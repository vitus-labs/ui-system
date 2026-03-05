import { createContext, useContext, useMemo } from 'react'
import type { PseudoState } from '~/types/pseudo'

type LocalContext = Partial<
  {
    pseudo: PseudoState
  } & Record<string, string>
>

/**
 * Local context for propagating pseudo-state (hover, focus, pressed)
 * and additional styling attributes from a parent provider component
 * to its rocketstyle children.
 */
const context = createContext<LocalContext>({})

const EMPTY_CTX = { pseudo: {} } as LocalContext

/**
 * Retrieves the local pseudo-state context. When a consumer callback
 * is provided, it transforms the raw context; otherwise returns defaults.
 */
type UseLocalContext = (consumer: any) => LocalContext
export const useLocalContext: UseLocalContext = (consumer) => {
  const ctx = useContext(context)

  return useMemo(() => {
    if (!consumer) return EMPTY_CTX

    const result = consumer((callback: any) => callback(ctx))
    return { pseudo: {}, ...result }
  }, [consumer, ctx])
}

export const LocalProvider = context.Provider

export default context
