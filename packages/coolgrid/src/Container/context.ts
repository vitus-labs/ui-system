import { createContext } from 'react'

interface Context {
  breakpoints?: object
  columns?: number
  coolgrid?: object
  rowCss?: object
  rowComponent?: React.ReactNode
}

export default createContext<Context>({})