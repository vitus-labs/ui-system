import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from 'react'

export interface Context {
  blocked: boolean
  setBlocked: () => void
  setUnblocked: () => void
}

const context = createContext<Context>({} as Context)

const { Provider } = context

export const useOverlayContext = () => useContext(context)

const Component: FC<Context & { children: ReactNode }> = ({
  children,
  blocked,
  setBlocked,
  setUnblocked,
}) => {
  const ctx = useMemo(
    () => ({
      blocked,
      setBlocked,
      setUnblocked,
    }),
    [blocked, setBlocked, setUnblocked],
  )

  return <Provider value={ctx}>{children}</Provider>
}

export default Component
