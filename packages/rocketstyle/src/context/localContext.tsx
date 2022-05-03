import { createContext, useContext } from 'react'
import type { PseudoState } from '~/types/pseudo'

type LocalContext = Partial<
  {
    pseudo: PseudoState
  } & Record<string, string>
>

const context = createContext<LocalContext>({})

type UseLocalContext = (context: any) => LocalContext
export const useLocalContext: UseLocalContext = (consumer) => {
  const ctx = consumer ? useContext(context) : {}
  const result = consumer ? consumer((callback) => callback(ctx)) : {}

  return { pseudo: {}, ...result }
}

export const LocalProvider = context.Provider

export default context
