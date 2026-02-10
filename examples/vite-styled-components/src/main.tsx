import { init } from '@vitus-labs/core'
import * as connector from '@vitus-labs/connector-styled-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

init(connector)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
