import { createContext, useContext } from 'react'
import type { PseudoState } from '~/types/pseudo'

type TLocalContext = Partial<
  {
    pseudo: PseudoState
  } & Record<string, unknown>
>

const context = createContext<TLocalContext>({})

type UseLocalContext = (context: any) => TLocalContext
export const useLocalContext: UseLocalContext = (consumer) => {
  const ctx = consumer ? useContext(context) : {}
  const result = consumer ? consumer((callback) => callback(ctx)) : {}

  return { pseudo: {}, ...result }
}

export const LocalProvider = context.Provider

export default context
