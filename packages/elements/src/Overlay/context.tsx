import React, { FC, createContext, useContext } from 'react'

type Context = {
  blocked: boolean
  setBlocked: () => void
  setUnblocked: () => void
}

const context = createContext<Context>({} as Context)

const { Provider } = context

export const useOverlayContext = () => useContext(context)

const component: FC<Context> = ({
  children,
  blocked,
  setBlocked,
  setUnblocked,
}) => (
  <Provider value={{ blocked, setBlocked, setUnblocked }}>{children}</Provider>
)

export default component