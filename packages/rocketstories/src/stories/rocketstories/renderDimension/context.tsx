import {
  type ComponentType,
  useContext as contextHook,
  createContext,
  type FC,
  type ReactNode,
} from 'react'

type Context = {
  component: ComponentType
}

export const context = createContext<Context>({} as Context)

export const useContext = () => contextHook(context)

const ContextProvider = context.Provider

const Provider: FC<Context & { children: ReactNode }> = ({
  children,
  ...props
}) => <ContextProvider value={props}>{children}</ContextProvider>

export default Provider
