/**
 * React context for the dimension story renderer. Provides the wrapped
 * rocketstyle component reference to nested Item and PseudoList components
 * so they can render it without prop-drilling.
 */
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
