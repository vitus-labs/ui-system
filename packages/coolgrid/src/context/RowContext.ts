import { createContext } from 'react'
import type { Context } from '~/types'

/**
 * React context for row-level grid configuration.
 * Provided by the Row component and consumed by Col children
 * to inherit columns, gap, gutter, and sizing for width calculations.
 */
export default createContext<Context>({})
