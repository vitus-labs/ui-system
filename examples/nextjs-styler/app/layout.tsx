import type { Metadata } from 'next'
import Providers from './providers'
import StylerRegistry from './registry'

export const metadata: Metadata = {
  title: 'Next.js + Styler — @vitus-labs/ui-system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <StylerRegistry>
          <Providers>{children}</Providers>
        </StylerRegistry>
      </body>
    </html>
  )
}
