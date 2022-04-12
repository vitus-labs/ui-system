import React, {
  createContext,
  useContext as contextHook,
  FC,
  ComponentType,
} from 'react'

type Context = {
  component: ComponentType
}

export const context = createContext<Context>({} as Context)

export const useContext = () => contextHook(context)

const ContextProvider = context.Provider

const Provider: FC<Context> = ({ children, ...props }) => (
  <ContextProvider value={props}>{children}</ContextProvider>
)

export default Provider
