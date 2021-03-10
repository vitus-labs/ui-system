import { createContext } from 'react'
import type { PseudoState } from '~/types'

type TContext = Partial<
  {
    pseudo: PseudoState
  } & Record<string, unknown>
>

export default createContext<TContext>({})
