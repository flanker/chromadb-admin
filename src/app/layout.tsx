'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {MantineProvider, ColorSchemeScript} from '@mantine/core';
import '@mantine/core/styles.css'

const queryClient = new QueryClient()

export default function RootLayout({children}) {
  return (
    <html>
    <head suppressHydrationWarning>
      <ColorSchemeScript />
    </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            {children}
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
