import '@mantine/core/styles.css'
import './globals.css'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'

import ReactQueryProvider from '@/app/ReactQueryProvider'

import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chromadb Admin',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head suppressHydrationWarning>
        <ColorSchemeScript />
      </head>
      <body>
        <ReactQueryProvider>
          <MantineProvider>{children}</MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
