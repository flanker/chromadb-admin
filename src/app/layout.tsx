import '@mantine/notifications/styles.css'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
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
          <MantineProvider>
            <Notifications />
            {children}
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
