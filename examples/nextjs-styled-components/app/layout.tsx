import type { Metadata } from 'next'
import StyledComponentsRegistry from './registry'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Next.js + styled-components — @vitus-labs/ui-system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
