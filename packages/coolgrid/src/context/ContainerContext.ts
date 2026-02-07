import { createContext } from 'react'
import type { Context } from '~/types'

/**
 * React context for container-level grid configuration.
 * Provided by the Container component and consumed by Row children
 * to inherit columns, gap, gutter, and other grid settings.
 */
export default createContext<Context>({})
