'use client'

import { init, Provider } from '@vitus-labs/core'
import * as connector from '@vitus-labs/connector-emotion'
import type { ReactNode } from 'react'

init(connector)

const theme = {
  rootSize: 16,
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
}

export default function Providers({ children }: { children: ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>
}
