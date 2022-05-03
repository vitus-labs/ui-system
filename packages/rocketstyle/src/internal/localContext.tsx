import { createContext, useContext } from 'react'
import type { PseudoState } from '~/types/pseudo'

type TContext = Partial<
  {
    pseudo: PseudoState
  } & Record<string, unknown>
>

const context = createContext<TContext>({})

export const useLocalContext = (isConsumer = false) =>
  isConsumer ? useContext(context) : {}

export const LocalProvider = context.Provider

export default context
