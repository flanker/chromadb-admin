import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vector UI',
  description: 'A UI for vector database',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <header>
          <h1>Vector UI</h1>
          <section>
            {children}
          </section>
        </header>
      </body>
    </html>
  )
}
