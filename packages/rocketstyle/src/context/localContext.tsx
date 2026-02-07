import { createContext, useContext } from 'react'
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

/**
 * Retrieves the local pseudo-state context. When a consumer callback
 * is provided, it transforms the raw context; otherwise returns defaults.
 */
type UseLocalContext = (context: any) => LocalContext
export const useLocalContext: UseLocalContext = (consumer) => {
  const ctx = consumer ? useContext(context) : {}
  const result = consumer ? consumer((callback: any) => callback(ctx)) : {}

  return { pseudo: {}, ...result }
}

export const LocalProvider = context.Provider

export default context
